import express from "express";
import AddressController from "../controllers/address.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', AuthMiddleware.authorizeUser, AddressController.getAllByUser);
router.post('/', AuthMiddleware.authorizeUser, AddressController.create);

export default router;