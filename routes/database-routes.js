const express = require("express");
const { check } = require("express-validator");
const databaseControllers = require("../controllers/database-controllers");
const router = express.Router();

router.get("/", databaseControllers.getDatabase);

router.post(
  "/",

  [
    check("word").not().isEmpty(),
    check("definition").not().isEmpty(),

    // check("description").isLength({ min: 5 }),
  ],
  databaseControllers.createData
);

router.patch(
  "/:did",
  [
    check("word").not().isEmpty(),
    check("meaning").not().isEmpty(),
    // check("description").isLength({ min: 5 })
  ],
  databaseControllers.updateData
);

router.delete("/:did", databaseControllers.deleteData);

module.exports = router;
