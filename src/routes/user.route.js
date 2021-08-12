import express from 'express';
import UserController from '../controllers/user.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', AuthMiddleware.authorizeUser, UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/register', UserController.register);
router.post('/login', UserController.login);

export default router;