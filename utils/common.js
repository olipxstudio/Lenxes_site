const serverError = (res, error) => {
  return res.status(500).json({
    success: false,
    err: `${process.env.NODE_ENV === "development" ? error : "Server Error"}`,
    error,
  });
};

// client error message
const clientError = (res, err) => {
  return res.status(208).json({
    success: false,
    message: err,
  });
};

//   export default serverError;
module.exports = {
  serverError,
  clientError,
};
