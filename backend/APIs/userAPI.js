import express from 'express';
import Problem from '../Models/Problem.js';
import User from '../Models/User.js';
import Submission from '../Models/Submission.js';
import { verifyToken } from '../Middlewares/verifyToken.js';
import { executeTestCases, runCode } from '../Services/judge0.service.js';
import { getLanguageId } from '../Utils/judge0Map.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

/**
 * GET /profile
 * Fetch logged-in user's profile details including score (points) and solved problems.
 */
router.get('/profile', verifyToken('USER'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('firstName lastName username email points solvedProblems profileImage isActive')
      .populate({
        path: 'solvedProblems',
        select: 'title difficulty tags',
        match: { isProblemActive: true }
      });

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    return res.status(200).json({
      message: 'Profile retrieved successfully',
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        points: user.points,
        solvedProblems: user.solvedProblems,
        profileImage: user.profileImage,
        isActive: user.isActive,
        solvedCount: user.solvedProblems.length
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error while fetching profile' });
  }
});

/**
 * GET /problems
 * Fetch all active coding problems. Never exposes hiddenTestCases.
 */
router.get('/problems', verifyToken('USER'), async (req, res) => {
  try {
    // Only return active problems, exclude hiddenTestCases for security
    const problems = await Problem.find({ isProblemActive: true })
      .select('-hiddenTestCases')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Active problems fetched successfully',
      problems,
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    return res.status(500).json({ message: 'Internal server error while fetching problems' });
  }
});

/**
 * GET /problem/:problemId
 * Fetch details of a single active problem. Never exposes hiddenTestCases.
 */
router.get('/problem/:problemId', verifyToken('USER'), async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findOne({ _id: problemId, isProblemActive: true })
      .select('-hiddenTestCases');

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found or is inactive' });
    }

    return res.status(200).json({
      message: 'Problem details fetched successfully',
      problem,
    });
  } catch (error) {
    console.error('Error fetching single problem:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid problem ID format' });
    }
    return res.status(500).json({ message: 'Internal server error while fetching problem' });
  }
});

/**
 * POST /submit
 * Submit code to Judge0, evaluate hidden test cases, update solvedProblems and points.
 */
router.post('/submit', verifyToken('USER'), async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    // 1. Inputs validation
    if (!problemId || !code || !language) {
      return res.status(400).json({
        message: 'problemId, code, and language fields are required',
      });
    }

    // 2. Map language string to Judge0 language ID
    const languageId = getLanguageId(language);
    if (!languageId) {
      return res.status(400).json({
        message: `Language '${language}' is not supported. Supported languages: javascript, python, cpp, java`,
      });
    }

    // 3. Find problem (including hidden test cases to run on Judge0)
    const problem = await Problem.findOne({ _id: problemId, isProblemActive: true });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found or is inactive' });
    }

    if (!problem.hiddenTestCases || problem.hiddenTestCases.length === 0) {
      return res.status(500).json({
        message: 'No test cases are defined for this problem. Please contact administration.',
      });
    }

    // 4. Run test cases sequentially using Judge0 service
    // This handles queuing, polling, comparing outputs, and early fail-fast logic
    const runResult = await executeTestCases(code, languageId, problem.hiddenTestCases);

    // 5. Calculate passed testcases
    const totalCases = problem.hiddenTestCases.length;
    const passedCases = runResult.success ? totalCases : (runResult.failedAt - 1);

    // 6. Save submission history
    const submission = new Submission({
      user: req.user._id,
      problem: problemId,
      code,
      language: language.toLowerCase().trim(),
      runtime: runResult.runtime || 0,
      memory: runResult.memory || 0,
      status: runResult.status,
      errorMessage: runResult.stderr || runResult.compileOutput || '',
    });

    await submission.save();

    // 7. Update User's solvedProblems and points if successfully solved ('Accepted')
    let pointsAwarded = 0;
    let firstTimeSolved = false;

    if (runResult.status === 'Accepted') {
      const user = await User.findById(req.user._id);

      // Check if this problem has been successfully solved before
      const alreadySolved = user.solvedProblems.includes(problemId);

      if (!alreadySolved) {
        firstTimeSolved = true;
        user.solvedProblems.push(problemId);

        // Assign points based on difficulty
        const difficulty = problem.difficulty || 'Easy';
        if (difficulty === 'Hard') {
          pointsAwarded = 30;
        } else if (difficulty === 'Medium') {
          pointsAwarded = 20;
        } else {
          pointsAwarded = 10;
        }

        user.points += pointsAwarded;
        await user.save();
      }
    }

    // 8. Prepare user response (never return hidden testcases)
    return res.status(201).json({
      message: runResult.status === 'Accepted'
        ? (firstTimeSolved ? `Congratulations! You solved the problem and gained ${pointsAwarded} points!` : 'Accepted!')
        : `Submission returned: ${runResult.status}`,
      submission: {
        _id: submission._id,
        language: submission.language,
        runtime: submission.runtime,
        memory: submission.memory,
        status: submission.status,
        errorMessage: submission.errorMessage,
        createdAt: submission.createdAt,
      },
      evaluation: {
        success: runResult.success,
        passedCases,
        totalCases,
        failedAtCase: runResult.success ? null : runResult.failedAt,
        // Provide sample or run diagnostics but never disclose hidden cases details
        status: runResult.status,
      },
    });
  } catch (error) {
    console.error('Submission Error:', error);
    return res.status(500).json({ message: 'Internal server error during code submission evaluation' });
  }
});

