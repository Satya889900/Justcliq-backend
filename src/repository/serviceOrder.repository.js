// import BookedService from "../models/bookedService.model.js";
// import User from "../models/user.model.js";
// import Admin from "../models/admin.model.js";
// import serviceOrder from "../models/serviceOrder.model.js";
// import ServiceProvider from "../models/serviceProvider.model.js";

// // Fetch all booked services (admin view)
// export const fetchAllBookedServices = async () => {
//   return await BookedService.find()
//     .populate("service", "name cost category image")
//     .populate("user", "firstName lastName email phone")
//     .populate("vendor", "firstName lastName email phone") // populate all, filter in service
//     .populate("assignedBy", "firstName lastName") // admin who assigned
//     .sort({ bookedDate: -1, bookedTime: 1 })
//     .lean();
// };

// export const getBookedServiceById = async (bookingId) => {
//   return await BookedService.findById(bookingId)
//     .populate("service", "name cost category image")
//     .populate("user", "firstName lastName email phone")
//     .populate("vendor", "firstName lastName email phone")
//     .populate("assignedBy", "firstName lastName") // admin who assigned
//     .lean();
// };

// // Assign vendor/admin to a booked service
// // Assign a vendor/admin to a booked service
// // Assign vendor/admin to booking


// // Vendor accepts → Scheduled
// export const vendorAccept = async (bookingId) => {
//   return await BookedService.findByIdAndUpdate(
//     bookingId,
//     { status: "Scheduled" },
//     { new: true }
//   ).populate("vendor", "firstName lastName email phone");
// };

// // Vendor rejects → Cancelled
// export const vendorReject = async (bookingId) => {
//   return await BookedService.findByIdAndUpdate(
//     bookingId,
//     { status: "Cancelled" },
//     { new: true }
//   ).populate("vendor", "firstName lastName email phone");
// };

// // User completes booking → Completed
// export const completeBooking = async (bookingId) => {
//   return await BookedService.findByIdAndUpdate(
//     bookingId,
//     { status: "Completed", completedOn: new Date() },
//     { new: true }
//   ).populate("vendor", "firstName lastName email phone");
// };

// // Update a booked service
// export const updateBookedService = async (bookingId, updates) => {
//   return await BookedService.findByIdAndUpdate(bookingId, updates, { new: true })
//     .populate("service", "name user userType")
//     .populate("user", "firstName lastName email phone")
//     .populate("vendor", "firstName lastName email phone");
// };

// // Fetch bookings and approved providers
// export const getBookingsWithVendors = async () => {
//   const bookings = await BookedService.find()
//     .populate("service")
//     .lean();

//   // Fetch approved providers
//   const approvedProviders = await ServiceProvider.find({ action: "Approved" })
//     .populate("userId", "firstName lastName")
//     .lean();

//   const approvedMap = new Map();
//   approvedProviders.forEach(sp => approvedMap.set(sp._id.toString(), sp.userId));

//   return { bookings, approvedMap };
// };

// // Fetch Admin info for bookings
// export const getAdminById = async (adminId) => {
//   return await Admin.findById(adminId).select("firstName lastName").lean();
// };

// // repository/serviceOrder.repository.js
// export const assignVendorToBooking = async (bookingId, vendorId, vendorModel, adminId) => {
//   return BookedService.findByIdAndUpdate(
//     bookingId,
//     {
//       vendor: vendorId,
//       vendorModel,
//       assignedBy: adminId,
//       status:"Ongoing",
//     },
//     { new: true }
//   )
//     .populate("service user vendor assignedBy")
//     .lean();
// };


// // Helper: get vendor type (User or Admin)
// export const getVendorType = async (vendorId) => {
//   const user = await User.findById(vendorId).lean();
//   return user ? "User" : "Admin";
// }



// import * as repository from "../repository/serviceOrder.repository.js";

import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import ServiceProvider from "../models/serviceProvider.model.js";
import BookedService from "../models/bookedService.model.js";

/**
 * -----------------------------------------------------
 *  FIX ADDED — This function was missing ❗
 * -----------------------------------------------------
 */
export const getBookingById = async (bookingId) => {
  return await BookedService.findById(bookingId)
    .populate("service", "name cost category image user userType")
    .populate("user", "firstName lastName email phone")
    .populate("vendor", "firstName lastName email phone")
    .populate("assignedBy", "firstName lastName")
    .lean();
};

