// services/user/order/order.service.js
import { getOrderedProductsByUserAndTime,createOrder } from "../repository/order.repository.js";
import Product from "../models/product.model.js";

export const fetchOrderedProductsByUserAndTime = async (userId, startDate, endDate) => {
  return await getOrderedProductsByUserAndTime(userId, startDate, endDate);
};



export const placeOrder = async (userId, products) => {
  if (!products || products.length === 0) {
    throw new Error("At least one product is required to place an order");
  }

  // Fetch product details and calculate total
  let totalCost = 0;
  const orderProducts = [];

  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const quantity = item.quantity || 1;
    totalCost += product.cost * quantity;

    orderProducts.push({
      product: product._id,
      quantity,
    });
  }

  // Save the order
  const order = await createOrder({
    user: userId,
    products: orderProducts,
    totalCost,
  });

  return order;
};