const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");

const employeeRoutes = require("./routes/employeeRoutes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use("/employees", employeeRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Employee Service Running",
  });
});

module.exports = app;
