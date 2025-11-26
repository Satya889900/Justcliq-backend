// src/repository/cart.repository.js

import Cart from "../models/cart.model.js";
import UserProduct from "../models/userProduct.model.js"; // <-- FIX
import Product from "../models/product.model.js";

/**
 * Get Cart by user and populate user products
 */
export const getCartByUser = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    model: "UserProduct",
  });

  // If there's no cart, return empty cart object
  if (!cart) return { user: userId, items: [] };

  // Remove items whose product is null (product deleted or ref mismatch)
  const originalLen = cart.items.length;
  cart.items = cart.items.filter((it) => it.product && it.product._id);

  // If we removed any items, persist the cleaned cart
  if (cart.items.length !== originalLen) {
    cart.updatedAt = new Date();
    await cart.save();
    // re-populate just in case
    cart = await Cart.findById(cart._id).populate({
      path: "items.product",
      model: "UserProduct",
    });
  }

  return cart || { user: userId, items: [] };
};

/**
 * Add item to cart
 */
export const addItemToCart = async (userId, productId, quantity) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  cart.updatedAt = new Date();
  await cart.save();

  return cart.populate({
    path: "items.product",
    model: "UserProduct",
  });
};

/**
 * Remove item from cart
 */
export const removeItemFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.updatedAt = new Date();
  await cart.save();

  return cart.populate({
    path: "items.product",
    model: "UserProduct",
  });
};

/**
 * Clear the entire cart
 */
export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.items = [];
  cart.updatedAt = new Date();
  await cart.save();

  return cart;
};

/**
 * Reduce stock from UserProduct (dynamic fields: quantity/kg/liters)
 */
export const reduceProductStock = async (productId, unitField, quantity) => {
  const product = await UserProduct.findById(productId); // <-- FIXED: must use UserProduct

  if (!product) return null;

  if (product[unitField] < quantity) {
    return false; // insufficient stock
  }

  product[unitField] -= quantity;
  await product.save();

  return product;
};
