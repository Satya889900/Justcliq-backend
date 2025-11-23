// validations/serviceProvider.validation.js
import Joi from "joi";

// PATCH /admin/api/serviceProvider/services/:serviceId/action
export const updateServiceProviderActionSchema = Joi.object({
  action: Joi.string().valid("Pending", "Approved", "Disapproved", "Suspended").required(),
  reason: Joi.string().min(5).max(500).when("action", {
    is: Joi.string().valid("Disapproved", "Suspended"),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

// GET /user/service-providers/by-name/:serviceName
export const getApprovedProvidersByServiceNameSchema = Joi.object({
  serviceName: Joi.string().min(2).max(100).required(),
});