// services/admin/order.service.js
import * as orderRepo from "../repository/productOrder.repository.js";
import { ApiError } from "../utils/ApiError.js";
import UserProduct from "../models/userProduct.model.js";
import Product from "../models/product.model.js";


export const getOrders = async (startDate, endDate, status) => {
  const orders = await orderRepo.fetchOrdersWithUsersAndVendors(
    startDate,
    endDate,
    status
  );

  return orders.map(order => {
    const canAssign = order.status === "Upcoming";
    const vendorAssigned = order.vendorAssigned; // ⭐ FIXED

    return {
      id: order._id,

      vendorId: vendorAssigned ? order.vendor?._id : null,
      vendorType: vendorAssigned ? order.vendorType : null,
      vendorName:
        vendorAssigned && order.vendor
          ? `${order.vendor.firstName} ${order.vendor.lastName}`
          : null,

      userName: order.customer
        ? `${order.customer.firstName} ${order.customer.lastName}`
        : null,

      productName:
        order.productName || (order.product ? order.product.name : null),

      quantity: order.quantity,
      cost: order.cost,
      orderedOn: order.orderedOn,
      completedOn: order.status === "Delivered" ? order.updatedAt : null,
      status: order.status,

      canAssign,
      vendorAssigned, // ⭐ Send to frontend
    };
  });
};










export const getProductPosterDetails = async (productName) => {

  // ✅ SEARCH IN BOTH COLLECTIONS
  const adminProducts = await Product.find({
    name: { $regex: new RegExp(productName, "i") },
    status: "Approved"
  }).populate("user", "firstName lastName phone userType").lean();

  const userProducts = await UserProduct.find({
    name: { $regex: new RegExp(productName, "i") },
    status: "Approved"
  }).populate("user", "firstName lastName phone userType").lean();

  const products = [...adminProducts, ...userProducts];

  if (!products.length) return [];

  return products.map((p) => {
    const u = p.user;

    let dynamicValue = null;
    let dynamicLabel = "Unit";

    if (p.unit === "kg") {
      dynamicLabel = "Weight";
      dynamicValue = p.weight;
    }
    else if (p.unit === "liters") {
      dynamicLabel = "Volume";
      dynamicValue = p.volume;
    }
    else if (p.unit === "quantity") {
      dynamicLabel = "Quantity";
      dynamicValue = p.quantity;
    }

    return {
      id: u._id,
      name: `${u.firstName} ${u.lastName}`,
      phone: u.phone,
      rating: u.userType === "Admin" ? 5 : 0,
      unit: p.unit,
      dynamicUnitLabel: dynamicLabel,
      dynamicUnitValue: dynamicValue,
      product: p.name,
      userType: u.userType,
    };
  });
};


export const assignVendorService = async (
  orderId,
  vendorId,
  vendorType,
  assignedBy,
  assignedByType
) => {
  const updatedOrder = await orderRepo.assignVendorToOrder(
    orderId,
    vendorId,
    vendorType,
    assignedBy,
    assignedByType
  );

  if (!updatedOrder) {
    throw new ApiError(404, "Order not found");
  }

  return updatedOrder; // ✅ RETURN FULL ORDER
};



export const markAsDeliveredService = async (orderId) => {
  const order = await orderRepo.markAsDelivered(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  return order;
};

export const cancelOrderService = async (orderId, cancelledBy) => {
  const order = await orderRepo.cancelOrder(orderId, cancelledBy);
  if (!order) throw new ApiError(404, "Order not found");
  return order;
};