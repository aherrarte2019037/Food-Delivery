import express from "express";
import OrderController from "../controllers/order.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/count/purchased', AuthMiddleware.authorizeUser, OrderController.getPurchasedCount);
router.get('/groupBy/status', AuthMiddleware.authorizeUser, OrderController.groupByStatus);
router.post('/', AuthMiddleware.authorizeUser, OrderController.create);
router.put('/:id/delivery', AuthMiddleware.authorizeUser, OrderController.assignDelivery);

export default router;