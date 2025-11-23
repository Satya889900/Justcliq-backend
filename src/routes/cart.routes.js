import express from "express";
import {
  getCartController,
  addItemToCartController,
  removeItemFromCartController,
  checkoutCartController
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", getCartController);
router.post("/add", addItemToCartController);
router.post("/remove", removeItemFromCartController);
router.post("/checkout", checkoutCartController);

export default router;
