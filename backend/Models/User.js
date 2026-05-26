import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
  },

  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
  },

  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  profileImage: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  },

  points: {
    type: Number,
    default: 0,
  },

  solvedProblems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
    }
  ],

}, {
  timestamps: true,
  strict:"throw",
  versionKey:false
});

const User = mongoose.model('User', userSchema);

export default User;