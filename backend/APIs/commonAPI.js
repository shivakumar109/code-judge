import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

const router = express.Router();

/**
 * POST /register
 * Register a new user account.
 */
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, role } = req.body;

    // 1. Basic input validation
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({
        message: 'All fields (firstName, lastName, username, email, password) are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanUsername = username.trim();

    // 2. Check if username or email is already registered
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: cleanUsername }],
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // 3. Hash password using bcryptjs
    const hashedPassword = await bcrypt.hash(password,10);

    // 4. Create new user
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: cleanUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role: role && ['user', 'admin'].includes(role) ? role : 'user',
    });

    await newUser.save();
    // 5. Respond with created user details (exclude password)
    const userResponse = await User.findById(newUser._id).select('-password');
    return res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message),
      });
    }
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
});

/**
 * POST /login
 * Authenticate user, generate JWT, and set httpOnly cookie.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // 1. Basic input validation
    if ((!email && !username) || !password) {
      return res.status(400).json({
        message: 'Please provide either (email or username) and password',
      });
    }

    // 2. Find user by email or username
    const query = {};
    if (email) {
      query.email = email.toLowerCase().trim();
    } else {
      query.username = username.trim();
    }

    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Check if user account is blocked/disabled
    if (!user.isActive) {
      return res.status(403).json({
        message: 'Your account is currently disabled. Please contact administration.',
      });
    }

    // 4. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 5. Generate JWT Token
    const token = jwt.sign(
      {userId: user._id,
          role:user.role,
          email: user.email,
          firstName: user.firstName,},
          process.env.JWT_SECRET,{
          expiresIn:"1h"
     });

    // 6. Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/"
    });
    // 7. Send successful login response (exclude password)
    const userResponse = await User.findById(user._id).select('-password');
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
});

/**
 * POST /logout
 * Log out user by clearing the JWT token cookie.
 */
router.get("/logout",async(req,res)=>{
     //clear all the cookies
     //must match orginal settings
     res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });
    res.status(200).json({message:"loged out sucessfully"})
})

export default router;
