import express from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/order", createOrder);
router.post("/verify", isAuthenticated, verifyPayment);

export default router;
