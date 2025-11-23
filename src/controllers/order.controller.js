// controllers/user/order/order.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fetchOrderedProductsByUserAndTime, placeOrder } from "../services/order.service.js";
import { validate } from "../middlewares/validate.js";
import { getOrderedProductsByTimeSchema, placeOrderSchema } from "../validations/order.validation.js";

// GET orders within time range
export const getOrderedProductsByTimeController = [
  validate(getOrderedProductsByTimeSchema, "query"),
  asyncHandler(async (req, res) => {
    const userId = req.user._id; // JWT middleware injects this
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const orders = await fetchOrderedProductsByUserAndTime(userId, start, end);

    return res.json(
      new ApiResponse(200, orders, "Ordered products fetched successfully")
    );
  }),
];

// POST place order
export const placeOrderController = [
  validate(placeOrderSchema, "body"),
  asyncHandler(async (req, res) => {
    const userId = req.user._id; // set by verifyJWT middleware
    // Example for POST body
const { products } = req.validatedBody;


    const order = await placeOrder(userId, products);

    return res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
  }),
];
