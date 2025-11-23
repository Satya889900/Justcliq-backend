import * as cartRepo from "../repository/cart.repository.js";
import ProductOrder from "../models/productOrder.model.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";

const unitFieldMap = {
  quantity: "quantity",
  kg: "weight",
  liters: "volume",
};

export const getCartService = async (userId) => {
  return await cartRepo.getCartByUser(userId);
};

export const addItemToCartService = async (userId, productId, quantity) => {
  return await cartRepo.addItemToCart(userId, productId, quantity);
};

export const removeItemFromCartService = async (userId, productId) => {
  return await cartRepo.removeItemFromCart(userId, productId);
};

// Checkout → create ProductOrder
export const checkoutCartService = async (userId) => {
  const cart = await cartRepo.getCartByUser(userId);
  if (!cart || cart.items.length === 0) throw new ApiError(400, "Cart is empty");

  const orders = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (!product) continue;

      const dynamicField = unitFieldMap[product.unit];
    if (item.quantity > product[dynamicField]) {
      throw new ApiError(
        400,
        `Only ${product[dynamicField]} ${product.unit} available for product ${product.name}`
      );
    }
    await cartRepo.reduceProductStock(product._id, dynamicField, item.quantity);

    const order = await ProductOrder.create({
      product: product._id,
      productName: product.name,
      quantity: `${item.quantity} ${product.unit}`,
      cost: product.cost * item.quantity,
      customer: userId,
      vendor: product.user,
      vendorType: product.userType,
      orderedOn: new Date(),
      status: "Upcoming",
    });

    orders.push(order);
  }

  await cartRepo.clearCart(userId);
  return orders;
};
