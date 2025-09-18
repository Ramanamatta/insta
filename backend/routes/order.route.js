import express from "express";
import { getUserOrders } from "../controllers/order.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/my-orders", isAuthenticated, getUserOrders);

export default router;