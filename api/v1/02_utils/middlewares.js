const { serverError, clientError } = require("./common");
const User = require("../models/users/User");
const path = require("path");
const fs = require("fs");
const jimp = require("jimp");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

// Check if user already exists
exports.checkIfUserAlreadyExist = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return clientError(res, "Email already exists");
  }
  next();
};

const currentDateTime = async (req, res) => {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  // let minutes = date_ob.getMinutes();
  // let seconds = date_ob.getSeconds();
  let fullTime = "_" + year + month + date + hours;
  return fullTime;
};

// verify email
exports.verifyEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return clientError(res, "Email does not exist");
  }
  req.user = user;
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
    if (!image.mimetype.startsWith("image")) {
      return clientError(res, "Please upload a valid image");
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
    // req.video = video;
    if (!video.mimetype.startsWith("video")) {
      return clientError(res, "Please upload a valid video");
    }

    if (video.size > process.env.MAX_VIDEO_UPLOAD) {
      return clientError(res, "Please upload a video less than 10mb");
    }

    req.video = video;
    next();
  } else {
    return clientError(res, "Please upload a video");
  }
};

// create a middleware to upload pdf
exports.checkPdf = async (req, res, next) => {
    const { pdf } = req.files;
    if (pdf) {
      if (pdf.mimetype != "application/pdf") {
        return clientError(res, "Please upload a valid PDF File");
      }
      req.pdf = pdf;
      next();
    } else {
      return clientError(res, "Please upload a PDF File");
    }
};
 
// upload image from req.image with express-fileupload the send image url through req.imageUrl
exports.uploadPdf = async (req, res, next) => {
    const { pdf } = req;
    const saveto = req.params.saveto;
    
    const social = '../../../public/uploads/pdf_downloadables/';
    const stores = '../../../public/uploads/store/pdf_downloadables/';
    const site = '../../../public/uploads/professionals/pdf_downloadables/';
    
    let directPhoto;
    if(saveto=='social'){
      directPhoto = social;
    }else if(saveto=='store'){
      directPhoto = stores;
    }else if(saveto=='site'){
      directPhoto = site;
    }else{
      return clientError(res, "PDF Path not found");
    }
    // return res.json({pdf})
    const fileName = pdf.name;
    const extension = path.extname(fileName);
    const md5 = pdf.md5;
    const newLocal = await currentDateTime();
  
    const imageName = `pdf${md5}${newLocal}${extension}`;
    const imagePath = path.join(__dirname, directPhoto);
    const pdfPathName = `${imageName}`;

    // save pdf to disk
    pdf.mv(imagePath + imageName, async (err) => {
      if (err) {
        return serverError(res, err);
      }
      req.pdfUrl = pdfPathName;
      next();
    });
};
  
// upload image from req.image with express-fileupload the send image url through req.imageUrl
exports.uploadImage = async (req, res, next) => {
  const { image } = req;
  const saveto = req.params.saveto;
  
  const social = '../../../public/uploads/';
  const stores = '../../../public/uploads/store/';
  const site = '../../../public/uploads/professionals/';
  
  let directPhoto;
  if(saveto=='social'){
    directPhoto = social;
  }else if(saveto=='store'){
    directPhoto = stores;
  }else if(saveto=='site'){
    directPhoto = site;
  }else{
    return clientError(res, "Image Path not found");
  }
  
  const fileName = image.name;
  const extension = path.extname(fileName);
  const md5 = image.md5;
  const newLocal = await currentDateTime();

  // resize image to three different sizes
  const imageName = `image${md5}${newLocal}`;
  const imagePath = path.join(__dirname, directPhoto);

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
    imageMedium.resize(600, jimp.AUTO);
    imageLarge.resize(1080, jimp.AUTO);

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
  const saveto = req.params.saveto;
  
  const social = '../../../public/uploads/videos/';
  const stores = '../../../public/uploads/store/videos/';
  const site = '../../../public/uploads/professionals/videos/';
  
  let directPhoto;
  if(saveto=='social'){
    directPhoto = social;
  }else if(saveto=='store'){
    directPhoto = stores;
  }else if(saveto=='site'){
    directPhoto = site;
  }else{
    return clientError(res, "Video Path not found");
  }
  
  const fileName = video.name;
  const extension = path.extname(fileName);
  const md5 = video.md5;
  const newLocal = await currentDateTime();

  const videoName = `video${md5}${newLocal}${extension}`;
  const videoPath = path.join(__dirname, directPhoto);

  const videoPathName = `${videoName}`;

  // create folder if not exists
  if (!fs.existsSync(videoPath)) {
    fs.mkdirSync(videoPath);
  }

  // save video to disk
  video.mv(videoPath + videoName, async (err) => {
    if (err) {
      return serverError(res, err);
    }

    req.videoUrl = videoPathName;
    next();
  });
};

