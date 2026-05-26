import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
  },
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Problem description is required'],
  },
  constraints: {
    type: String,
    required: [true, 'Problem constraints are required'],
  },
  inputFormat: {
    type: String,
    required: [true, 'Input format is required'],
  },
  outputFormat: {
    type: String,
    required: [true, 'Output format is required'],
  },
  sampleInput: {
    type: String,
    required: [true, 'Sample input is required'],
  },
  sampleOutput: {
    type: String,
    required: [true, 'Sample output is required'],
  },
  explanation: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty level is required'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  hiddenTestCases: {
    type: [testCaseSchema],
    required: [true, 'At least 3 hidden test cases are required'],
    validate: [
      (val) => val.length >= 3,
      'A problem must contain at least 3 hidden test cases'
    ],
  },
  isProblemActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
