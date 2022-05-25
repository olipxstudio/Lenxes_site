require("dotenv").config({ path: "./01_config/_config.env" });

const express = require("express");
const cors = require("cors");
const { clientError } = require("./02_utils/common");
const connectDB = require("./01_config/db");
const app = express();
const fileUpload = require("express-fileupload");
// make connection
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const port = process.env.SERVER_PORT || 4000;

// static files
const path = require("path");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "public/tmp"),
    createParentPath: true,
  })
);
app.use("/files", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/users/post", require("./routes/users/postApi"));
app.use("/api/users/patch", require("./routes/users/patchApi"));
app.use("/api/users/get", require("./routes/users/getApi"));

app.use("*", (req, res) => {
  clientError(res, "Page not found");
});

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
