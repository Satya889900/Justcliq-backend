// controllers/user/order/order.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fetchOrderedProductsByUserAndTime, placeOrder } from "../services/order.service.js";
import { validate } from "../middlewares/validate.js";
import { getOrderedProductsByTimeSchema, placeOrderSchema } from "../validations/order.validation.js";
import ProductOrder from "../models/productOrder.model.js";
import { increaseStock } from "../services/inventory.service.js";
import UserProduct from "../models/userProduct.model.js";   // ✅ ADD THIS


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
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await ProductOrder.find({ customer: userId })
    .populate("vendor", "firstName lastName")
    .populate("assignedBy", "firstName lastName userType")
    .sort({ orderedOn: -1 })
    .lean();

  const formatted = orders.map(order => ({
    ...order,
    vendorName: order.vendor
      ? `${order.vendor.firstName} ${order.vendor.lastName}`
      : null
  }));

  return res.json(
    new ApiResponse(200, formatted, "Orders fetched successfully")
  );
});



export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;

  if (!["Upcoming", "Completed", "Cancelled"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const order = await ProductOrder.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  return res.json(
    new ApiResponse(200, order, "Order status updated")
  );
});
export const getSingleOrderController = async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  const order = await ProductOrder.findOne({
    _id: orderId,
    customer: userId
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.json(
    new ApiResponse(200, order, "Order fetched successfully")
  );
};






export const cancelUserOrderController = async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  const order = await ProductOrder.findOne({
    _id: orderId,
    customer: userId
  });

  if (!order) throw new ApiError(404, "Order not found");

  if (order.status === "Delivered")
    throw new ApiError(400, "Delivered order cannot be cancelled");

  if (order.status === "Cancelled")
    throw new ApiError(400, "Order already cancelled");

  // ✅ RESTORE INVENTORY
  if (order.product) {
    await increaseStock(order.product, order.quantity);
  }

  order.status = "Cancelled";
  await order.save();

  return res.json(
    new ApiResponse(200, order, "Order cancelled & stock restored")
  );
};

