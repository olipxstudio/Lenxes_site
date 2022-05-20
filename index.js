require("dotenv").config({ path: "./01_config/_config.env" });

const express = require("express");
const cors = require("cors");
const { clientError } = require("./02_utils/common");
const mongoose = require('mongoose')
const connectDB = require('./01_config/db')
const app = express();

// make connection
connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const port = process.env.SERVER_PORT || 4000;

app.use("/api/users/post", require("./routes/users/postApi"));
// app.use("/api/users/get", require("./routes/users/getApi"));

app.use("*", (req, res) => {
  clientError(res, "Page not found");
});

mongoose.connection.once('open', () => {
    console.log('MongoDB Connected')
    app.listen(port, () => {
        console.log(`Server running on port http://localhost:${port}`);
    });
})
