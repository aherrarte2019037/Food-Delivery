import express from "express";
import CartController from "../controllers/cart.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', AuthMiddleware.authorizeUser, CartController.getUserCart);
router.get('/purchased', AuthMiddleware.authorizeUser, CartController.getProductsPurchased);
router.post('/', AuthMiddleware.authorizeUser, CartController.addProductToCart);
router.put('/', AuthMiddleware.authorizeUser, CartController.editCart);

export default router;