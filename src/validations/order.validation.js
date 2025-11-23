import Joi from "joi";

// MongoDB ObjectId validation
const objectId = Joi.string().hex().length(24);

// For fetching orders by time range
export const getOrderedProductsByTimeSchema = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
});

// For placing an order
export const placeOrderSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: objectId.required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});
