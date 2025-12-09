// src/services/cart.service.js
import razorpay from "../utils/razorpay.js";
import Payment from "../models/payment.model.js";
import crypto from "crypto";

import * as cartRepo from "../repository/cart.repository.js";
import ProductOrder from "../models/productOrder.model.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import UserProduct from "../models/userProduct.model.js";
import Cart from "../models/cart.model.js";
import { clearCartRepository } from "../repository/cart.repository.js";
import { decreaseStock, increaseStock } from "./inventory.service.js";
// import Cart from "../models/cart.model.js"; 

const unitFieldMap = {
  quantity: "quantity",
  kg: "weight",
  liters: "volume",
};
// -----------------------
// GET CART
// -----------------------
export const getCartService = async (userId) => {
  const cart = await cartRepo.getCartByUser(userId);

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

    if (!product) {
      return {
        ...it.toObject?.() ?? it,
        product: null,
        itemSubtotal: 0,
      };
    }

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

  totalAmount = Math.round((totalAmount + Number.EPSILON) * 100) / 100;

  return {
    _id: cart._id,
    user: cart.user,
    items,
    totalAmount,
    updatedAt: cart.updatedAt,
  };
};

// -----------------------
// CLEAR CART SERVICE
// -----------------------
export const clearCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || !cart.items.length) return cart;

  // ✅ RESTORE ALL STOCK
  for (const item of cart.items) {
    await increaseStock(item.product, item.quantity);
  }

  cart.items = [];
  await cart.save();

  return cart;
};


// ------------------------------------------------
// VERIFY PAYMENT + PROCESS ORDERS
// ------------------------------------------------

export const verifyAndProcessPaymentService = async (
  userId,
  { razorpay_order_id, razorpay_payment_id, razorpay_signature }
) => {

  console.log("🧾 Incoming Verify Data:", {
    razorpay_order_id, razorpay_payment_id, razorpay_signature
  });

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Missing payment verification fields");
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new ApiError(500, "Razorpay secret missing");

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    // store failed attempt
    await Payment.create({
      user: userId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "failed",
      meta: { reason: "signature_mismatch" }
    });

    throw new ApiError(400, "Invalid payment signature");
  }

  // Store valid payment
  await Payment.create({
    user: userId,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    status: "paid",
  });

  // Get cart for this user
  const cart = await cartRepo.getCartByUser(userId);

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const validItems = cart.items.filter(it => it.product && it.product._id);

  if (validItems.length === 0) {
    await clearCartRepository(userId);   // FIXED
    throw new ApiError(400, "Cart contains invalid items");
  }

  const orders = [];

  // Process each product in cart
 for (const item of validItems) {
  const product = item.product;
  const unitField = unitFieldMap[product.unit];

  if (unitField && item.quantity > product[unitField]) {
    throw new ApiError(
      400,
      `Only ${product[unitField]} ${product.unit} left for ${product.name}`
    );
  }

  // ✅ DO NOT TOUCH STOCK HERE

  const order = await ProductOrder.create({
    product: product._id,
    productName: product.name,
    quantity: `${item.quantity} ${product.unit}`,
    cost: product.cost * item.quantity,
    customer: userId,
    orderedOn: new Date(),
    status: "Upcoming",

    vendor: null,
    vendorType: null,
    vendorAssigned: false,
    assignedBy: null,
    assignedByType: null,

    payment: {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    },
  });

  orders.push(order);
}


  // -----------------------------
  // FIXED: Clear cart correctly
  // -----------------------------
  await clearCartRepository(userId);

  return orders;
};

// ------------------------------------------------
// CART FUNCTIONS (no changes)
// ------------------------------------------------

// ... (rest of your cart functions exactly same)



export const addItemToCartService = async (userId, productId, qty = 1) => {
  // 1️⃣ Detect model
 await decreaseStock(productId, qty);  // ✅ correct

  let userProduct = await UserProduct.findById(productId);
  let productModel = userProduct ? "UserProduct" : "Product";

  let productDoc = userProduct || await Product.findById(productId);
  if (!productDoc) {
    throw new ApiError(404, "Product not found");
  }

  // 2️⃣ Fetch cart
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // 3️⃣ Check if already in cart
  let existing = cart.items.find(
    (it) =>
      it.product?.toString() === productId &&
      it.productModel === productModel
  );

  let updatedItem;

  if (existing) {
    // Increase quantity
    existing.quantity += qty;

    updatedItem = {
      product: productDoc,
      productModel,
      quantity: existing.quantity
    };

  } else {
    // Add new item
    const newItem = {
      product: productId,
      productModel,
      quantity: qty
    };

    cart.items.push(newItem);

    updatedItem = {
      product: productDoc,
      productModel,
      quantity: qty
    };
  }

  cart.updatedAt = new Date();
  await cart.save();

  return updatedItem;  // 🔥 return ONLY the updated/added product
};

export const removeItemFromCartService = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return cart;

  const item = cart.items.find(
    (i) => i.product.toString() === productId.toString()
  );

  if (item) {
    // 🔺 Release stock
    await increaseStock(productId, item.quantity);

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId.toString()
    );

    await cart.save();
  }

  return cart;
};



export const increaseQuantityService = async (userId, productId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) throw new ApiError(400, "Cart empty");

  const item = cart.items.find(
    (i) => i.product._id.toString() === productId
  );
  if (!item) throw new ApiError(404, "Item not found");

  // ✅ DECREASE STOCK BY 1
  await decreaseStock(productId, 1);

  item.quantity += 1;
  cart.updatedAt = new Date();
  await cart.save();

  return {
    product: item.product,
    quantity: item.quantity
  };
};

export const decreaseQuantityService = async (userId, productId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) throw new ApiError(400, "Cart empty");

  const item = cart.items.find(
    (i) => i.product._id.toString() === productId
  );
  if (!item) throw new ApiError(404, "Item not found");

  // ✅ INCREASE STOCK BY 1
  await increaseStock(productId, 1);

  if (item.quantity <= 1) {
    cart.items = cart.items.filter(
      (it) => it.product._id.toString() !== productId
    );
    await cart.save();
    return { removed: true, productId };
  }

  item.quantity -= 1;
  cart.updatedAt = new Date();
  await cart.save();

  return {
    product: item.product,
    quantity: item.quantity
  };
};

// src/services/cart.service.js (excerpt)
export const checkoutCartService = async (userId) => {
  const cart = await cartRepo.getCartByUser(userId);
  if (!cart || !cart.items || cart.items.length === 0)
    throw new ApiError(400, "Cart is empty");

  const validItems = cart.items.filter((it) => it.product && it.product._id);
  if (validItems.length === 0) {
    await cartRepo.clearCart(userId);
    throw new ApiError(400, "Cart contains no valid products");
  }

  const orders = [];

  for (const item of validItems) {
    const userProduct = item.product;

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

  // ✅ ONLY CLEAR CART — NO STOCK CHANGE
  await cartRepo.clearCart(userId);

  return orders;
};

