const fs = require("fs");
const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
// const getCoordsForAddress = require("../util/location");

const Course = require("../models/course");
const User = require("../models/user");

const getCourseById = async (req, res, next) => {
  const courseId = req.params.cid;

  let course;
  try {
    course = await Course.findById(courseId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a course.",
      500
    );
    return next(error);
  }

  if (!course) {
    const error = new HttpError(
      "Could not find a course for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ course: course.toObject({ getters: true }) });
};

const getCoursesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let pourses;
  let userWithCourses;
  try {
    userWithCourses = await User.findById(userId).populate("courses");
  } catch (err) {
    const error = new HttpError(
      "Fetching courses failed, please try again later",
      500
    );
    return next(error);
  }

  // if (!pourses || pourses.length === 0) {
  if (!userWithCourses || userWithCourses.courses.length === 0) {
    return next(
      new HttpError("Could not find courses for the provided user id.", 404)
    );
  }

  res.json({
    courses: userWithCourses.courses.map((course) =>
      course.toObject({ getters: true })
    ),
  });
};
const getAllCourses = async (req, res, next) => {};
const upload = async (req, res, next) => {
  res.status(200).json({ message: " course." });
};
const words = async (req, res, next) => {
  // res.status(201).json({ course: "hellooooo" });
  const { name, content } = req.body;

  const createdCourse = new Course({ name, content });
  try {
    await createdCourse.save();
  } catch (err) {
    const error = new HttpError(
      "Creating course failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ course: "okay" });
};
// const createCourse = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError("Invalid inputs passed, please check your data.", 422)
//     );
//   }

//   const { word, hour, minute, second, creator } = req.body;

//   const createdCourse = new Course({
//     word,
//     hour,
//     minute,
//     second,
//     // image:
//     //   "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
//     image: req.file.path,

//     creator,
//   });

//   let user;
//   try {
//     user = await User.findById(creator);
//   } catch (err) {
//     const error = new HttpError(
//       "Creating course failed, please try again",
//       500
//     );
//     return next(error);
//   }

//   if (!user) {
//     const error = new HttpError("Could not find user for provided id", 404);
//     return next(error);
//   }

//   try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     await createdCourse.save({ session: sess });
//     user.courses.push(createdCourse);
//     await user.save({ session: sess });
//     await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError(
//       "Creating course failed, please try again.",
//       500
//     );
//     return next(error);
//   }

//   res.status(201).json({ course: createdCourse });
// };

const updateCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { word, hour, minute, second } = req.body;
  const courseId = req.params.cid;

  let course;
  try {
    course = await Course.findById(courseId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update course.",
      500
    );
    return next(error);
  }

  course.word = word;
  course.hour = hour;
  course.minute = minute;
  course.second = second;

  try {
    await course.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update course.",
      500
    );
    return next(error);
  }

  res.status(200).json({ course: course.toObject({ getters: true }) });
};

const deleteCourse = async (req, res, next) => {
  const courseId = req.params.cid;

  let course;
  try {
    course = await Course.findById(courseId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete course.",
      500
    );
    return next(error);
  }

  if (!course) {
    const error = new HttpError("Could not find course for this id.", 404);
    return next(error);
  }
  const imagePath = course.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await course.remove({ session: sess });
    course.creator.courses.pull(course);
    await course.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete course.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted course." });
};
exports.getCourseById = getCourseById;
exports.getCoursesByUserId = getCoursesByUserId;
exports.getAllCourses = getAllCourses;
exports.words = words;
exports.updateCourse = updateCourse;
exports.deleteCourse = deleteCourse;
exports.upload = upload;
