import ProductOrder from "../models/productOrder.model.js";
import Product from "../models/product.model.js";

export const fetchOrdersWithUsersAndVendors = async (startDate, endDate,status) => {
  const filter = {};
  if (startDate || endDate) {
    filter.orderDate = {};
    if (startDate) filter.orderDate.$gte = startDate;
    if (endDate) filter.orderDate.$lte = endDate;
  }
 if (status) filter.status = status;


return await ProductOrder.find(filter)
    // Fetch the user who placed the order
    // .select("vendor productName quantity cost orderedOn status") // only needed fields
   .populate({
        path: "customer",
        select: "firstName lastName",
      })
    .populate({
      path: "vendor",
      select: "firstName lastName",
      
    })
    .populate({
      path: "product",
      select: "name",
    })
     .populate("assignedBy", 
      "firstName lastName userType")
    .sort({ orderedOn: -1 }); // latest orders first
};


export const findProductByNameWithUser = async (productName) => {
  return await Product.find({ name: productName })
    .populate({
      path: "user",
      select: "firstName lastName phone userType",
    })
    .lean();
};

export const assignVendorToOrder = async (
  orderId,
   vendorId,
   vendorType,
  assignedBy,
  assignedByType
  ) => {
  return await ProductOrder.findByIdAndUpdate(
    orderId,
    {
      vendor: vendorId,
      vendorType,
      status: "Out for Delivery",
      assignedBy,
  assignedByType
    },
    { new: true } // Return updated document
  )
    .populate({
      path: "vendor",
      select: "firstName lastName",
    })
    .populate({
       path: "assignedBy",
        select: "firstName lastName userType" 
      })
    .populate({
      path: "product",
      select: "name",
    });
};


/**
 * Mark as Delivered (when user gives feedback)
 */
export const markAsDelivered = async (orderId) => {
  return await ProductOrder.findByIdAndUpdate(
    orderId,
    { status: "Delivered" },
    { new: true }
  );
};

/**
 * Cancel order (user or vendor)
 */
export const cancelOrder = async (orderId, cancelledBy) => {
  return await ProductOrder.findByIdAndUpdate(
    orderId,
    {
      status: "Not Delivered",
      cancelledBy,
    },
    { new: true }
  );
};