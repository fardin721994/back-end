const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
// const getCoordsForAddress = require("../util/location");

const Data = require("../models/data");

const getDatabase = async (req, res, next) => {
  let data;
  try {
    data = await Data.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a data.",
      500
    );
    return next(error);
  }

  if (!data) {
    const error = new HttpError(
      "Could not find a data for the provided id.",
      404
    );
    return next(error);
  }

  res.json(data);
};

// const getCoursesByUserId = async (req, res, next) => {
//   const userId = req.params.uid;

//   // let pourses;
//   let userWithCourses;
//   try {
//     userWithCourses = await User.findById(userId).populate("courses");
//   } catch (err) {
//     const error = new HttpError(
//       "Fetching courses failed, please try again later",
//       500
//     );
//     return next(error);
//   }

//   // if (!pourses || pourses.length === 0) {
//   if (!userWithCourses || userWithCourses.courses.length === 0) {
//     return next(
//       new HttpError("Could not find courses for the provided user id.", 404)
//     );
//   }

//   res.json({
//     courses: userWithCourses.courses.map((course) =>
//       course.toObject({ getters: true })
//     ),
//   });
// };

const createData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, word, wordClass, meaningNumber, definition } = req.body;

  const createdData = new Data({
    title,
    word,
    wordClass,
    meaningNumber,
    definition,
  });

  try {
    await createdData.save();
  } catch (err) {
    const error = new HttpError("Creating data failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ data: createdData });
};

const updateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { word, meaning } = req.body;
  const dataId = req.params.did;

  let data;
  try {
    data = await Data.findById(dataId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update data.",
      500
    );
    return next(error);
  }

  data.word = word;
  data.meaning = meaning;

  try {
    await data.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update data.",
      500
    );
    return next(error);
  }

  res.status(200).json({ data: data.toObject({ getters: true }) });
};

const deleteData = async (req, res, next) => {
  const dataId = req.params.did;

  let data;
  try {
    data = await Data.findById(dataId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete data.",
      500
    );
    return next(error);
  }

  if (!data) {
    const error = new HttpError("Could not find data for this id.", 404);
    return next(error);
  }

  try {
    await data.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete data.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted data." });
};
exports.getDatabase = getDatabase;
exports.createData = createData;
exports.updateData = updateData;
exports.deleteData = deleteData;
