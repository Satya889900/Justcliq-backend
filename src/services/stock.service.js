/*stock.service.js*/

// services/stock.service.js
import * as categoryRepo from "../repository/category.repository.js";
import * as stockRepo from "../repository/stock.repository.js";
import { ApiError } from "../utils/ApiError.js";


export const getAllCategoriesForStock = async () => {
  const serviceCategories = await categoryRepo.getAllCategories();
  const productCategories = await categoryRepo.getAllProductCategories();

  return {
    serviceCategories,
    productCategories,
  };
};

export const getItemsByCategory = async (categoryId, type="product") => {
  // Validate category exists
  const category = await stockRepo.findCategoryById(categoryId, type);
  if (!category) throw new ApiError(404, "Category not found");

  if (type === "product") {
    const products = await stockRepo.getProductsByCategoryId(categoryId);
    return products.map(p => ({
      
      id: p._id,
      name: p.name,
      category: p.category.name,
      status:  p.unit === "quantity" ? 
      p.quantity>0?"Available" : "Out of stock"
                      : p.unit === "kg" ?
                       p.weight>0?"Available" : "Out of stock"
                      : p.volume > 0 ? 
                      "Available" : "Out of stock",
       [p.unit === "quantity"
      ? "quantity"
      : p.unit === "kg"
      ? "weight"
      : "volume"]:  p.unit === "quantity" ? p.quantity
                      : p.unit === "kg" ? p.weight
                      : p.volume,
      userType:p.userType,
      vendorName: p.user ? `${p.user.firstName} ${p.user.lastName}`
     
      :null,
    }));
  } else {
    const services = await stockRepo.getServicesByCategoryId(categoryId);
   return products.map(p => ({
  id: p._id,
  name: p.name,
  category: p.category.name,
  unit: p.unit,
  value: p.value,
  status: p.value > 0 ? "Available" : "Out of stock",
  userType: p.user?.userType || null,
  vendorName: p.user
    ? `${p.user.firstName} ${p.user.lastName}`
    : null,
}));

  }
};

// stock.service.js
export const editProduct = async (productId, data) => {
  if (!productId) throw new ApiError(400, "Missing productId");

  const { unit, value, ...rest } = data;

  if (value === undefined) {
    throw new ApiError(400, "value is required");
  }

  const updated = await stockRepo.updateProductById(productId, {
    unit,
    value,
    ...rest,
  });

  if (!updated) throw new ApiError(404, "Product not found");

  return {
    id: updated._id,
    name: updated.name,
    category: updated.category?.name || null,
    unit: updated.unit,
    value: updated.value,
    status: updated.value > 0 ? "Available" : "Out of stock",
    vendorName: updated.user
      ? `${updated.user.firstName} ${updated.user.lastName}`
      : null,
  };
};



export const editService = async (serviceId, data) => {
  const {  name, category, wageType, wages, vendorName } = data;

  const updateData = { name, category, wageType, cost: wages };
  if (vendorName) updateData.vendorName = vendorName;

  const updated = await stockRepo.updateServiceById(serviceId, updateData);
  if (!updated) throw new ApiError(404, "Service not found");

  return {
    id: updated._id,
    name: updated.name,
    category: updated.category.name,
    wageType: updated.wageType,
    wages: updated.cost,
    vendorName: updated.user ? `${updated.user.firstName} ${updated.user.lastName}` 
    : vendorName || null,
  };
};

export const batchUpdateStock = async (type, updates) => {
  const updatePromises = updates.map(update => {
    const { id, unit, value, ...rest } = update;
    if (!id || value === undefined) return null;

    if (type === "product") {
      return stockRepo.updateProductById(id, {
        unit,
        value,
        ...rest,
      });
    }

    return stockRepo.updateServiceById(id, rest);
  });

  const results = await Promise.all(updatePromises);
  return results.filter(Boolean);
};

