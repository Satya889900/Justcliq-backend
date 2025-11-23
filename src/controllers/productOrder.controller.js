// controllers/admin/order.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getOrders,
  getProductPosterDetails,
 assignVendorService,
markAsDeliveredService,
cancelOrderService } from "../services/productOrder.service.js";
import { validate } from "../middlewares/validate.js";
import { getOrdersSchema,
  getProductPosterSchema,
  assignVendorSchema,
  feedbackSchema,
  cancelOrderSchema
 } from "../validations/productOrder.validation.js";

export const getOrdersController = [
  validate(getOrdersSchema, "query"),
   asyncHandler(async (req, res) => {
    const { startDate, endDate, status } = req.query;
    const orders = await getOrders(
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null,
      status || null
    );
    res.json(new ApiResponse(200, orders, "Orders fetched successfully"));
  }),
];


export const getProductPosterController = [
  validate(getProductPosterSchema, "body"),
  asyncHandler(async (req, res) => {
    const { productName } =req.body;
    const posters = await getProductPosterDetails(productName);

    if (!posters || posters.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, [], "No posters found for this product"));
    }

    res.json(
      new ApiResponse(200, posters, "Product poster details fetched successfully")
    );
  }),
];

export const assignVendorController = [
  validate(assignVendorSchema, "body"),
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { vendorId, vendorType } = req.body;
 const assignedBy = req.user?._id;
    const assignedByType = req.user?.userType;

if (!assignedBy || !assignedByType) {
      throw new ApiError(401, "Unauthorized: missing user token");
    }

    const updatedOrder = await assignVendorService(
      orderId,
       vendorId,
        vendorType,
        assignedBy,
      assignedByType
      );

    res.json(
      new ApiResponse(200, updatedOrder, "Vendor assigned successfully")
    );
  }),
];


export const markAsDeliveredController = [
  validate(feedbackSchema, "body"),
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const order = await markAsDeliveredService(orderId);
    res.json(new ApiResponse(200, order, "Order marked as Delivered"));
  }),
];

export const cancelOrderController = [
  validate(cancelOrderSchema, "body"),
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { cancelledBy } = req.body;
    const order = await cancelOrderService(orderId, cancelledBy);
    res.json(new ApiResponse(200, order, "Order marked as Not Delivered"));
  }),
];