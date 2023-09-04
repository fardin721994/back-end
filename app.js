// const fs = require("fs");
// const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const coursesRoutes = require("./routes/courses-routes");
const wordsRoutes = require("./routes/words-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());
// app.use("/api/courses-data", express.static("courses-data"));
app.use("/api/images", express.static("images"));
// app.use("/api/", express.static("/"));

// app.use("/api/audios", express.static("audios"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});
app.use("/api/playlist", express.static("playlist"));

app.use("/api/courses", coursesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/words", wordsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// mongoose
//   .connect(
//     `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kzyi0we.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
//   )
mongoose
  .connect("mongodb://localhost:27017/funguage")
  .then(() => {
    // app.listen(process.env.PORT || 5000);
    // app.listen(5000);
    // console.log("connected to port 5000");
    app.listen(5000, "localhost", () => console.log("connected to port 5000"));
  })
  .catch((err) => {
    console.log(err);
  });
