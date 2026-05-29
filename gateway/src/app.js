const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");

const employeeRoutes = require("./routes/employeeRoutes");

const leaveRoutes = require("./routes/leaveRoutes");

const app = express();

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

// app.use(express.json());

app.use("/auth", authRoutes);

app.use("/employees", employeeRoutes);

app.use("/leaves", leaveRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Gateway Running",
  });
});

module.exports = app;
