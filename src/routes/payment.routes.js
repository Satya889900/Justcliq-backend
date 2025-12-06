import express from "express";
import { verifyPayment } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";


const router = express.Router();


// Protect verify route — frontend must send Authorization Bearer token
router.post("/verify-payment", verifyJWT(["User", "Admin", "ServiceProvider"]), verifyPayment);


export default router;