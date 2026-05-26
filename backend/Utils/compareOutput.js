/**
 * Compare user code stdout with expected test case output.
 * Normalizes differences in line endings (\r\n vs \n), 
 * trailing spaces, and trailing empty lines.
 */
export const compareOutput = (userOutput, expectedOutput) => {
  if (userOutput === undefined || userOutput === null) userOutput = '';
  if (expectedOutput === undefined || expectedOutput === null) expectedOutput = '';

  // Helper to split and clean up lines
  const getCleanLines = (str) => {
    return str
      .toString()
      .replace(/\r\n/g, '\n') // Normalize CRLF to LF
      .replace(/\r/g, '\n')
      .split('\n')
      .map(line => line.trimEnd()) // Trim trailing spaces for each line
      .filter((line, index, arr) => {
        // Remove trailing blank lines at the end of the output
        if (line === '') {
          return arr.slice(index).some(l => l.trim() !== '');
        }
        return true;
      });
  };

  const userLines = getCleanLines(userOutput);
  const expectedLines = getCleanLines(expectedOutput);

  if (userLines.length !== expectedLines.length) {
    return false;
  }

  for (let i = 0; i < userLines.length; i++) {
    if (userLines[i] !== expectedLines[i]) {
      return false;
    }
  }

  return true;
};

export default compareOutput;
