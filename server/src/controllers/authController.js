import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createToken } from '../utils/token.js';

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    throw new AppError('Name, email and password are required', 400);
  }

  const exists = await User.exists({ email: email.trim().toLowerCase() });
  if (exists) throw new AppError('An account with this email already exists', 409);

  const user = await User.create({ name, email, password });
  const token = createToken(user._id);

  res.status(201).json({ success: true, token, user: sanitizeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email?.trim() || !password) throw new AppError('Email and password are required', 400);

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = createToken(user._id);
  res.json({ success: true, token, user: sanitizeUser(user) });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
});
