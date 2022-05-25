const { serverError, clientError } = require("./common");
const User = require("../models/users/User");
const path = require("path");
const fs = require("fs");
const jimp = require("jimp");
const { log } = require("console");
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

// create a middleware to upload images
exports.checkImage = async (req, res, next) => {
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

// upload image from req.image with express-fileupload the send image url through req.imageUrl
exports.uploadImage = async (req, res, next) => {
  const { image } = req;

  const fileName = image.name;
  const extension = path.extname(fileName);
  const md5 = image.md5;

  // resize image to three different sizes
  const imageName = `image${md5}`;
  const imagePath = path.join(__dirname, "../public/uploads/");

  const imagePathSmall = path.join(imagePath, "small/");
  const imagePathMedium = path.join(imagePath, "medium/");
  const imagePathLarge = path.join(imagePath, "large/");

  const imagePathSmallName = `${imageName}_small${extension}`;
  const imagePathMediumName = `${imageName}_medium${extension}`;
  const imagePathLargeName = `${imageName}_large${extension}`;

  const imagePathSmallUrl = `/files/images/small/${imagePathSmallName}`;
  const imagePathMediumUrl = `/files/images/medium/${imagePathMediumName}`;
  const imagePathLargeUrl = `/files/images/large/${imagePathLargeName}`;

  const imagePathSmallPath = path.join(imagePathSmall, imagePathSmallName);
  const imagePathMediumPath = path.join(imagePathMedium, imagePathMediumName);
  const imagePathLargePath = path.join(imagePathLarge, imagePathLargeName);

  // create folder if not exists
  if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath);
  }
  if (!fs.existsSync(imagePathSmall)) {
    fs.mkdirSync(imagePathSmall);
  }
  if (!fs.existsSync(imagePathMedium)) {
    fs.mkdirSync(imagePathMedium);
  }
  if (!fs.existsSync(imagePathLarge)) {
    fs.mkdirSync(imagePathLarge);
  }

  // save image to disk
  image.mv(imagePath + imageName, async (err) => {
    if (err) {
      return serverError(res, err);
    }

    // resize image to three different sizes
    const imageSmall = await jimp.read(imagePath + imageName);
    const imageMedium = await jimp.read(imagePath + imageName);
    const imageLarge = await jimp.read(imagePath + imageName);

    imageSmall.resize(200, jimp.AUTO);
    imageMedium.resize(400, jimp.AUTO);
    imageLarge.resize(800, jimp.AUTO);

    imageSmall.write(imagePathSmallPath);
    imageMedium.write(imagePathMediumPath);
    imageLarge.write(imagePathLargePath);

    req.imageUrl = {
      small: imagePathSmallUrl,
      medium: imagePathMediumUrl,
      large: imagePathLargeUrl,
    };
    next();
  });
};
