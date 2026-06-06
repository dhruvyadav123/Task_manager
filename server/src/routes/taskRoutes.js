import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  toggleTask,
  updateTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.route('/').get(listTasks).post(createTask);
router.patch('/:id/toggle', toggleTask);
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);
export default router;
