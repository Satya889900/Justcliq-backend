// src/repository/cart.repository.js

import Cart from "../models/cart.model.js";
import UserProduct from "../models/userProduct.model.js"; // <-- FIX
import Product from "../models/product.model.js";

/**
 * GET CART (auto-populates by refPath)
 */
export const getCartByUser = async (userId) => {
  return await Cart.findOne({ user: userId })
    .populate({
      path: "items.product",
      strictPopulate: false
    })
    .lean();
};

/**
 * REMOVE ITEM
 */
export const removeItemFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );

  await cart.save();
  return cart;
};


/**
 * CLEAN CART (remove invalid rows)
 */
export const cleanCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return;

  cart.items = cart.items.filter(
    (i) => i.product && i.productModel
  );

  await cart.save();
};


/**
 * ADD ITEM TO CART
 */
export const addItemToCart = async (userId, productId, quantity, modelName) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // check existing
  const existing = cart.items.find(
    (i) =>
      i.product.toString() === productId &&
      i.productModel === modelName
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      productModel: modelName,  // 🔥 REQUIRED!
      quantity
    });
  }

  await cart.save();

  return await Cart.findById(cart._id)
    .populate({
      path: "items.product",
      strictPopulate: false
    });
};




export const reduceProductStock = async (productId, unitField, qty) => {
  const product = await UserProduct.findById(productId);
  if (!product) return false;

  if (product[unitField] < qty) return false;

  product[unitField] -= qty;
  await product.save();

  return product;
};
