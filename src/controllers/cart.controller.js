import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as cartService from "../services/cart.service.js";
import { validate } from "../middlewares/validate.js";
import { addToCartSchema, removeFromCartSchema,checkoutCartSchema } from "../validations/cart.validation.js";
import { clearCartService } from "../services/cart.service.js";

export const getCartController = asyncHandler(async (req, res) => {
  const cart = await cartService.getCartService(req.user._id);
  res.json(new ApiResponse(200, cart, "Cart fetched successfully"));
}); 


export const addItemToCartController = [
  validate(addToCartSchema, "body"),
  asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    const updatedItem = await cartService.addItemToCartService(
      req.user._id,
      productId,
      quantity
    );

    return res.json(
      new ApiResponse(200, updatedItem, "Item added to cart")
    );
  }),
];


export const removeItemFromCartController = [
  validate(removeFromCartSchema, "body"),
  asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const cart = await cartService.removeItemFromCartService(req.user._id, productId);
    res.json(new ApiResponse(200, cart, "Item removed from cart successfully"));
  }),
];

export const checkoutCartController =[
   validate(checkoutCartSchema, "body"),
   asyncHandler(async (req, res) => {
  const orders = await cartService.checkoutCartService(req.user._id, req.body);
  res.json(new ApiResponse(200, orders, "Checkout successful, orders created"));
}),
]
export const increaseQuantityController = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const cart = await cartService.increaseQuantityService(req.user._id, productId);
  res.json(new ApiResponse(200, cart, "Quantity increased"));
});

export const decreaseQuantityController = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const cart = await cartService.decreaseQuantityService(req.user._id, productId);
  res.json(new ApiResponse(200, cart, "Quantity decreased"));
});

 
export const clearCartController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await cartService.clearCartService(userId);

  return res.json(
    new ApiResponse(200, cart, "All items removed from cart successfully")
  );
});
