import { Task } from '../models/Task.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const findOwnedTask = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) throw new AppError('Task not found', 404);
  return task;
};

export const listTasks = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);
  const skip = (page - 1) * limit;
  const status = req.query.status;
  const search = req.query.search?.trim();

  const filter = { userId: req.user._id };
  if (['pending', 'completed'].includes(status)) filter.status = status;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const [tasks, total, pendingCount, completedCount] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(filter),
    Task.countDocuments({ userId: req.user._id, status: 'pending' }),
    Task.countDocuments({ userId: req.user._id, status: 'completed' }),
  ]);

  res.json({
    success: true,
    tasks,
    stats: { total: pendingCount + completedCount, pending: pendingCount, completed: completedCount },
    pagination: { page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) },
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description = '', status = 'pending' } = req.body;
  if (!title?.trim()) throw new AppError('Task title is required', 400);

  const task = await Task.create({ title, description, status, userId: req.user._id });
  res.status(201).json({ success: true, task });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);
  res.json({ success: true, task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);
  const allowed = ['title', 'description', 'status'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });
  await task.save();
  res.json({ success: true, task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);
  await task.deleteOne();
  res.json({ success: true, message: 'Task deleted successfully' });
});

export const toggleTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);
  task.status = task.status === 'completed' ? 'pending' : 'completed';
  await task.save();
  res.json({ success: true, task });
});
