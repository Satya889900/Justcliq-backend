// src/repository/cart.repository.js

import Cart from "../models/cart.model.js";
import UserProduct from "../models/userProduct.model.js"; // <-- FIX
import Product from "../models/product.model.js";

/**
 * Get Cart by user and populate user products
 */
export const getCartByUser = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
    .populate({
      path: "items.userProductId",
      model: "UserProduct"
    })
    .populate({
      path: "items.adminProductId",
      model: "Product"
    });

  if (!cart) return { user: userId, items: [] };

  return cart;
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
