const errorHandler = (err, req, res, next) => {
  console.error("Server Error:", err.stack);
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NDE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandler };
