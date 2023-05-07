const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const coursesRoutes = require("./routes/courses-routes");
const databaseRoutes = require("./routes/database-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());
// app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/api/courses-data", express.static("courses-data"));
// app.use("/api/images", express.static(path.join("images", "")));
app.use("/api/images", express.static("images"));
app.use("/api/audios", express.static("audios"));

// app.use("/uploads/images", express.static(path.join("uploads", "media")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/courses", coursesRoutes);
// app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/database", databaseRoutes);

///////// video streaming
// Attention : this damn "/api" in the urls is important.
app.get("/api/subtitle/:coursename/:sectionnumber", function (req, res) {
  const courseName = req.params.coursename;
  const sectionNumber = req.params.sectionnumber;
  res.sendFile(
    __dirname +
      `/courses-data/${courseName}/section${sectionNumber}/${courseName}${sectionNumber}.vtt`
  );
  // res.sendFile(__dirname + `/images/gotta.png`);
});
app.get("/api/video/:coursename/:sectionnumber", function (req, res) {
  // Ensure there is a range given for the video
  const courseName = req.params.coursename;
  const sectionNumber = req.params.sectionnumber;
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  // get video stats (about 61MB)
  const videoPath = `./courses-data/${courseName}/section${sectionNumber}/${courseName}${sectionNumber}.mp4`;

  // const videoPath = "./courses-data/friends/section1/friends1.mp4";
  const videoSize = fs.statSync(videoPath).size;
  // const videoPath = "friends1.mp4";
  // const videoSize = fs.statSync("friends1.mp4").size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
});
//////////////////////

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kzyi0we.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    // app.listen(process.env.PORT || 5000);
    app.listen(5000);

    console.log("connected to port 5000");
  })
  .catch((err) => {
    console.log(err);
  });
