// /*serviceprovider.repository.js*/

// // repositories/serviceProvider.repository.js
// import User from "../models/user.model.js";
// import Admin from "../models/admin.model.js";
// import ServiceProvider from "../models/serviceProvider.model.js";
// import Service from "../models/service.model.js";

// // Get users/admins who posted services in ServiceProvider format
// // Fetch ServiceProvider record by serviceId
// // Fetch all services with user/admin populated
// export const getServiceProvidersWithActions = async () => {
//   // fetch all services
//   console.log("hello");

//   const services = await Service.find()
//     .populate("user")
//     .sort({ createdAt: -1 }) // latest first
//     .lean();
//   console.log(services, "services");

//   return services;

//   // // fetch all serviceProvider records
//   // const serviceProviders = await ServiceProvider.find().lean();
//   // const spMap = new Map();
//   // serviceProviders.forEach((sp) => {
//   //   spMap.set(sp.serviceId.toString(), sp);
//   // });

//   // // 3️⃣ Filter out Admins
//   // const users = await User.find({
//   //   _id: { $in: services.map((s) => s.user?._id).filter(Boolean) },
//   //   userType: { $ne: "Admin" }, // exclude Admins
//   // }).lean();

//   // const userMap = new Map();
//   // users.forEach((u) => userMap.set(u._id.toString(), { ...u, role: "User" }));


//   // // 4️⃣ Map services to response
//   // const result = services
//   //   .map((service) => {
//   //     const user = service.user
//   //       ? userMap.get(service.user._id.toString())
//   //       : null;

//   //     console.log(user, "usrer`");

//   //     // Skip services that are admin-provided
//   //     if (!user) return null;

//   //     const sp = spMap.get(service._id.toString());

//   //     // map response

//   //     return {
//   //       _id: service._id,
//   //       name:
//   //         `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
//   //         user.businessName ||
//   //         "Unknown",
//   //       profileImage: user.profileImage || null,
//   //       serviceType: service.name,
//   //       cost: service.cost,
//   //       ratings: 0, // default, can compute later if needed
//   //       action: sp?.action || "Pending",
//   //       reason: sp?.reason || "",
//   //       createdAt: service.createdAt,
//   //     };
//   //   })
//   //   .filter(Boolean); // remove nulls (Admin services)

//   // // return result; // ✅ take from ServiceProvider model
// };

// // Update action & reason
// export const updateServiceProviderAction = async (
//   providerId,
//   action,
//   reason
// ) => {
//   return await ServiceProvider.findByIdAndUpdate(
//     providerId,
//     { action, reason },
//     { new: true }
//   ).lean();
// };

// export const createServiceProviderAction = async ({
//   userId,
//   serviceId,
//   action,
//   reason,
// }) => {
//   const provider = new ServiceProvider({ userId, serviceId, action, reason });
//   return await provider.save();
// };

// export const findServiceWithUser = async (serviceId) => {
//   return await Service.findById(serviceId).populate("user").lean();
// };

// // Find a ServiceProvider record by serviceId
// export const findServiceProviderByServiceId = async (serviceId) => {
//   return await ServiceProvider.findOne({ serviceId })
//     .populate("userId", "firstName lastName phone")
//     .lean();
// };

// // Fetch approved providers (users/admin) by service name
// export const fetchApprovedProvidersByServiceName = async (serviceName) => {
//   if (!serviceName) return [];

//   // Fetch all services with this name
//   const services = await Service.find({ name: serviceName }).lean();
//   if (!services || services.length === 0) return [];

//   const serviceIds = services.map((s) => s._id);

//   // 1️⃣ Approved User providers (exclude Admin)
//   const approvedProviders = await ServiceProvider.find({
//     serviceId: { $in: serviceIds },
//     action: "Approved",
//   })
//     .populate("userId", "firstName lastName phone userType")
//     .lean();

//   const users = approvedProviders
//     .filter((sp) => sp.userId.userType !== "Admin")
//     .map((sp) => ({
//       _id: sp.userId._id,
//       name:
//         `${sp.userId.firstName || ""} ${sp.userId.lastName || ""}`.trim() ||
//         "Unknown",
//       phone: sp.userId.phone,
//       rating: 0,
//       type: "User",
//     }));

//   // 2️⃣ Admin providers: include any admin who has a service with this name
//   const adminProviders = [];
//   for (const service of services) {
//     if (service.userType === "Admin") {
//       const admin = await Admin.findById(service.user)
//         .select("firstName lastName phone")
//         .lean();
//       if (admin) {
//         adminProviders.push({
//           _id: admin._id,
//           name: `${admin.firstName} ${admin.lastName}`,
//           phone: admin.phone,
//           rating: 5,
//           type: "Admin",
//         });
//       }
//     }
//   }

//   // Remove duplicate admins if multiple services exist
//   const adminMap = new Map();
//   adminProviders.forEach((a) => adminMap.set(a._id.toString(), a));

//   return [...users, ...Array.from(adminMap.values())];
// };
/* ----------------------------------------------------
   repositories/serviceProvider.repository.js
---------------------------------------------------- */

import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import ServiceProvider from "../models/serviceProvider.model.js";
import Service from "../models/service.model.js";


