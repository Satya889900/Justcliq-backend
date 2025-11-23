// import { ApiError } from "../utils/ApiError.js";
// import {
//   createFeaturedService,
//   getFeaturedServiceById,
//   updateFeaturedServiceById,
//   deleteFeaturedServiceById,
//   getAllFeaturedServices,
// } from "../repository/featuredService.repository.js";

// import cloudinary from "../config/cloudinary.js";

// export const addFeaturedServiceService = async (userId, userType, serviceData, file) => {
//   const { name , status} = serviceData;
//   if (!name) throw new ApiError(400, "Name is required");

//   if (!file) throw new ApiError(400, "Image is required");

//   const uploadResult = await cloudinary.uploader.upload(file.path, {
//     folder: "featuredServices",
//     resource_type: "image",
//   });

//   const payload = {
//     name,
//     image: uploadResult.secure_url,
//     imagePublicId: uploadResult.public_id,
//     createdBy: userId,
//     userType,
//   };

//   return await createFeaturedService(payload);
// };


// export const updateFeaturedServiceService = async (serviceId, updateData, file) => {
//   const existing = await getFeaturedServiceById(serviceId);
//   if (!existing) throw new ApiError(404, "Featured Service not found");

//   const updates = {};

//   if (updateData.name) updates.name = updateData.name;
//   if (updateData.status) updates.status = updateData.status;

  

//   if (file) {
//     const uploadResult = await cloudinary.uploader.upload(file.path, {
//       folder: "featuredServices",
//       resource_type: "image",
//     });

//     updates.image = uploadResult.secure_url;
//     updates.imagePublicId = uploadResult.public_id;

//     // delete old image
//     if (existing.imagePublicId) {
//       try {
//         await cloudinary.uploader.destroy(existing.imagePublicId);
//       } catch (error) {}
//     }
//   }

//   return await updateFeaturedServiceById(serviceId, updates);
// };


// export const deleteFeaturedServiceService = async (serviceId) => {
//   const existing = await getFeaturedServiceById(serviceId);
//   if (!existing) throw new ApiError(404, "Featured Service not found");

//   if (existing.imagePublicId) {
//     try {
//       await cloudinary.uploader.destroy(existing.imagePublicId);
//     } catch (err) {}
//   }

//   return await deleteFeaturedServiceById(serviceId);
// };

// // Get all Featured Services
// export const fetchAllFeaturedServicesService = async () => {
//   return await getAllFeaturedServices();
// };
import { ApiError } from "../utils/ApiError.js";
import {
  createFeaturedService,
  getFeaturedServiceById,
  updateFeaturedServiceById,
  deleteFeaturedServiceById,
  getAllFeaturedServicesAdmin,
  getAllFeaturedServicesUser,
} from "../repository/featuredService.repository.js";
import cloudinary from "../config/cloudinary.js";

/* ADD */
export const addFeaturedServiceService = async (userId, userType, data, file) => {
  if (!data.name) throw new ApiError(400, "Name is required");
  if (!file) throw new ApiError(400, "Image is required");

  const upload = await cloudinary.uploader.upload(file.path, {
    folder: "featuredServices",
  });

  return await createFeaturedService({
    name: data.name,
    status: data.status || "Active",
    image: upload.secure_url,
    imagePublicId: upload.public_id,
    createdBy: userId,
    userType,
  });
};

/* UPDATE */
export const updateFeaturedServiceService = async (id, data, file) => {
  const existing = await getFeaturedServiceById(id);
  if (!existing) throw new ApiError(404, "Not found");

  const updates = { ...data };

  if (file) {
    const upload = await cloudinary.uploader.upload(file.path, {
      folder: "featuredServices",
    });

    updates.image = upload.secure_url;
    updates.imagePublicId = upload.public_id;

    if (existing.imagePublicId) {
      await cloudinary.uploader.destroy(existing.imagePublicId);
    }
  }

  return await updateFeaturedServiceById(id, updates);
};

/* DELETE */
export const deleteFeaturedServiceService = async (id) => {
  const existing = await getFeaturedServiceById(id);
  if (!existing) throw new ApiError(404, "Not found");

  if (existing.imagePublicId) {
    await cloudinary.uploader.destroy(existing.imagePublicId);
  }

  return await deleteFeaturedServiceById(id);
};

/* GET ALL */
export const fetchAllFeaturedServicesService = async (userType) => {
  return userType === "Admin"
    ? getAllFeaturedServicesAdmin()
    : getAllFeaturedServicesUser();
};