// get video thumbnail and save it to disk
exports.getVideoThumbnail = async (req, res, next) => {
  const { videoUrl } = req;
  const saveto = req.params.saveto;
  
  const social = '../../../public/uploads/videos/';
  const stores = '../../../public/uploads/store/videos/';
  const site = '../../../public/uploads/professionals/videos/';
  
  const socialThumb = '../../../public/uploads/thumbs/';
  const storesThumb = '../../../public/uploads/store/thumbs/';
  const siteThumb = '../../../public/uploads/professionals/thumbs/';
  
  let directPhoto;
  let directThumb;
  if(saveto=='social'){
    directPhoto = social;
    directThumb = socialThumb;
  }else if(saveto=='store'){
    directPhoto = stores;
    directThumb = storesThumb;
  }else if(saveto=='site'){
    directPhoto = site;
    directThumb = siteThumb;
  }else{
    return clientError(res, "Video Path not found");
  }
  
  try {
    const videoPath = path.join(__dirname, directPhoto);
    const videoName = videoUrl.split("/")[videoUrl.split("/").length - 1];
    const videoPathName = `${videoName}`;
    const videoPathUrl = videoPathName;

    const video = ffmpeg(videoPath + videoPathName);
    // return res.json({video});
    const image = video.takeScreenshots({
      count: 1,
      timemarks: ["0"],
      filename: "thumbnail-%s.png",
      // size: "320x240",
    });

    image.on("end", async () => {
      const imagePath = path.join(
        __dirname,
        directThumb
      );
      const imageName = `thumbnail-${videoName}`;
      const imagePathName = `${imageName}`;
      const imagePathUrl = imagePathName;

      const image = await jimp.read(imagePath + imagePathName);
      image.resize(200, jimp.AUTO);
      image.write(imagePath + imagePathName);

      req.videoThumbnail = imagePathUrl;
      next();
    });
  } catch (err) {
    console.log(err);
    return serverError(res, err);
  }
}; // end of getVideoThumbnail

// check if username or email is in req.body.email
exports.checkIfIsUser = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      $and: [{ $or: [{ email: email }, { username: email }] }],
    });

    if (!user)
      return clientError(
        res,
        (message = "Incorrect email address or username")
      );
    req.user = user;
    next();
  } catch (error) {
    return clientError(res, error);
  }
};

// check if username is taken
exports.checkIfUsernameIsTaken = async (req, res, next) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user) return clientError(res, "This Username is taken!");
    next();
  } catch (error) {
    return clientError(res, error);
  }
};

// check if user password is correct
exports.checkIfPasswordIsCorrect = async (req, res, next) => {
  const { password } = req.body;
  const { _id } = req.user;
  const user = await User.findById(_id);
  try {
    const isPasswordCorrect = await User.comparePassword(
      password, // password from user
      user.password // user password
    );
    if (!isPasswordCorrect)
      return clientError(res, "Incorrect password, please try again");
    next();
  } catch (error) {
    return clientError(res, error);
  }
};
