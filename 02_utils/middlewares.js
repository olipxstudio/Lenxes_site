const { serverError, clientError } = require("./common");
const User = require("../models/users/User");
const path = require("path");
// Check if user already exists
exports.checkIfUserAlreadyExist = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return clientError(res, "Email already exists");
  }
  next();
};

// validate user email
exports.validateUserEmail = (req, res, next) => {
  const { email } = req.body;

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  emailRegex.test(String(email).toLowerCase());
  if (!emailRegex) {
    return clientError(res, "Invalid email");
  }
  next();
};

// Check if image is compatible to upload
exports.checkImage = (req, res, next) => {
  const { image } = req.files;
  if (image) {
    req.image = image;

    if (!image.mimetype.startsWith("image")) {
      return clientError(res, "Please upload a valid image");
    }

    if (image.size > process.env.MAX_FILE_UPLOAD) {
      return clientError(res, "Please upload an image less than 1mb");
    }

    req.image = image;
    next();
  } else {
    return clientError(res, "Please upload an image");
  }
};

// upload image from req.image with express-fileupload then send image url through req.imageUrl
exports.uploadImage = async (req, res, next) => {
  const { image } = req;

  const fileName = image.name;
  const extension = path.extname(fileName);
  const md5 = image.md5;

  let sampleFile;
  let uploadPath;

  sampleFile = image;
  uploadPath = path.join(__dirname, "../public/uploads/images");
  try {
    const fileName = `image${md5}${extension}`;
    const filePath = path.join(uploadPath, fileName);
    await sampleFile.mv(filePath);
    const imageUrl = `files/images/${fileName}`;
    req.imageUrl = imageUrl;
    next();
  } catch (error) {
    serverError(res, error);
  }
};
