import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const getCartByUser = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("items.product");
};

export const addItemToCart = async (userId, productId, quantity) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }
  
  const existingItem = cart.items.find(item => item.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  
  cart.updatedAt = new Date();
  await cart.save();
  return cart.populate("items.product");
};

export const removeItemFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;
  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  cart.updatedAt = new Date();
  await cart.save();
  return cart.populate("items.product");
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;
  cart.items = [];
  cart.updatedAt = new Date();
  await cart.save();
  return cart;
};


// Reduce dynamic field count in product
export const reduceProductStock = async (productId, unitField, quantity) => {
  const product = await Product.findById(productId);
  if (!product) return null;

  if (product[unitField] < quantity) return false; // Not enough stock

  product[unitField] -= quantity;
  await product.save();
  return product;
};