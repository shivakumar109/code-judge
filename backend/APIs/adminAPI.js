import express from 'express';
import Problem from '../Models/Problem.js';
import User from '../Models/User.js';
import { verifyToken } from '../Middlewares/verifyToken.js';

const router = express.Router();

/**
 * GET /problems
 * Retrieve all coding challenges (including active, inactive, and full hidden test cases) for admin auditing.
 */
router.get('/problems', verifyToken('ADMIN'), async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: 'All problems retrieved successfully for administration',
      problems,
    });
  } catch (error) {
    console.error('Error fetching admin problems:', error);
    return res.status(500).json({ message: 'Internal server error while retrieving problem directory' });
  }
});

/**
 * POST /problems
 * Create a new coding problem (requires at least 3 hidden test cases).
 */
router.post('/problems', verifyToken('ADMIN'), async (req, res) => {
  try {
    const {
      title,
      description,
      constraints,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      explanation,
      difficulty,
      tags,
      hiddenTestCases,
    } = req.body;

    // 1. Validation check for required fields
    if (
      !title ||
      !description ||
      !constraints ||
      !inputFormat ||
      !outputFormat ||
      !sampleInput ||
      !sampleOutput ||
      !difficulty
    ) {
      return res.status(400).json({
        message: 'All core problem fields (title, description, constraints, inputFormat, outputFormat, sampleInput, sampleOutput, difficulty) are required',
      });
    }

    // 2. Validate hidden test cases requirement (at least 3)
    if (!hiddenTestCases || !Array.isArray(hiddenTestCases) || hiddenTestCases.length < 3) {
      return res.status(400).json({
        message: 'At least 3 hidden test cases are required for a problem submission',
      });
    }

    // Validate structure of test cases
    for (let i = 0; i < hiddenTestCases.length; i++) {
      const tc = hiddenTestCases[i];
      if (tc.input === undefined || tc.input === null || tc.output === undefined || tc.output === null) {
        return res.status(400).json({
          message: `Test case at index ${i} is missing 'input' or 'output'`,
        });
      }
    }

    // 3. Check for existing problem with same title
    const duplicate = await Problem.findOne({ title: title.trim() });
    if (duplicate) {
      return res.status(400).json({
        message: 'A problem with this title already exists',
      });
    }

    // 4. Create and save new problem
    const newProblem = new Problem({
      title: title.trim(),
      description: description.trim(),
      constraints: constraints.trim(),
      inputFormat: inputFormat.trim(),
      outputFormat: outputFormat.trim(),
      sampleInput: sampleInput.trim(),
      sampleOutput: sampleOutput.trim(),
      explanation: explanation ? explanation.trim() : '',
      difficulty,
      tags: Array.isArray(tags) ? tags.map(t => t.trim()) : [],
      hiddenTestCases,
      isProblemActive: true,
    });

    await newProblem.save();

    return res.status(201).json({
      message: 'Coding problem created successfully',
      problem: newProblem,
    });
  } catch (error) {
    console.error('Create Problem Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message),
      });
    }
    return res.status(500).json({ message: 'Internal server error while creating problem' });
  }
});

/**
 * PUT /problems/:problemId
 * Update an existing coding problem.
 */
router.put('/problems/:problemId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const { problemId } = req.params;
    const updateData = req.body;

    // 1. If hiddenTestCases is updated, validate it contains at least 3 items
    if (updateData.hiddenTestCases !== undefined) {
      const tc = updateData.hiddenTestCases;
      if (!Array.isArray(tc) || tc.length < 3) {
        return res.status(400).json({
          message: 'At least 3 hidden test cases are required if updating test cases',
        });
      }

      for (let i = 0; i < tc.length; i++) {
        if (tc[i].input === undefined || tc[i].input === null || tc[i].output === undefined || tc[i].output === null) {
          return res.status(400).json({
            message: `Test case at index ${i} is missing 'input' or 'output'`,
          });
        }
      }
    }

    // 2. Prevent title duplicates if title is being changed
    if (updateData.title) {
      const duplicate = await Problem.findOne({
        title: updateData.title.trim(),
        _id: { $ne: problemId }
      });
      if (duplicate) {
        return res.status(400).json({
          message: 'Another problem with this title already exists',
        });
      }
    }

    // 3. Find and update the problem
    const updatedProblem = await Problem.findByIdAndUpdate(
      problemId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    return res.status(200).json({
      message: 'Problem updated successfully',
      problem: updatedProblem,
    });
  } catch (error) {
    console.error('Update Problem Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message),
      });
    }
    return res.status(500).json({ message: 'Internal server error while updating problem' });
  }
});

/**
 * DELETE /problems/:problemId
 * Soft delete a problem using isProblemActive field.
 */
router.delete('/problems/:problemId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findByIdAndUpdate(
      problemId,
      { $set: { isProblemActive: false } },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    return res.status(200).json({
      message: 'Problem soft-deleted successfully',
      problemId: problem._id,
      isProblemActive: problem.isProblemActive,
    });
  } catch (error) {
    console.error('Delete Problem Error:', error);
    return res.status(500).json({ message: 'Internal server error while deleting problem' });
  }
});

/**
 * PUT /block-user/:userId
 * Block a user account (set isActive = false).
 */
router.put('/block-user/:userId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent blocking oneself if user is the admin making the request
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot block your own administrative account' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive: false } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User blocked successfully',
      user,
    });
  } catch (error) {
    console.error('Block User Error:', error);
    return res.status(500).json({ message: 'Internal server error while blocking user' });
  }
});

/**
 * PUT /unblock-user/:userId
 * Unblock a user account (set isActive = true).
 */
router.put('/unblock-user/:userId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive: true } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User unblocked successfully',
      user,
    });
  } catch (error) {
    console.error('Unblock User Error:', error);
    return res.status(500).json({ message: 'Internal server error while unblocking user' });
  }
});

/**
 * GET /leaderboard
 * Admin version of the leaderboard showing all users (active/inactive), including registration dates and emails.
 */
router.get('/leaderboard', verifyToken('ADMIN'), async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('firstName lastName username email points solvedProblems isActive createdAt profileImage')
      .sort({ points: -1, createdAt: 1 });

    const leaderboard = users.map(u => ({
      _id: u._id,
      name: `${u.firstName} ${u.lastName}`,
      username: u.username,
      email: u.email,
      points: u.points,
      solvedCount: u.solvedProblems ? u.solvedProblems.length : 0,
      isActive: u.isActive,
      createdAt: u.createdAt,
      profileImage: u.profileImage,
    }));

    return res.status(200).json({
      message: 'Administrative leaderboard retrieved successfully',
      leaderboard,
    });
  } catch (error) {
    console.error('Admin Leaderboard Error:', error);
    return res.status(500).json({ message: 'Internal server error while fetching administrative leaderboard' });
  }
});

export default router;
