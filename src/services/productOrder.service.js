// services/admin/order.service.js
import * as orderRepo from "../repository/productOrder.repository.js";
import { ApiError } from "../utils/ApiError.js";

export const getOrders = async (startDate, endDate, status) => {
  const orders= await orderRepo.fetchOrdersWithUsersAndVendors(startDate, endDate, status);
   
  return orders.map(order => ({
    id: order._id,
    vendorId:order.vendor._id,
    userName: order.customer
      ? `${order.customer.firstName} ${order.customer.lastName}`
      : null,
    vendorType:order.vendorType,
    vendorName:  order.assignedByType === "Admin" && order.vendor
        ? `${order.vendor.firstName} ${order.vendor.lastName}`
        : null,
 
    productName: order.productName || (order.product ? order.product.name : null),
    quantity: order.quantity,
    cost: order.cost,
    orderedOn: order.orderedOn,
     completedOn:
      order.status === "Delivered" ? order.updatedAt : null,
    status: order.status,
  }));
};


export const getProductPosterDetails = async (productName) => {
  const products = await orderRepo.findProductByNameWithUser(productName);

  if (!products || products.length === 0) {
    return [];
  }

  // Map over all products and extract relevant data
  return products.map((p) => {
    const u = p.user;
       const unit = p?.unit || "unit";

    // Dynamic label mapping
    let dynamicUnitValue;
    let dynamicUnitLabel = "Unit";
    if (unit === "kg") {
      dynamicUnitLabel = "Weight";
      dynamicUnitValue=p?.weight;
    }
    else if (unit === "liters") {
      dynamicUnitLabel = "Volume";
      dynamicUnitValue=p?.volume;
    }
    else if (unit === "quantity") {
     dynamicUnitLabel = "Quantity";
     dynamicUnitValue=p?.quantity;
    }
      

    const rating = u.userType === "Admin" ? 5 : 0; // ✅ 5 for Admins, static (4) for Users
    return {
      id:u._id,
      name: `${u.firstName} ${u.lastName}`,
      phone: u.phone,
      rating,
      unit:p.unit,
      dynamicUnitLabel:dynamicUnitValue,
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

  return {
    id: updatedOrder._id,
    vendorName: updatedOrder.vendor
      ? `${updatedOrder.vendor.firstName} ${updatedOrder.vendor.lastName}`
      : null,
       assignedByType: updatedOrder.assignedByType,
    vendorType: updatedOrder.vendorType,
    productName: updatedOrder.product?.name || updatedOrder.productName,
    quantity: updatedOrder.quantity,
    cost: updatedOrder.cost,
    orderedOn: updatedOrder.orderedOn,
    status: updatedOrder.status,
  };
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