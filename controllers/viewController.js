const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utilis/appError');
const catchAsync = require('../utilis/catchAsync');
exports.getOverview = catchAsync(async (req, res) => {
  /*
  1-)get tour data
  2-)build template 
  3-)render template
  */
  const tours = await Tour.find();
  res.setHeader(
    'Content-Security-Policy',
    " script-src-elem 'self' https://js.stripe.com/v3/ ;"
  );
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('No Tour for this name', 404));
  }
  res.setHeader(
    'Content-Security-Policy',
    " script-src-elem 'self' https://js.stripe.com/v3/ ;"
  );
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
exports.getLogin = catchAsync(async (req, res) => {
  res.setHeader(
    'Content-Security-Policy',
    " script-src-elem 'self' https://cdn.jsdelivr.net https://js.stripe.com/v3/ ;"
  );
  res.status(200).render('login', {
    title: 'Login',
  });
});
exports.getSignup = catchAsync(async (req, res) => {
  res.setHeader(
    'Content-Security-Policy',
    " script-src-elem 'self' https://cdn.jsdelivr.net https://js.stripe.com/v3/ ;"
  );
  res.status(200).render('signup', {
    title: 'SignUp',
  });
});
exports.getAccount = catchAsync(async (req, res) => {
  res.setHeader(
    'Content-Security-Policy',
    " script-src-elem 'self' https://js.stripe.com/v3/ ;"
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: req.user,
  });
});
exports.updateUserData = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: user,
  });
});
exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'my Tours',
    tours,
  });
});
