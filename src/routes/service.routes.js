import { Router } from "express";
import {
  getServicesByCategoryController,
  addUserServiceController,
  getServiceCategoryController,
} from "../controllers/service.controller.js";
import { uploadServiceImage } from "../middlewares/ServiceUpload.js";
import { attachFileToBody } from "../middlewares/attachFileToBody.js";

const router = Router();

// Create service
router.post("/services", uploadServiceImage,
   attachFileToBody("image"),
  addUserServiceController);

// Read services by category
router.get("/service-categories/:categoryId", getServicesByCategoryController);

// GET category by service ID
router.get("/service-category/:serviceId", getServiceCategoryController);


export default router;
