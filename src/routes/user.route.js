import express from 'express';
import UserController from '../controllers/user.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', UserController.getAll);
router.get('/:id', AuthMiddleware.authorizeUser, UserController.getById);
router.post('/register', upload({ fieldName: 'image', maxFiles: 1 }), UserController.register);
router.post('/login', UserController.login);
router.put('/:id', AuthMiddleware.authorizeUser, UserController.editUser);
router.put('/image/:id', AuthMiddleware.authorizeUser, upload({ fieldName: 'image', maxFiles: 1 }), UserController.editProfileImage);

export default router;