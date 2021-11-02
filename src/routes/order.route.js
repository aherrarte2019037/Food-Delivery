import express from "express";
import OrderController from "../controllers/order.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/count/purchased', AuthMiddleware.authorizeUser, OrderController.getPurchasedCount);
router.post('/', AuthMiddleware.authorizeUser, OrderController.create);

export default router;