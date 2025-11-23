// middlewares/attachFileToBody.js
export const attachFileToBody = (fieldName) => {
  return (req, res, next) => {
    if (!req.body) req.body = {}; // initialize if undefined
    if (req.file && req.file.path) {
      req.body[fieldName] =
        req.file.path || req.file.url || req.file.secure_url; // multer + Cloudinary URL
    }
    console.log("🚀 req.file:", req.file);
    console.log("🚀 req.body after Multer:", req.body);

    console.log("🚀 attachFileToBody req.body:", req.body);
    next();
  };
};
