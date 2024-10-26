const AppError = require('../utilis/appError');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    if (req.originalUrl.startsWith('/api')) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
      });
    } else {
      res
        .status(err.statusCode)
        .render('error', { title: 'something went wrong', msg: err.message });
    }
  } else {
    //wrong id
    if (err.name === 'CastError') {
      const message = `Invalid ${err.path} : ${err.value}`;
      err = new AppError(message, 400);
    }
    //duplicate key
    if (err.code == 11000) {
      const value = Object.keys(err.keyValue)[0];
      const message = `duplicate key ${value} please use another value`;
      err = new AppError(message, 400);
    }
    //validation  errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((el) => el.message);
      const message = errors.join(' , ');
      err = new AppError(message, 400);
    }
    if (err.name === 'JsonWebTokenError') {
      err = new AppError('invalid token please log in', 401);
    }
    if (err.name === 'TokenExpiredError') {
      err = new AppError('Token expired', 401);
    }
    if (req.originalUrl.startsWith('/api')) {
      if (err.isOperational) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
        //programming errors
      } else {
        // console.error(error);
        res.status(500).json({
          status: 'error',
          message: 'Something went wrong',
        });
      }
    } else {
      if (err.isOperational) {
        res
          .status(err.statusCode)
          .render('error', { title: 'something went wrong', msg: err.message });
        //programming errors
      } else {
        // console.error(error);
        res.status(err.statusCode).render('error', {
          title: 'something went wrong',
          msg: 'please try again later',
        });
      }
    }
  }
};
