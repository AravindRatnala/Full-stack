const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const app = express();
const port = process.env.PORT || 5000;
const URI =
  "mongodb+srv://Aravind:Aravind@mongo@cluster0-zdpsw.mongodb.net/messages?retryWrites=true&w=majority";
app.use(cors());
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(bodyparser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected succesfully"))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`listening at port ${port}`));
