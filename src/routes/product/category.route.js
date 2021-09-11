import express from 'express';
import AuthMiddleware from '../../middlewares/auth.middleware.js';
import ProductCategoryController from '../../controllers/product/category.controller.js';
import { upload } from '../../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/all', AuthMiddleware.authorizeUser, ProductCategoryController.getAll);
router.get('/latest', AuthMiddleware.authorizeUser, ProductCategoryController.getRecentCategories);
router.post('/', upload({ fieldName: 'image', maxFiles: 1 }), AuthMiddleware.authorizeUser, ProductCategoryController.create);

export default router;