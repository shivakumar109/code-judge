import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

export const verifyToken = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      let token;

      // 1. Check Authorization header
      if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }  
      // 2. Fallback to req.cookies (if cookie-parser is configured)
      else if (req.cookies?.token) {
        token = req.cookies.token;
      } 
      // 3. Fallback to manual parsing from req.headers.cookie (zero dependency setup)
      else if (req.headers.cookie) {
        const cookieToken = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('token='));
        if (cookieToken) {
          token = cookieToken.split('=')[1];
        }
      }

      // No token found
      if (!token) {
        return res.status(401).json({
          message: 'Unauthorized request. Please login'
        });
      }

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Fetch user to attach user info and verify active role
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      // Check if user account is disabled/inactive
      if (!user.isActive) {
        return res.status(403).json({
          message: 'Your account is currently disabled. Please contact administration.'
        });
      }

      // Role authorization check: 'admin' role automatically inherits all 'user' privileges
      if (
        requiredRole &&
        user.role.toLowerCase() !== requiredRole.toLowerCase() &&
        user.role.toLowerCase() !== 'admin'
      ) {
        return res.status(403).json({
          message: "Forbidden. You don't have permission"
        });
      }

      // Attach user to request
      req.user = user;

      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Session expired. Please login again'
        });
      }

      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          message: 'Invalid token. Please login again'
        });
      }

      console.error('JWT Verification Error:', err.message);
      return res.status(500).json({
        message: 'Server error during authentication'
      });
    }
  };
};

export default verifyToken;
