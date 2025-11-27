// controllers/serviceOrder.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import * as service from "../services/serviceOrder.service.js";
import { validate } from "../middlewares/validate.js";
import {
  updateBookedServiceSchema,
  assignVendorSchema,
} from "../validations/serviceOrder.validator.js";

import BookedService from "../models/bookedService.model.js";
import User from "../models/user.model.js";
import Joi from "joi";
import mongoose from "mongoose";

/* ============================================================
   📌 ADMIN: GET ALL BOOKINGS
============================================================ */
export const getAllBookedServicesController = asyncHandler(async (req, res) => {
  const bookings = await service.viewAllBookedServices();
  res.json(
    new ApiResponse(200, bookings, "All booked services fetched successfully")
  );
});

/* ============================================================
   📌 ADMIN: GET SINGLE BOOKING BY ID
============================================================ */
export const getBookedServiceByIdController = [
  validate(
    Joi.object({ bookingId: Joi.string().hex().length(24).required() }),
    "params"
  ),
  asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const booking = await service.viewBookedServiceById(bookingId);
    res.json(new ApiResponse(200, booking, "Booked service fetched successfully"));
  }),
];

/* ============================================================
   📌 FIXED — ADMIN ASSIGN VENDOR TO BOOKING  
   (Correct model: BookedService NOT ServiceOrder)
============================================================ */
export const assignVendorController = [
  validate(assignVendorSchema, "body"),
  asyncHandler(async (req, res) => {
    const { bookingId, vendorId } = req.validatedBody;
    const adminId = req.user._id;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new ApiError(400, "Invalid bookingId");
    }

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      throw new ApiError(400, "Invalid vendorId");
    }

    // Find booking inside BookedService (CORRECT)
    const booking = await BookedService.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, "Service order not found");
    }

    // Check vendor exists
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      throw new ApiError(404, "Vendor not found");
    }

    // Apply updates
    booking.vendor = vendorId;
    booking.vendorModel = "User";
    booking.assignedBy = adminId;
    booking.status = "Scheduled";

    await booking.save();

    const populatedBooking = await BookedService.findById(bookingId)
      .populate("service", "name cost image category")
      .populate("vendor", "firstName lastName phone email")
      .populate("user", "firstName lastName phone email");

    return res.json(
      new ApiResponse(200, populatedBooking, "Vendor assigned successfully")
    );
  })
];
/* ============================================================
   📌 ADMIN: GET ONGOING BOOKINGS
============================================================ */
export const getOngoingOrdersController = asyncHandler(async (req, res) => {
  const ongoing = await BookedService.find({
    status: { $in: ["Scheduled", "Ongoing"] }, // Your ongoing statuses
  })
    .populate("service", "name cost image category")
    .populate("vendor", "firstName lastName phone email")
    .populate("user", "firstName lastName phone email")
    .lean();

  return res.status(200).json(
    new ApiResponse(200, ongoing, "Ongoing booked services fetched successfully")
  );
});

/* ============================================================
   📌 UPDATE STATUS OF BOOKING (ADMIN)
============================================================ */
export const updateBookedServiceStatusController = [
  validate(updateBookedServiceSchema, "body"),
  asyncHandler(async (req, res) => {
    const { bookingId, status } = req.validatedBody;
    const currentUser = req.user;

    const updatedBooking = await service.updateBookedServiceStatus(
      bookingId,
      status,
      currentUser
    );

    res.json(
      new ApiResponse(200, updatedBooking, "Booked service updated successfully")
    );
  }),
];

/* ============================================================
   📌 VENDOR ACCEPT BOOKING
============================================================ */
export const vendorAcceptController = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const { _id: userId, userType } = req.user;

  const booking = await service.vendorAcceptBooking(
    bookingId,
    userId.toString(),
    userType
  );

  res.json(
    new ApiResponse(200, booking, "Booking accepted, status updated to Scheduled")
  );
});

/* ============================================================
   📌 VENDOR REJECT BOOKING
============================================================ */
export const vendorRejectController = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const { _id: userId, userType } = req.user;

  const booking = await service.vendorRejectBooking(
    bookingId,
    userId.toString(),
    userType
  );

  res.json(
    new ApiResponse(200, booking, "Booking rejected, status updated to Cancelled")
  );
});

/* ============================================================
   📌 UPCOMING BOOKINGS FOR ADMIN
============================================================ */
export const getUpcomingOrdersController = asyncHandler(async (req, res) => {
  const upcoming = await BookedService.find({ status: "Upcoming" }).lean();

  return res.status(200).json(
    new ApiResponse(200, upcoming, "Upcoming booked services fetched successfully")
  );
});

/* ============================================================
   📌 COMPLETE BOOKING (USER or VENDOR)
============================================================ */
export const completeBookingController = asyncHandler(async (req, res) => {
  const { bookingId, rating, review } = req.body;
  const { _id: userId, userType } = req.user;

  if (!bookingId) {
    throw new ApiError(400, "bookingId required");
  }

  const booking = await BookedService.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // USER MARKS COMPLETED
  if (userType === "User" && booking.user.toString() === userId.toString()) {
    if (!rating) throw new ApiError(400, "Rating required from user");
    booking.userCompleted = true;
    booking.rating = { score: rating, review: review || "" };
  }

  // VENDOR MARKS COMPLETED
  if (booking.vendor.toString() === userId.toString()) {
    booking.vendorCompleted = true;
  }

  // FINAL COMPLETION
  if (booking.userCompleted && booking.vendorCompleted) {
    booking.status = "Completed";
    booking.completedOn = new Date();
  }

  await booking.save();

  return res.json(
    new ApiResponse(200, booking, "Completion updated successfully")
  );
});

/* ============================================================
   📌 ADMIN LIST ALL BOOKINGS
============================================================ */
export const getBookingsController = asyncHandler(async (req, res) => {
  const bookings = await service.getBookingsService();
  return res
    .status(200)
    .json(
      new ApiResponse(200, bookings, "All booked services fetched successfully")
    );
});
