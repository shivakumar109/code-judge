const judge0Map = {
  'cpp': 54,        // C++ (GCC 9.2.0)
  'python': 71,     // Python (3.8.1)
  'javascript': 63, // JavaScript (Node.js 12.14.0)
  'java': 62        // Java (JDK 13.0.1)
};

export const getLanguageId = (lang) => {
  const normalized = lang.toLowerCase().trim();
  return judge0Map[normalized] || null;
};

export default judge0Map;