/* ====================================================
   1️⃣ GET ALL SERVICE PROVIDERS WITH ACTIONS (ADMIN PAGE)
   ==================================================== */
export const getServiceProvidersWithActions = async () => {
  console.log("Fetching service providers with actions...");

  // Fetch all services (includes admin + user)
  const services = await Service.find()
    .populate("user")
    .sort({ createdAt: -1 })
    .lean();

  if (!services || services.length === 0) return [];

  /* ---------------------------------------------
     Fetch all ServiceProvider records (actions)
  --------------------------------------------- */
  const serviceProviders = await ServiceProvider.find().lean();
  const spMap = new Map();

  serviceProviders.forEach((sp) =>
    spMap.set(sp.serviceId.toString(), sp)
  );

  /* ---------------------------------------------
     Filter out ONLY real users (exclude Admins)
  --------------------------------------------- */
  const users = await User.find({
    _id: { $in: services.map((s) => s.user?._id).filter(Boolean) },
    userType: { $ne: "Admin" }, // exclude admins
  }).lean();

  const userMap = new Map();
  users.forEach((u) => userMap.set(u._id.toString(), u));

  /* ---------------------------------------------
     Construct FINAL ADMIN RESPONSE
  --------------------------------------------- */
  const result = services
    .map((service) => {
      // Only users — skip admin services
      const user = service.user
        ? userMap.get(service.user._id.toString())
        : null;

      if (!user) return null; // skip admins

      const sp = spMap.get(service._id.toString());

      return {
        _id: service._id,
        providerId: user._id,
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.businessName ||
          "Unknown",
        profileImage: user.profileImage || null,
        serviceType: service.name,
        cost: service.cost,
        ratings: 0, // can update later
        action: sp?.action || "Pending", // default Pending
        reason: sp?.reason || "",
        createdAt: service.createdAt,
      };
    })
    .filter(Boolean);

  return result;
};

/* ====================================================
   2️⃣ UPDATE ACTION & REASON
   ==================================================== */
export const updateServiceProviderAction = async (providerId, action, reason) => {
  return await ServiceProvider.findByIdAndUpdate(
    providerId,
    { action, reason },
    { new: true }
  ).lean();
};

/* ====================================================
   3️⃣ CREATE SERVICE PROVIDER ACTION
   ==================================================== */
export const createServiceProviderAction = async ({
  userId,
  serviceId,
  action,
  reason,
}) => {
  const provider = new ServiceProvider({ userId, serviceId, action, reason });
  return await provider.save();
};

/* ====================================================
   4️⃣ FIND SERVICE WITH USER POPULATED
   ==================================================== */
export const findServiceWithUser = async (serviceId) => {
  return await Service.findById(serviceId).populate("user").lean();
};

/* ====================================================
   5️⃣ FIND ServiceProvider BY serviceId
   ==================================================== */
export const findServiceProviderByServiceId = async (serviceId) => {
  return await ServiceProvider.findOne({ serviceId })
    .populate("userId", "firstName lastName phone")
    .lean();
};

/* ====================================================
   6️⃣ GET APPROVED PROVIDERS BY SERVICE NAME
   ==================================================== */
export const fetchApprovedProvidersByServiceName = async (serviceName) => {
  if (!serviceName) return [];

  const services = await Service.find({ name: serviceName }).lean();
  if (!services || services.length === 0) return [];

  const serviceIds = services.map(s => s._id);

  const approvedProviders = await ServiceProvider.aggregate([
    {
      $match: {
        serviceId: { $in: serviceIds },
        action: "Approved"
      }
    },

    // ✅ JOIN USER
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData"
      }
    },
    { $unwind: "$userData" },

    // ✅ ✅ JOIN BOOKINGS (THIS IS WHAT YOU WERE MISSING)
    {
      $lookup: {
        from: "bookedservices",
        localField: "serviceId",
        foreignField: "service",
        as: "bookings"
      }
    },

    // ✅ ✅ CALCULATE AVG RATING FROM BOOKINGS
    {
      $addFields: {
        avgRating: {
          $cond: [
            { $gt: [{ $size: "$bookings" }, 0] },
            { $avg: "$bookings.avgRating" },
            0
          ]
        }
      }
    },

    // ✅ Justcliq priority
    {
      $addFields: {
        isJustcliqVendor: {
          $cond: [
            { $regexMatch: { input: "$userData.businessName", regex: /justcliq/i } },
            1,
            0
          ]
        }
      }
    },

    // ✅ SORT: Justcliq → Rating → Newest
    {
      $sort: {
        isJustcliqVendor: -1,
        avgRating: -1,
        createdAt: -1
      }
    },

    // ✅ ✅ FINAL RESPONSE NOW INCLUDES RATING
    {
      $project: {
        _id: "$userData._id",
        firstName: "$userData.firstName",
        lastName: "$userData.lastName",
        phone: "$userData.phone",
        businessName: "$userData.businessName",
        profileImage: "$userData.profileImage",
        avgRating: 1,          // ✅ NOW WILL COME
        isJustcliqVendor: 1
      }
    }
  ]);

  return approvedProviders;
};
