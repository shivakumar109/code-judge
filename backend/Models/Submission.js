import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  code: {
    type: String,
    required: [true, 'Code submission cannot be empty'],
  },
  language: {
    type: String,
    required: [true, 'Language selection is required'],
  },
  runtime: {
    type: Number, // Execution time in milliseconds (or seconds if float, let's store ms or float)
    default: 0,
  },
  memory: {
    type: Number, // Execution memory in KB
    default: 0,
  },
  status: {
    type: String,
    enum: [
      'Accepted',
      'Wrong Answer',
      'Time Limit Exceeded',
      'Runtime Error',
      'Compilation Error',
      'Internal Error',
      'Pending',
      'Running'
    ],
    required: true,
  },
  errorMessage: {
    type: String,
  },
}, {
  timestamps: true,
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
