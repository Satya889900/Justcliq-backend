// repository/user/order/order.repository.js
import Order from "../models/order.model.js";

export const getOrderedProductsByUserAndTime = async (userId, startDate, endDate) => {
  return await Order.find({
    user: userId,
    orderDate: { $gte: startDate, $lte: endDate },
  })
    .populate("products.product", "name cost image category") // fetch product details
    .sort({ orderDate: -1 }); // latest orders first
};


export const createOrder = async (orderData) => {
  return await Order.create(orderData);
};