/**
 * GET /submissions
 * Fetch submission history for the logged-in user.
 */
router.get('/submissions', verifyToken('USER'), async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('problem', 'title difficulty')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'User submission history fetched successfully',
      submissions,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({ message: 'Internal server error while fetching submission history' });
  }
});

/**
 * GET /leaderboard
 * Fetch global leaderboard (users sorted by points descending).
 */
router.get('/leaderboard', verifyToken('USER'), async (req, res) => {
  try {
    // Only active users with role 'user' can participate in the public leaderboard
    const leaderboard = await User.find({ role: 'user', isActive: true })
      .select('username points solvedProblems profileImage')
      .sort({ points: -1, createdAt: 1 }); // Secondary sort by creation time (older accounts preferred on tie)

    // Map to include solved count in the output
    const formattedLeaderboard = leaderboard.map(u => ({
      _id: u._id,
      username: u.username,
      points: u.points,
      profileImage: u.profileImage,
      solvedCount: u.solvedProblems ? u.solvedProblems.length : 0,
    }));

    return res.status(200).json({
      message: 'Leaderboard fetched successfully',
      leaderboard: formattedLeaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ message: 'Internal server error while fetching leaderboard' });
  }
});

/**
 * POST /run
 * Dry-run user code against problem sample test cases and optional custom input.
 */
router.post('/run', verifyToken('USER'), async (req, res) => {
  try {
    const { problemId, code, language, customInput } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({
        message: 'problemId, code, and language fields are required',
      });
    }

    const languageId = getLanguageId(language);
    if (!languageId) {
      return res.status(400).json({
        message: `Language '${language}' is not supported.`,
      });
    }

    const problem = await Problem.findOne({ _id: problemId, isProblemActive: true });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found or is inactive' });
    }

    // 1. Run the sample/base test case
    const sampleInput = problem.sampleInput;
    const sampleExpectedOutput = problem.sampleOutput;

    const sampleResult = await runCode(code, languageId, sampleInput);

    let customResult = null;
    // 2. Run the custom input test case if provided
    if (customInput !== undefined && customInput !== null && customInput.trim() !== '') {
      customResult = await runCode(code, languageId, customInput);
    }

    return res.status(200).json({
      message: 'Run execution completed',
      sampleResult: {
        input: sampleInput,
        expected: sampleExpectedOutput,
        actual: sampleResult.stdout || '',
        status: sampleResult.status,
        statusId: sampleResult.statusId,
        stderr: sampleResult.stderr || '',
        compileOutput: sampleResult.compileOutput || '',
        runtime: sampleResult.runtime,
        memory: sampleResult.memory,
      },
      customResult: customResult ? {
        input: customInput,
        actual: customResult.stdout || '',
        status: customResult.status,
        statusId: customResult.statusId,
        stderr: customResult.stderr || '',
        compileOutput: customResult.compileOutput || '',
        runtime: customResult.runtime,
        memory: customResult.memory,
      } : null,
    });
  } catch (error) {
    console.error('Run code error:', error);
    return res.status(500).json({ message: 'Internal server error while running code' });
  }
});

/**
 * PUT /profile
 * Allow authenticated users to edit profile details (firstName, lastName, username, email, password, profileImage).
 */
router.put('/profile', verifyToken('USER'), async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, username, email, password, profileImage } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate and update username
    if (username && username.trim() !== user.username) {
      const existingUser = await User.findOne({ username: username.trim() });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      user.username = username.trim();
    }

    // Validate and update email
    if (email && email.toLowerCase().trim() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
      user.email = email.toLowerCase().trim();
    }

    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (profileImage) user.profileImage = profileImage.trim();

    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        points: user.points,
        solvedProblems: user.solvedProblems,
        profileImage: user.profileImage,
        isActive: user.isActive,
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message),
      });
    }
    return res.status(500).json({ message: 'Internal server error while updating profile' });
  }
});

/**
 * GET /submissions/:submissionId
 * Retrieve full details of a specific past submission.
 */
router.get('/submissions/:submissionId', verifyToken('USER'), async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await Submission.findOne({ _id: submissionId, user: req.user._id })
      .populate('problem', 'title difficulty tags description constraints inputFormat outputFormat sampleInput sampleOutput explanation');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found or unauthorized' });
    }

    return res.status(200).json({
      message: 'Submission retrieved successfully',
      submission,
    });
  } catch (error) {
    console.error('Error fetching single submission:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid submission ID format' });
    }
    return res.status(500).json({ message: 'Internal server error while fetching submission' });
  }
});

export default router;