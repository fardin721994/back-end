const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Word = require("../models/word");

const getAllWords = async (req, res, next) => {
  let data;
  try {
    data = await Word.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not return the words.",
      500
    );
    return next(error);
  }

  if (!data) {
    const error = new HttpError("There's not any word to return.", 404);
    return next(error);
  }

  res.json(data);
};

const getWordById = async (req, res, next) => {
  const wordId = req.params.wid;

  let word;

  try {
    word = await Word.findById(wordId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not return the word.",
      500
    );
    return next(error);
  }

  if (!word) {
    const error = new HttpError("There's not any word to return.", 404);
    return next(error);
  }

  res.json(word);
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

const createWord = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your word.", 422)
    );
  }

  const {
    word,
    pronunciation,
    frequency,
    partOfSpeech,
    register,
    meanings,
    additionalInfo,
    translation,
  } = req.body;

  const createdWord = new Word({
    word,
    pronunciation,
    frequency,
    partOfSpeech,
    register,
    meanings,
    additionalInfo,
    translation,
  });

  try {
    await createdWord.save();
  } catch (err) {
    const error = new HttpError("Creating word failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ word: createdWord });
};

const updateWord = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your word.", 422)
    );
  }

  const {
    word,
    pronunciation,
    frequency,
    partOfSpeech,
    register,
    meanings,
    additionalInfo,
    translation,
  } = req.body;
  const wordId = req.params.wid;

  let oldWord;
  try {
    oldWord = await Word.findById(wordId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update word.",
      500
    );
    return next(error);
  }

  oldWord.word = word;
  oldWord.pronunciation = pronunciation;
  oldWord.frequency = frequency;
  oldWord.partOfSpeech = partOfSpeech;
  oldWord.register = register;
  oldWord.meanings = meanings;
  oldWord.additionalInfo = additionalInfo;
  oldWord.translation = translation;

  const updatedWord = { ...oldWord };

  try {
    await updatedWord.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update word.",
      500
    );
    return next(error);
  }

  res.status(200).json({ word: updatedWord.toObject({ getters: true }) });
};

const deleteWord = async (req, res, next) => {
  const wordId = req.params.wid;

  let word;
  try {
    word = await Word.findById(wordId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete word.",
      500
    );
    return next(error);
  }

  if (!word) {
    const error = new HttpError("Could not find word for this id.", 404);
    return next(error);
  }

  try {
    await word.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete word.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted word." });
};
exports.getAllWords = getAllWords;
exports.getWordById = getWordById;
exports.createWord = createWord;
exports.updateWord = updateWord;
exports.deleteWord = deleteWord;
