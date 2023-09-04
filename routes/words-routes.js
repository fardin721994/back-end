const express = require("express");
const { check } = require("express-validator");
const wordsControllers = require("../controllers/words-controllers");
const router = express.Router();

router.get("/", wordsControllers.getAllWords);
router.get(
  "/:wid",
  [
    check("word").not().isEmpty(),
    // check("meaning").not().isEmpty(),
    // check("description").isLength({ min: 5 })
  ],
  wordsControllers.getWordById
);
router.post(
  "/",

  [
    check("word").not().isEmpty(),
    // check("definition").not().isEmpty(),
    // check("description").isLength({ min: 5 }),
  ],
  wordsControllers.createWord
);

router.patch(
  "/:wid",
  [
    check("word").not().isEmpty(),
    check("meaning").not().isEmpty(),
    // check("description").isLength({ min: 5 })
  ],
  wordsControllers.updateWord
);

router.delete("/:wid", wordsControllers.deleteWord);

module.exports = router;
