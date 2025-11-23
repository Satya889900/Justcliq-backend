import Product from "../models/product.model.js";



// Fetch all products
export const getAllProducts = async () =>
  Product.find()
    .populate("category", "name") // only fetch category name
    .populate("user", "firstName lastName email"); // fetch user info

// Fetch product by ID
export const getProductById = async (id) =>
  Product.findById(id)
    .populate("category", "name")
    .populate("user", "firstName lastName email");

// Create product
export const createProduct = async (data) => Product.create(data);

// Update product
export const updateProduct = async (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true });

// Delete product
export const deleteProduct = async (id) => Product.findByIdAndDelete(id);

// Fetch by category
export const getProductsByCategory = async (categoryId) =>
  Product.find({ category: categoryId })
    .populate("category", "name")
    .populate("user", "firstName lastName email")
    .sort({ userType: -1, createdAt: -1 }); // Admins first, newest first


// Delete all products by category
export const deleteProductsByCategory = async (categoryId) => {
  return await Product.deleteMany({ category: categoryId });
};

// Fetch category name by product ID
export const getProductWithCategory = async (productId) => {
 return  await Product.findById(productId)
    .populate("category", "name") // only fetch the category name
    .select("_id category")
    .lean();

  // return product?.category?.name || null;
};