import express from 'express';
import AuthMiddleware from '../../middlewares/auth.middleware.js';
import ProductCategoryController from '../../controllers/product/category.controller.js'

const router = express.Router();

router.get('/latest', AuthMiddleware.authorizeUser, ProductCategoryController.getRecentCategories);

export default router;