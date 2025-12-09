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
    return services.map(s => ({
      id: s._id,
      name: s.name,
      category: s.category.name,
      wageType: s.wageType,
      // cost: s.cost,
       userType:s.userType,
      vendorName: s.user ? `${s.user.firstName} ${s.user.lastName}` : null,
    }));
  }
};

// stock.service.js
export const editProduct = async (productId, data) => {
  if (!productId) throw new ApiError(400, "Missing productId");

  const { unit } = data;
  const updateData = {};
  const unsetFields = [];

  // ✅ Only set valid values
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null && value !== "") {
      updateData[key] = value;
    }
  }

  // ✅ Correctly unset other unit fields
  if (unit === "quantity") unsetFields.push("weight", "volume");
  if (unit === "kg") unsetFields.push("quantity", "volume");
  if (unit === "liters") unsetFields.push("quantity", "weight");

  const updated = await stockRepo.updateProductById(
    productId,
    updateData,
    unsetFields
  );

  if (!updated) throw new ApiError(404, "Product not found");

  // ✅ Always return fresh updated live stock
  let liveStock = 0;
  if (updated.unit === "quantity") liveStock = updated.quantity;
  if (updated.unit === "kg") liveStock = updated.weight;
  if (updated.unit === "liters") liveStock = updated.volume;

  return {
    id: updated._id,
    name: updated.name,
    category: updated.category?.name || null,
    unit: updated.unit,

    status: liveStock > 0 ? "Available" : "Out of stock",

    quantity: updated.unit === "quantity" ? updated.quantity : undefined,
    weight: updated.unit === "kg" ? updated.weight : undefined,
    volume: updated.unit === "liters" ? updated.volume : undefined,

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
    const { id, ...fields } = update;
    if (!id) {
      console.warn("Skipping update for item without an ID:", update);
      return Promise.resolve(null);
    }

    if (type === "product") {
      return stockRepo.updateProductById(id, fields);
    } else {
      return stockRepo.updateServiceById(id, fields);
    }
  });

  const results = await Promise.all(updatePromises);
  return results.filter(result => result !== null);
};
