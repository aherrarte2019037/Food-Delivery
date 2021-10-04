import express from "express";
import CartController from "../controllers/cart.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/', AuthMiddleware.authorizeUser, CartController.addProductToCart);

export default router;