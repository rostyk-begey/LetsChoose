class AppError extends Error {
  constructor(message, statusCode, data = {}) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleError = (err, res) => {
  err.statusCode = err.statusCode || 500;
  let response = {
    status: err.statusCode,
    message: err.status || 'error',
  };
  if (err.data !== {}) {
    response = {
      ...response,
      ...err.data,
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(response);
  }

  res.status(err.statusCode).json(response);
};

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

module.exports = {
  AppError,
  handleError,
  catchAsync,
};
