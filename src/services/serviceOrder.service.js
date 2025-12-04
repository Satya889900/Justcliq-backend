// import { ApiError } from "../utils/ApiError.js";
// import * as repository from "../repository/serviceOrder.repository.js";
// import User from "../models/user.model.js";
// import Admin from "../models/admin.model.js";
// import BookedService from "../models/bookedService.model.js";


// // Admin: view all booked services
// // Admin: view all booked services



// // Admin: view single booking
// export const viewBookedServiceById = async (bookingId) => {
//   const booking = await repository.getBookedServiceById(bookingId);
//   if (!booking) throw new ApiError(404, "Booking not found");
//    // Only show vendor if assigned by admin
//   if (booking.vendor && booking.vendorModel !== 'Admin') {
//     booking.vendor = null;
//   }
//   return booking;
// };

// // Admin: assign a service to a user or admin
// // Assign vendor to booking
// // Assign vendor by admin
// export const assignVendorToBookingService = async (bookingId, vendorId, adminId) => {
//   const booking = await repository.getBookedServiceById(bookingId);
//   if (!booking) throw new ApiError(404, "Booking not found");

//   const vendorModel = await repository.getVendorType(vendorId);

//   // Update vendor, model, assignedBy, AND status
//   const updatedBooking = await repository.assignVendorToBooking(
//     bookingId,
//     vendorId,
//     vendorModel,
//     adminId,
//     {
//       status: "Ongoing"  // 🔥 VERY IMPORTANT
//     }
//   );

//   return updatedBooking;
// };



// // Update status for a booked service
// export const updateBookedServiceStatus = async (bookingId, status, currentUser) => {
//   const booking = await repository.getBookedServiceById(bookingId);
//   if (!booking) throw new ApiError(404, "Booked service not found");

//   // Only the creator of the service can update
//   const serviceCreatorId = booking.service.user.toString();
//   const serviceCreatorType = booking.service.userType;

//   if (
//     currentUser._id.toString() !== serviceCreatorId ||
//     currentUser.userType !== serviceCreatorType
//   ) {
//     throw new ApiError(403, "You are not authorized to update this booked service");
//   }

//   const updates = { status };

//   // Automatically set completedOn if status is "Completed"
//   if (status === "Completed") {
//     updates.completedOn = new Date();
//   }

//   const updatedBooking = await repository.updateBookedService(bookingId, updates);
//   return updatedBooking;
// };


// // Vendor accepts → Scheduled
// export const vendorAcceptBooking = async (bookingId, vendorId) => {
//   const booking = await repository.getBookingById(bookingId);
//   if (!booking) throw new ApiError(404, "Booking not found");

//   if (!booking.vendor || booking.vendor._id.toString() !== vendorId)
//     throw new ApiError(403, "Not authorized for this booking");

//   // Vendor Accept → Scheduled
//   return await BookedService.findByIdAndUpdate(
//     bookingId,
//     { status: "Scheduled" },
//     { new: true }
//   )
//     .populate("service user vendor assignedBy")
//     .lean();
// };

// // Vendor rejects → Cancelled
// // Vendor rejects → Cancelled
// export const vendorRejectBooking = async (bookingId, vendorId) => {
//   const booking = await repository.getBookingById(bookingId);
//   if (!booking) throw new ApiError(404, "Booking not found");

//   // Restrict vendor access
//   if (!booking.vendor || booking.vendor._id.toString() !== vendorId)
//     throw new ApiError(403, "Not authorized for this booking");

//   // Prevent rejecting completed booking
//   if (booking.status === "Completed") {
//     throw new ApiError(400, "Cannot reject a completed booking");
//   }

//   // Reset booking back to available
//   return await BookedService.findByIdAndUpdate(
//     bookingId,
//     {
//       status: "Upcoming",
//       vendor: null,
//       vendorModel: null,
//       assignedBy: null
//     },
//     { new: true }
//   )
//     .populate("service user vendor assignedBy")
//     .lean();
// };


// // User completes booking → Completed
// export const completeBookingByUserOrVendor = async (bookingId, callerId, callerType) => {
//   const booking = await repository.getBookingById(bookingId);
//   if (!booking) throw new ApiError(404, "Booking not found");

//   // USER completes only his own booking
//   if (callerType === "User") {
//     if (booking.user._id.toString() !== callerId) {
//       throw new ApiError(403, "User is not authorized to complete this booking");
//     }
//   }

//   // VENDOR completes only assigned booking
//   if (callerType === "Vendor" || callerType === "ServiceProvider") {
//     if (!booking.vendor || booking.vendor._id.toString() !== callerId) {
//       throw new ApiError(403, "Vendor is not assigned to this booking");
//     }
//   }

//   return await repository.completeBooking(bookingId);
// };



// export const getBookingsService = async () => {
//   const { bookings, approvedMap } = await repository.getBookingsWithVendors();

//   if (!bookings || bookings.length === 0) {
//     throw new ApiError(404, "No bookings found");
//   }

//   const result = [];
//   for (const b of bookings) {
//     let vendorName = null;

//     // Check if vendor is assigned
//    // Show vendor name only if assigned by admin
//     if (b.vendor && b.assignedBy) {
//       vendorName = `${b.vendor.firstName || ""} ${b.vendor.lastName || ""}`.trim();
//     }

//     // Only include bookings with approved vendor or Admin
//     if (!b.vendor && !vendorName) continue;

//     result.push({
//       bookingId: b._id,
//       serviceName: b.service?.name || "Unknown Service",
//       username: b.user?.firstName && b.user?.lastName
//         ? `${b.user.firstName} ${b.user.lastName}`.trim()
//         : "Unknown",
//       vendorName: vendorName || "Not Assigned",
//       status: b.status,
//       availedOn: b.bookedDate,
//       completedOn: b.completedOn || null,
//       action: "View / Update",
//     });
//   }

