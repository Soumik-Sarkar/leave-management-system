const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");

const leaveRoutes = require("./routes/leaveRoutes");

const errorHandler = require("./middlewares/errorHandler");

const AppError = require("./utils/AppError");

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use("/leaves", leaveRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Leave Service Running",
  });
});

module.exports = app;
