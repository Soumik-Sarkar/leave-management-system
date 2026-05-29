const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "JsonWebTokenError") {
    err.message = "Invalid token";

    err.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    err.message = "Token expired";

    err.statusCode = 401;
  }

  err.statusCode = err.statusCode || 500;

  err.status = err.status || "error";

  res.status(err.statusCode).json({
    success: false,

    status: err.status,

    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
