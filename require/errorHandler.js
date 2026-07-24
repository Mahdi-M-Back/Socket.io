import logger from "./logger.js";

export default function errorHandler(err, req, res, next) {
  logger.error({ err }, "Request error");
  if (res.headersSent) {
    return next(err);
  }

  if (err.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "User already exists.",
    });
  }

  const isOperational = err.isOperational === true;

  res.status(err.statusCode || 500).json({
    success: false,
    message: isOperational ? err.message : "Internal Server Error",
  });
}
