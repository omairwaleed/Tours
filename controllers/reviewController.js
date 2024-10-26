const Review = require('../models/reviewModel');
const catchAsync = require('../utilis/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReveiw = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
