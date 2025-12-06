import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as cartService from "../services/cart.service.js";

/**
 * Create Razorpay order for cart total amount
 */
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
    console.log("🚀 ~ file: serviceOrder.controller.js:16 ~ createOrder ~ userId:", userId)
  const order = await cartService.createRazorpayOrderService(userId);

  return res.json(
    new ApiResponse(200, order, "Razorpay order created")
  );
});

/**
 * Verify the payment & create final ProductOrder entries
 */
export const verifyPayment = asyncHandler(async (req, res) => {
// debug: show incoming body
console.log("🧾 VERIFY PAYMENT BODY:", req.body);


const userId = req.user._id;


const orders = await cartService.verifyAndProcessPaymentService(
userId,
req.body
);


return res.json(
  new ApiResponse(200, {
      orders,
      orderCount: orders.length,
      totalAmount: orders.reduce((acc, o) => acc + o.cost, 0),
      orderedOn: new Date(),
  }, "Payment verified & orders created")
);

});