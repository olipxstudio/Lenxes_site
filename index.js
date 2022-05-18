require("dotenv").config({ path: "./config/_config.env" });

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const port = process.env.SERVER_PORT || 4000;

app.use("/api/users/post", require("./routes/users/postApi"));
app.use("/api/users/get", require("./routes/users/getApi"));

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
