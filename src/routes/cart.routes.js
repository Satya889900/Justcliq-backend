import express from "express";
import {
  getCartController,
  addItemToCartController,
  removeItemFromCartController,
   increaseQuantityController,
  decreaseQuantityController,
  checkoutCartController,
  clearCartController,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", getCartController);
router.post("/add", addItemToCartController);
router.post("/remove", removeItemFromCartController);
router.post("/increase", increaseQuantityController);
router.post("/decrease", decreaseQuantityController);
router.post("/checkout", checkoutCartController);
router.delete("/clear", clearCartController);


export default router;
