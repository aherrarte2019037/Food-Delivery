import express from "express";
import CartController from "../controllers/cart.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', AuthMiddleware.authorizeUser, CartController.getUserCart);
router.get('/purchased', AuthMiddleware.authorizeUser, CartController.getProductsPurchased);
router.put('/', AuthMiddleware.authorizeUser, CartController.addProductToCart);
router.put('/remove', AuthMiddleware.authorizeUser, CartController.deleteProductFromCart);

export default router;