/**
 * -----------------------------------------------------
 *  FETCH BOOKING BY ID (Admin view)
 * -----------------------------------------------------
 */
export const getBookedServiceById = async (bookingId) => {
  return await BookedService.findById(bookingId)
    .populate("service", "name cost category image user userType")
    .populate("user", "firstName lastName email phone")
    .populate("vendor", "firstName lastName email phone")
    .populate("assignedBy", "firstName lastName")
    .lean();
};

/**
 * -----------------------------------------------------
 *  FETCH ALL BOOKINGS
 * -----------------------------------------------------
 */
export const fetchAllBookedServices = async () => {
  return await BookedService.find()
    .populate("service", "name cost category image")
    .populate("user", "firstName lastName email phone")
    .populate("vendor", "firstName lastName email phone")
    .populate("assignedBy", "firstName lastName")
    .sort({ bookedDate: -1, bookedTime: 1 })
    .lean();
};

/**
 * -----------------------------------------------------
 *  ASSIGN VENDOR/ADMIN TO BOOKING
 * -----------------------------------------------------
 */
export const assignVendorToBooking = async (
  bookingId,
  vendorId,
  vendorModel,
  adminId
) => {
  return await BookedService.findByIdAndUpdate(
    bookingId,
    {
      vendor: vendorId,
      vendorModel,
      assignedBy: adminId,
       status: "Ongoing",
    },
    { new: true }
  )
    .populate("service user vendor assignedBy")
    .lean();
};

/**
 * -----------------------------------------------------
 *  VENDOR ACCEPT
 * -----------------------------------------------------
 */
export const vendorAccept = async (bookingId) => {
  return await BookedService.findByIdAndUpdate(
    bookingId,
    { status: "Scheduled" },
    { new: true }
  )
    .populate("vendor", "firstName lastName email phone")
    .lean();
};

/**
 * -----------------------------------------------------
 *  VENDOR REJECT
 * -----------------------------------------------------
 */
export const vendorReject = async (bookingId) => {
  return await BookedService.findByIdAndUpdate(
    bookingId,
    { status: "Cancelled" },
    { new: true }
  )
    .populate("vendor", "firstName lastName email phone")
    .lean();
};

/**
 * -----------------------------------------------------
 *  USER COMPLETES BOOKING
 * -----------------------------------------------------
 */
export const completeBooking = async (bookingId) => {
  return await BookedService.findByIdAndUpdate(
    bookingId,
    { status: "Completed", completedOn: new Date() },
    { new: true }
  )
    .populate("vendor", "firstName lastName email phone")
    .lean();
};

/**
 * -----------------------------------------------------
 *  UPDATE BOOKED SERVICE
 * -----------------------------------------------------
 */
export const updateBookedService = async (bookingId, updates) => {
  return await BookedService.findByIdAndUpdate(bookingId, updates, {
    new: true,
  })
    .populate("service", "name user userType")
    .populate("user", "firstName lastName email phone")
    .populate("vendor", "firstName lastName email phone")
    .lean();
};

/**
 * -----------------------------------------------------
 *  GET BOOKINGS + APPROVED PROVIDERS
 * -----------------------------------------------------
 */
export const getBookingsWithVendors = async () => {
  const bookings = await BookedService.find()
    .populate("service")
    .populate("user")
    .populate("vendor")
    .lean();

  const approvedProviders = await ServiceProvider.find({ action: "Approved" })
    .populate("userId", "firstName lastName")
    .lean();

  const approvedMap = new Map();
  approvedProviders.forEach((sp) =>
    approvedMap.set(sp._id.toString(), sp.userId)
  );

  return { bookings, approvedMap };
};

/**
 * -----------------------------------------------------
 *  GET ADMIN DETAILS
 * -----------------------------------------------------
 */
export const getAdminById = async (adminId) => {
  return await Admin.findById(adminId)
    .select("firstName lastName")
    .lean();
};

/**
 * -----------------------------------------------------
 *  DETERMINE VENDOR TYPE
 * -----------------------------------------------------
 */
export const getVendorType = async (vendorId) => {
  const user = await User.findById(vendorId).lean();
  return user ? "User" : "Admin";
};
