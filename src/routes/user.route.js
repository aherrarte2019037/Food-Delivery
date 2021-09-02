import express from 'express';
import UserController from '../controllers/user.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../utils/uploadMulter.js';

const router = express.Router();

router.get('/', UserController.getAll);
router.get('/:id', AuthMiddleware.authorizeUser, UserController.getById);
router.post('/register', upload.array('image', 1), UserController.register);
router.post('/login', UserController.login);
router.put('/:id', AuthMiddleware.authorizeUser, UserController.editUser);
router.put('/image/:id', AuthMiddleware.authorizeUser, upload.array('image', 1), UserController.editProfileImage);

export default router;