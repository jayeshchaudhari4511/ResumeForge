import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, profile } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      throw new ApiError('Please provide name, email, and password', 400);
    }

    if (password.length < 6) {
      throw new ApiError('Password must be at least 6 characters long', 400);
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      throw new ApiError('An account with this email already exists', 400);
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      profile: profile || {},
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        createdAt: user.createdAt,
      },
      message: 'Account created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      throw new ApiError('Please provide an email and password', 400);
    }

    // Check for user and include password field for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        createdAt: user.createdAt,
      },
      message: 'Logged in successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user details
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
