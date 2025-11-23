// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import {
//   addFeaturedServiceService,
//   updateFeaturedServiceService,
//   deleteFeaturedServiceService,
//   fetchAllFeaturedServicesService,
// } from "../services/featuredService.service.js";


// import { validate } from "../middlewares/validate.js";
// import {
//   createFeaturedServiceSchema,
//   updateFeaturedServiceSchema,
//   featuredServiceIdSchema,
// } from "../validations/featuredService.validation.js";

// export const addFeaturedServiceController = [
//   validate(createFeaturedServiceSchema, "body"),
//   asyncHandler(async (req, res) => {
//     const userId = req.user._id;
//     const userType = req.user.userType;
//     const file = req.file;

//     const newService = await addFeaturedServiceService(userId, userType, req.body, file);

//     return res
//       .status(201)
//       .json(new ApiResponse(201, newService, "Featured service added successfully"));
//   }),
// ];

// export const updateFeaturedServiceController = [
//   validate(featuredServiceIdSchema, "params"),
//   validate(updateFeaturedServiceSchema, "body"),
//   asyncHandler(async (req, res) => {
//     const updated = await updateFeaturedServiceService(
//       req.params.serviceId,
//       req.body,
//       req.file
//     );

//     return res
//       .status(200)
//       .json(new ApiResponse(200, updated, "Featured service updated successfully"));
//   }),
// ];

// export const deleteFeaturedServiceController = [
//   validate(featuredServiceIdSchema, "params"),
//   asyncHandler(async (req, res) => {
//     const deleted = await deleteFeaturedServiceService(req.params.serviceId);
//     return res.json(
//       new ApiResponse(200, deleted, "Featured service deleted successfully")
//     );
//   }),
// ];

// // Get All Featured Services

// export const getAllFeaturedServicesController = asyncHandler(async (req, res) => {
//   const userType = req.user.userType;

//   const services = await fetchAllFeaturedServicesService(userType);

//   res.json(new ApiResponse(200, services, "Featured services fetched"));
// });

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  addFeaturedServiceService,
  updateFeaturedServiceService,
  deleteFeaturedServiceService,
  fetchAllFeaturedServicesService,
} from "../services/featuredService.service.js";
import { validate } from "../middlewares/validate.js";
import {
  createFeaturedServiceSchema,
  updateFeaturedServiceSchema,
  featuredServiceIdSchema,
} from "../validations/featuredService.validation.js";

/* ADD */
export const addFeaturedServiceController = [
  validate(createFeaturedServiceSchema, "body"),
  asyncHandler(async (req, res) => {
    const newService = await addFeaturedServiceService(
      req.user._id,
      req.user.userType,
      req.body,
      req.file
    );

    res
      .status(201)
      .json(
        new ApiResponse(201, newService, "Featured service added successfully")
      );
  }),
];

/* UPDATE */
export const updateFeaturedServiceController = [
  validate(featuredServiceIdSchema, "params"),
  validate(updateFeaturedServiceSchema, "body"),
  asyncHandler(async (req, res) => {
    const updated = await updateFeaturedServiceService(
      req.params.serviceId,
      req.body,
      req.file
    );

    res.json(
      new ApiResponse(200, updated, "Featured service updated successfully")
    );
  }),
];

/* DELETE */
export const deleteFeaturedServiceController = [
  validate(featuredServiceIdSchema, "params"),
  asyncHandler(async (req, res) => {
    const deleted = await deleteFeaturedServiceService(req.params.serviceId);
    res.json(
      new ApiResponse(200, deleted, "Featured service deleted successfully")
    );
  }),
];

/* GET ALL */
export const getAllFeaturedServicesController = asyncHandler(
  async (req, res) => {
    const services = await fetchAllFeaturedServicesService(req.user.userType);

    res.json(
      new ApiResponse(200, services, "Featured services fetched successfully")
    );
  }
);
