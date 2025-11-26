// src/services/cart.service.js
import * as cartRepo from "../repository/cart.repository.js";
import ProductOrder from "../models/productOrder.model.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import UserProduct from "../models/userProduct.model.js";
import Cart from "../models/cart.model.js";

const unitFieldMap = {
  quantity: "quantity",
  kg: "weight",
  liters: "volume",
};
/**
 * Return cart with each item's product populated, plus:
 *  - itemSubtotal (cost * qty)
 *  - totalAmount (sum of itemSubtotals)
 */
export const getCartService = async (userId) => {
  const cart = await cartRepo.getCartByUser(userId);

  // ensure consistent shape when empty
  if (!cart || !cart.items || cart.items.length === 0) {
    return {
      items: [],
      totalAmount: 0,
      updatedAt: new Date(),
    };
  }

  let totalAmount = 0;

  const items = cart.items.map((it) => {
    const product = it.product || null;

    // If product missing, set subtotal 0
    if (!product) {
      return {
        ...it.toObject?.() ?? it,
        product: null,
        itemSubtotal: 0,
      };
    }

    // Ensure numeric values (guard against strings)
    const cost = Number(product.cost) || 0;
    const qty = Number(it.quantity) || 0;

    const itemSubtotal = Math.round((cost * qty + Number.EPSILON) * 100) / 100;

    totalAmount += itemSubtotal;

    return {
      ...it.toObject?.() ?? it,
      product,
      itemSubtotal,
    };
  });

  // Round total amount to 2 decimals
  totalAmount = Math.round((totalAmount + Number.EPSILON) * 100) / 100;

  return {
    _id: cart._id,
    user: cart.user,
    items,
    totalAmount,
    updatedAt: cart.updatedAt,
  };
};


export const addItemToCartService = async (userId, productId, qty = 1) => {
  const product = await UserProduct.findById(productId);
  if (!product) throw new ApiError(404, "UserProduct not found");

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (item) {
    item.quantity += qty;
  } else {
    cart.items.push({ product: productId, quantity: qty });
  }

  cart.updatedAt = new Date();
  await cart.save();

  return await cart.populate("items.product");
};

export const removeItemFromCartService = async (userId, productId) => {
  return await cartRepo.removeItemFromCart(userId, productId);
};

export const increaseQuantityService = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(400, "Cart empty");

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new ApiError(404, "Item not found");
  item.quantity += 1;
  cart.updatedAt = new Date();
  await cart.save();
  return cart.populate("items.product");
};

export const decreaseQuantityService = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(400, "Cart empty");

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new ApiError(404, "Item not found");

  if (item.quantity <= 1) {
    cart.items = cart.items.filter((it) => it.product.toString() !== productId);
  } else {
    item.quantity -= 1;
  }

  cart.updatedAt = new Date();
  await cart.save();
  return cart.populate("items.product");
};// src/services/cart.service.js (excerpt)
export const checkoutCartService = async (userId) => {
  const cart = await cartRepo.getCartByUser(userId);
  if (!cart || !cart.items || cart.items.length === 0)
    throw new ApiError(400, "Cart is empty");

  // Filter out any items that somehow still have null product
  const validItems = cart.items.filter((it) => it.product && it.product._id);
  if (validItems.length === 0) {
    // Cleanup cart and respond clearly
    await cartRepo.clearCart(userId);
    throw new ApiError(400, "Cart contains no valid products to checkout");
  }

  const orders = [];

  for (const item of validItems) {
    const userProduct = item.product; // already populated as UserProduct
    // defensive check again
    if (!userProduct) continue;

    // dynamic stock check
    const unitField = unitFieldMap[userProduct.unit];
    if (unitField && item.quantity > (userProduct[unitField] || 0)) {
      throw new ApiError(
        400,
        `Only ${userProduct[unitField] || 0} ${userProduct.unit} available for ${userProduct.name}`
      );
    }

    // Reduce stock (repository expects productId + unitField)
    await cartRepo.reduceProductStock(userProduct._id, unitField, item.quantity);

    // Create ProductOrder
    const order = await ProductOrder.create({
      product: userProduct._id,
      productName: userProduct.name,
      quantity: `${item.quantity} ${userProduct.unit}`,
      cost: userProduct.cost * item.quantity,
      customer: userId,
      vendor: userProduct.user,
      vendorType: userProduct.userType,
      orderedOn: new Date(),
      status: "Upcoming",
    });

    orders.push(order);
  }

  // Clear cart after successful checkout
  await cartRepo.clearCart(userId);

  return orders;
};
