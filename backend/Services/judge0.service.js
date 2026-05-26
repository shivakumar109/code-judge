import judge0Client from '../Config/judge0.js';
import compareOutput from '../Utils/compareOutput.js';

const encodeBase64 = (str) => {
  if (!str) return '';
  return Buffer.from(str).toString('base64');
};

const decodeBase64 = (str) => {
  if (!str) return '';
  return Buffer.from(str, 'base64').toString('utf8');
};

/**
 * Polls Judge0 submission until completion.
 */
const pollSubmission = async (token) => {
  const maxAttempts = 30;
  const delayMs = 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await judge0Client.get(`/submissions/${token}?base64_encoded=true`);
      const data = response.data;
      const statusId = data.status.id;

      // Status 1 = In Queue, 2 = Processing. If not these, execution has completed.
      if (statusId !== 1 && statusId !== 2) {
        return data;
      }
    } catch (error) {
      console.error(`Polling Error (Attempt ${attempt}):`, error.message);
    }

    // Wait before polling again
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error('Code execution timed out on Judge0 server');
};

/**
 * Runs a single code draft with a specific input (stdin).
 */
export const runCode = async (code, languageId, stdin = '') => {
  try {
    const payload = {
      source_code: encodeBase64(code),
      language_id: languageId,
      stdin: encodeBase64(stdin),
    };

    const response = await judge0Client.post('/submissions?base64_encoded=true&wait=false', payload);
    const { token } = response.data;

    if (!token) {
      throw new Error('Did not receive submission token from Judge0');
    }

    const result = await pollSubmission(token);

    return {
      status: result.status.description,
      statusId: result.status.id,
      stdout: decodeBase64(result.stdout),
      stderr: decodeBase64(result.stderr),
      compileOutput: decodeBase64(result.compile_output),
      runtime: result.time ? Math.round(parseFloat(result.time) * 1000) : 0, // convert to ms
      memory: result.memory || 0, // KB
    };
  } catch (error) {
    console.error('Judge0 runCode Service Error:', error.message);
    return {
      status: 'Internal Error',
      statusId: 13,
      stdout: '',
      stderr: error.message,
      compileOutput: '',
      runtime: 0,
      memory: 0,
    };
  }
};

/**
 * Runs code against multiple hidden test cases.
 * Sequentially tests to optimize Judge0 bandwidth and fail fast (LeetCode style).
 */
export const executeTestCases = async (code, languageId, testCases) => {
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const runResult = await runCode(code, languageId, tc.input);

    if (runResult.statusId !== 3) { // 3 = Accepted on Judge0
      // Map compile errors or runtime failures immediately
      let statusName = 'Runtime Error';
      if (runResult.statusId === 6) statusName = 'Compilation Error';
      if (runResult.statusId === 5) statusName = 'Time Limit Exceeded';

      return {
        success: false,
        failedAt: i + 1,
        totalCases: testCases.length,
        status: statusName,
        compileOutput: runResult.compileOutput,
        stderr: runResult.stderr,
        input: tc.input,
        expected: tc.output,
        actual: runResult.stdout || runResult.stderr || '',
        runtime: runResult.runtime,
        memory: runResult.memory,
      };
    }

    const isCorrect = compareOutput(runResult.stdout, tc.output);

    if (!isCorrect) {
      return {
        success: false,
        failedAt: i + 1,
        totalCases: testCases.length,
        status: 'Wrong Answer',
        compileOutput: '',
        stderr: '',
        input: tc.input,
        expected: tc.output,
        actual: runResult.stdout,
        runtime: runResult.runtime,
        memory: runResult.memory,
      };
    }

    results.push(runResult);
  }

  // Calculate average runtime and memory
  const totalRuntime = results.reduce((acc, r) => acc + r.runtime, 0);
  const totalMemory = results.reduce((acc, r) => acc + r.memory, 0);

  return {
    success: true,
    totalCases: testCases.length,
    status: 'Accepted',
    runtime: Math.round(totalRuntime / testCases.length),
    memory: Math.round(totalMemory / testCases.length),
  };
};

export default {
  runCode,
  executeTestCases,
};
