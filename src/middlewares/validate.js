// // // middlewares/validate.js
// // import { ApiError } from "../utils/ApiError.js";

// // export const validate = (schema, property = "body") => {
// //   return (req, res, next) => {
// //      console.log('req.body BEFORE validation:', req.body); 
// //     const { error, value } = schema.validate(req[property], {
// //       abortEarly: false,
// //       stripUnknown: true,
// //     });

// //     if (error) {
// //       return next(
// //         new ApiError(
// //           400,
// //           "Validation failed",
// //           error.details.map(err => ({
// //             message: err.message,
// //             path: err.path,
// //           }))
// //         )
// //       );
// //     }

// //     // Put validated values back into req.body
// //     req[property] = value;

    
// //     next();
// //   };
// // };


// import { ApiError } from "../utils/ApiError.js";

// export const validate = (schema, property = "body") => {
//   return (req, res, next) => {
//     const target =
//       property === "query"
//         ? { ...req.query } // clone
//         : property === "params"
//         ? { ...req.params }
//         : req.body;

//     const { error, value } = schema.validate(target, {
//       abortEarly: false,
//       stripUnknown: true,
//     });

//     if (error) {
//       return next(
//         new ApiError(
//           400,
//           "Validation failed",
//           error.details.map((err) => ({
//             message: err.message,
//             path: err.path,
//           }))
//         )
//       );
//     }

//     // ❌ Do NOT overwrite req.query (Express 5 getter-only)
//     // So we attach validated data separately:
//     if (property === "query") req.validatedQuery = value;
//     else if (property === "params") req.validatedParams = value;
//     else req.body = value;

//     next();
//   };
// };
import Joi from "joi";
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const data = req[property];

    const { value, error } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ApiError(
        400,
        error.details.map((e) => e.message).join(", ")
      );
    }

    // ⭐ IMPORTANT — attach validated data
    if (property === "body") req.validatedBody = value;
    if (property === "params") req.validatedParams = value;
    if (property === "query") req.validatedQuery = value;

    next();
  };
};
