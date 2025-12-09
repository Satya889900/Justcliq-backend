// services/user/order/order.service.js
import { getOrderedProductsByUserAndTime,createOrder } from "../repository/order.repository.js";
import Product from "../models/product.model.js";
import { decreaseStock } from "./inventory.service.js";

export const fetchOrderedProductsByUserAndTime = async (userId, startDate, endDate) => {
  return await getOrderedProductsByUserAndTime(userId, startDate, endDate);
};




export const placeOrder = async (userId, products) => {
  if (!products || products.length === 0) {
    throw new Error("At least one product is required to place an order");
  }

  let totalCost = 0;
  const orderProducts = [];

  for (const item of products) {
    const quantity = item.quantity || 1;             // ✅ FIRST define quantity

    // 🔻 decrease stock here
    await decreaseStock(item.productId, quantity);   // ✅ FIXED

    // ✅ support both Admin Product & UserProduct
    let product = await Product.findById(item.productId);
    if (!product) {
      product = await UserProduct.findById(item.productId);
    }
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    totalCost += product.cost * quantity;

    orderProducts.push({
      product: product._id,
      quantity,
    });
  }

  const order = await createOrder({
    user: userId,
    products: orderProducts,
    totalCost,
  });

  return order;
};
