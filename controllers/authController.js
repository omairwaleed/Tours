const User = require('../models/userModel');
const { promisify } = require('util');
const catchAsync = require('../utilis/catchAsync');
const jwt = require('jsonwebtoken');
const appError = require('../utilis/appError');
const AppError = require('../utilis/appError');
const Email = require('../utilis/email');
const signToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSentToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.cookie('JWT', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  });
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  // await new Email(
  //   newUser,
  //   `${req.protocol}://${req.get('host')}/me`
  // ).sendWelcome();
  createSentToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  // 1- check if email and password exist
  // 2- user exist  password is correct
  // 3- if everything is ok , sned

  const { email } = req.body;
  const { password } = req.body;
  if (!email || !password) {
    return next(new appError('please provide email and passord', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.correctPaasword(password, user.password)) {
    return next(new appError('Incorrect email or passord', 400));
  }

  createSentToken(user, 201, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  // 1- get token and check if it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.JWT) {
    token = req.cookies.JWT;
  }
  if (!token) {
    return next(
      new AppError("You aren't logged in! Please log in to get access ", 401)
    );
  }
  // 2- validate token

  const data = jwt.verify(token, process.env.JWT_SECRET);

  // 3- check if user exist
  const freshUser = await User.findById(data.id);
  if (!freshUser)
    return next(new AppError('User belong to token is deleted', 401));
  // 4- check if user changed password after jwt is issued
  if (freshUser.changedPasswordAfter(data.iat))
    return next(new AppError('User changed password , please log in', 401));
  //
  req.user = freshUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to do this action", 403)
      );
    }
    next();
  };
};
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1-)get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // 2-)check if posted password is correctPaasword
  if (!user.correctPaasword(req.body.passwordCurrent, user.password))
    return next(new AppError('Your current password is wrong', 401));
  // 3-)if so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4-)log user in and send jwt
  createSentToken(user, 200, res);
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // 1- get token and check if it exist
  if (req.cookies.JWT && req.cookies.JWT !== 'logged out') {
    const data = jwt.verify(req.cookies.JWT, process.env.JWT_SECRET);

    // 3- check if user exist
    const freshUser = await User.findById(data.id);
    if (!freshUser) return next();
    // 4- check if user changed password after jwt is issued
    if (freshUser.changedPasswordAfter(data.iat)) return next();
    //there is a logged in user
    res.locals.user = freshUser;
    return next();
  }
  next();
});
exports.logOut = catchAsync((req, res) => {
  res.cookie('JWT', 'logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
});