//   if (result.length === 0) throw new ApiError(404, "No bookings with approved vendors found");

//   return result;
// };


// export const viewAllBookedServices = async () => {
//   const bookings = await repository.fetchAllBookedServices();

//    if (!bookings || bookings.length === 0) {
//     throw new ApiError(404, "No booked services found");
//   }

//    return bookings.map(b => {
//   let vendorName = null;
//    if (b.vendor && b.assignedBy) {
//       vendorName = `${b.vendor.firstName || ""} ${b.vendor.lastName || ""}`.trim();
//     }

//   return {
//     bookingId: b._id,
//     serviceName: b.service?.name || "N/A",
//     username: b.user ? `${b.user.firstName} ${b.user.lastName}` : "Unknown",
//     vendorName: vendorName || "Not Assigned", // use computed value for both Admin and User
//     status: b.status || "Upcoming",
//     availedOn: b.bookedDate || b.availedOn,
//     completedOn: b.completedOn || null,
//     action: "View / Update"
//   }
// });

// };


import { ApiError } from "../utils/ApiError.js";
import * as repository from "../repository/serviceOrder.repository.js";
import BookedService from "../models/bookedService.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";

// Admin — View single booking
export const viewBookedServiceById = async (bookingId) => {
  const booking = await repository.getBookedServiceById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  // Admin should only see vendor assigned by admin
  if (booking.vendor && booking.vendorModel !== "Admin") {
    booking.vendor = null;
  }

  return booking;
};

// Admin — Assign vendor
export const assignVendorToBookingService = async (bookingId, vendorId, adminId) => {
  const booking = await repository.getBookedServiceById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  const vendorModel = await repository.getVendorType(vendorId);

  return await repository.assignVendorToBooking(
    bookingId,
    vendorId,
    vendorModel,
    adminId,
    { status: "Ongoing" }
  );
};

// Creator updates status
export const updateBookedServiceStatus = async (bookingId, status, currentUser) => {
  const booking = await repository.getBookedServiceById(bookingId);
  if (!booking) throw new ApiError(404, "Booked service not found");

  // Only creator can update
  const creatorId = booking.service.user.toString();
  const creatorType = booking.service.userType;

  if (
    currentUser._id.toString() !== creatorId ||
    currentUser.userType !== creatorType
  ) {
    throw new ApiError(403, "You are not authorized to update this booked service");
  }

  const updates = { status };
  if (status === "Completed") updates.completedOn = new Date();

  return await repository.updateBookedService(bookingId, updates);
};

// Vendor accept
export const vendorAcceptBooking = async (bookingId, vendorId) => {
  const booking = await repository.getBookingById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  if (!booking.vendor || booking.vendor._id.toString() !== vendorId) {
    throw new ApiError(403, "Not authorized for this booking");
  }

  return await BookedService.findByIdAndUpdate(
  bookingId,
  {
    status: "Scheduled",       // status stays scheduled
    vendorAccepted: true       // vendor accepted
  },
  { new: true }
).populate("service user vendor assignedBy");

};

// Vendor reject
export const vendorRejectBooking = async (bookingId, vendorId) => {
  const booking = await repository.getBookingById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  if (!booking.vendor || booking.vendor._id.toString() !== vendorId) {
    throw new ApiError(403, "Not authorized for this booking");
  }

  if (booking.status === "Completed") {
    throw new ApiError(400, "Cannot reject a completed booking");
  }

  return await BookedService.findByIdAndUpdate(
    bookingId,
    {
      status: "Upcoming",
      vendor: null,
      vendorModel: null,
      assignedBy: null,
      vendorAccepted: false,

    },
    { new: true }
  ).populate("service user vendor assignedBy");
};

// User or Vendor completes service
export const completeBookingByUserOrVendor = async (
  bookingId,
  callerId,
  callerType
) => {
  const booking = await BookedService.findById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  if (callerType === "User" && booking.user.toString() !== callerId) {
    throw new ApiError(403, "User not authorized");
  }

  if (callerType !== "User" && booking.vendor?.toString() !== callerId) {
    throw new ApiError(403, "Vendor not authorized");
  }

  return booking;
};


// Admin booked service list
export const viewAllBookedServices = async () => {
  const bookings = await repository.fetchAllBookedServices();
  if (!bookings.length) throw new ApiError(404, "No booked services found");

  return bookings.map((b) => ({
    bookingId: b._id,
    serviceName: b.service?.name || "N/A",
    username: b.user ? `${b.user.firstName} ${b.user.lastName}` : "Unknown",
    vendorName:
      b.vendor && b.assignedBy
        ? `${b.vendor.firstName} ${b.vendor.lastName}`
        : "Not Assigned",
    status: b.status,
    availedOn: b.bookedDate,
    completedOn: b.completedOn || null,
    action: "View / Update",
  }));
};
// Backend service list
export const getBookingsService = async () => {
  const { bookings } = await repository.getBookingsWithVendors();
  if (!bookings.length) throw new ApiError(404, "No bookings found");

  const result = [];

  for (const b of bookings) {
    let vendorName = null;

    // If a vendor is assigned, show vendor name
    if (b.vendor)
      vendorName = `${b.vendor.firstName} ${b.vendor.lastName}`.trim();

    result.push({
      bookingId: b._id,
      serviceName: b.service?.name || "Unknown Service",
      username: `${b.user.firstName} ${b.user.lastName}`,
      vendorName: vendorName || "Not Assigned",   // ← FIXED
      status: b.status,
      availedOn: b.bookedDate,
      completedOn: b.completedOn || null,
    });
  }

  return result;
};
