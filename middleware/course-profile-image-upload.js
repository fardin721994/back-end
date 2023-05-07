const fs = require("fs");
const path = require("path");
const multer = require("multer");
const uuid = require("uuid/v1");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "video/mp4": "mp4",
};

const courseProfileImageUpload = multer({
  // limits: 500000,
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const { courseName } = req.body;
      fs.mkdir(
        path.join(__dirname, "..", "courses-data", `${courseName}`, "profile"),
        { recursive: true },
        (err) => {
          if (err) {
            return console.error(err);
          } else {
            console.log("Directory created successfully!");
            cb(null, `courses-data/${courseName}/profile`);
          }
        }
      );
    },
    filename: (req, file, cb) => {
      // const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, file.originalname);
    },
    // filename: (req, file, cb) => {
    //   const ext = MIME_TYPE_MAP[file.mimetype];
    //   cb(null, uuid() + "." + ext);
    // },
  }),
  // fileFilter: (req, file, cb) => {
  //   const isValid = !!MIME_TYPE_MAP[file.mimetype];
  //   let error = isValid ? null : new Error("Invalid mime type!");
  //   cb(error, isValid);
  // },
});

module.exports = courseProfileImageUpload;
