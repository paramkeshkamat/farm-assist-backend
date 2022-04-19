/** @format */

require("dotenv").config();
const express = require("express");
const app = express();

const path = require("path");
const createError = require("http-errors");
const cors = require("cors");

// CONNECT TO DB
require("./config/db");

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/uploads")));
app.use(cors());

// ROUTES
app.get("/", (req, res) => res.send("Home Page"));
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/seller", require("./routes/seller"));
app.use("/api/products", require("./routes/product"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/razorpay", require("./routes/razorpay"));

// PAGE NOT FOUND
app.use((req, res, next) => next(createError.NotFound()));

// EXPRESS ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// LISTENING
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
