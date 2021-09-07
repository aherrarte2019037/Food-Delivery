import express from 'express';
import AuthMiddleware from '../../middlewares/auth.middleware.js';
import ProductCategoryController from '../../controllers/product/category.controller.js';
import { upload } from '../../utils/uploadMulter.js';

const router = express.Router();

router.get('/latest', AuthMiddleware.authorizeUser, ProductCategoryController.getRecentCategories);
router.post('/', upload.array('image', 1), AuthMiddleware.authorizeUser, ProductCategoryController.create);

export default router;