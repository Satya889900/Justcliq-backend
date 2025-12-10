import Product from "../models/product.model.js";
import UserProduct from "../models/userProduct.model.js";
import { ApiError } from "../utils/ApiError.js";

// ✅ Find product in Admin OR User collection
const findAnyProduct = async (productId) => {
  let product = await Product.findById(productId);
  if (!product) {
    product = await UserProduct.findById(productId);
  }

  if (!product) {
    throw new ApiError(404, "Product not found for stock update");
  }

  return product;
};

// ✅ Convert "2 quantity" → 2
const parseQty = (val) => {
  let num;

  if (typeof val === "number") num = val;
  else if (typeof val === "string") num = parseFloat(val);  // ✅ FIX
  else throw new ApiError(400, "Invalid quantity type");

  if (isNaN(num) || num <= 0) {
    throw new ApiError(400, `Invalid quantity: ${val}`);
  }

  return num;
};



// 🔻 DECREASE STOCK (Add to Cart / Place Order)
export const decreaseStock = async (productId, orderedQty) => {
  const product = await findAnyProduct(productId);
  const qty = parseQty(orderedQty);

  if (product.unit === "quantity") {
    if (product.quantity < qty)
      throw new ApiError(400, "Out of stock");
    product.quantity -= qty;
  }

  if (product.unit === "kg") {
    if (product.weight < qty)
      throw new ApiError(400, "Out of stock");
    product.weight -= qty;
  }

  if (product.unit === "liters") {
    if (product.volume < qty)
      throw new ApiError(400, "Out of stock");
    product.volume -= qty;
  }

  await product.save();
  return product;
};

// 🔺 INCREASE STOCK (Remove from Cart / Cancel Order)
export const increaseStock = async (productId, orderedQty) => {
  const product = await findAnyProduct(productId);
  const qty = parseQty(orderedQty);

  if (product.unit === "quantity") product.quantity += qty;
  if (product.unit === "kg") product.weight += qty;
  if (product.unit === "liters") product.volume += qty;

  await product.save();
  return product;
};
