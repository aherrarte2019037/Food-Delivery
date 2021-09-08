import express from 'express';
import AuthMiddleware from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import ProductController from '../../controllers/product/product.controller.js';

const router = express.Router();

router.post('/', upload({ fieldName: 'images', maxFiles: 3}), AuthMiddleware.authorizeUser, ProductController.create);

export default router;