const express = require("express");
const { check } = require("express-validator");
const coursesControllers = require("../controllers/courses-controllers");
const router = express.Router();
const fileUpload = require("../middleware/file-upload");

router.get("/data/:cid", coursesControllers.getCourseById); // searchimg in all courses for a specific course

router.get("/user/:uid", coursesControllers.getCoursesByUserId); // asking for all courses which belong to  a specific user ===> use-case in our project : I want to see all courses which I have created or enrolled.
router.get("/all", coursesControllers.getAllCourses);
// router.post("/", fileUpload.single("file"), coursesControllers.createCourse);

/////// Let's only check if we can save the files
router.post("/upload", fileUpload.single("file"), coursesControllers.upload);
router.post("/words", coursesControllers.words);

/////// Let's check if we can save the files

// router.post(
//   "/",
//   fileUpload.single("image"),

//   [
//     check("word").not().isEmpty(),
//     // check("description").isLength({ min: 5 }),
//     // check("address").not().isEmpty(),
//   ],
//   coursesControllers.createCourse
// );

router.patch(
  "/:cid",
  [
    check("word").not().isEmpty(),
    // check("description").isLength({ min: 5 })
  ],
  coursesControllers.updateCourse
);

router.delete("/:cid", coursesControllers.deleteCourse);

module.exports = router;