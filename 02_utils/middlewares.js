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
      return clientError(res, "Please upload an image less than 5mb");
    }

    req.image = image;
    next();
  } else {
    return clientError(res, "Please upload an image");
  }
};

// check video format and pass video url through req.videoUrl
exports.checkVideo = async (req, res, next) => {
  const { video } = req.files;
  if (video) {
    req.video = video;
    if (!video.mimetype.startsWith("video")) {
      return clientError(res, "Please upload a valid video");
    }

    if (video.size > process.env.MAX_FILE_UPLOAD) {
      return clientError(res, "Please upload a video less than 10mb");
    }

    req.video = video;
    next();
  } else {
    return clientError(res, "Please upload a video");
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

  const imagePathSmallName = `${imageName}${extension}`;
  const imagePathMediumName = `${imageName}${extension}`;
  const imagePathLargeName = `${imageName}${extension}`;

  const imagePathLargeUrl = imagePathLargeName;

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

    req.imageUrl = imagePathLargeUrl;
    next();
  });
};

// upload video from req.video to video folder and send video url through req.videoUrl
exports.uploadVideo = async (req, res, next) => {
  const { video } = req;

  const fileName = video.name;
  const extension = path.extname(fileName);
  const md5 = video.md5;

  // resize image to three different sizes
  const videoName = `video${md5}${extension}`;
  const videoPath = path.join(__dirname, "../public/uploads/videos/");

  const videoPathName = `${videoName}`;
  const videoPathUrl = videoPathName;

  path.join(videoPath, videoPathName);

  // create folder if not exists
  if (!fs.existsSync(videoPath)) {
    fs.mkdirSync(videoPath);
  }

  // save video to disk
  video.mv(videoPath + videoName, async (err) => {
    if (err) {
      return serverError(res, err);
    }

    req.videoUrl = videoPathUrl;
    console.log(req.videoUrl);
    // next();
  });
};
