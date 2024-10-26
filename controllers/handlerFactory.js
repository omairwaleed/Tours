const APIFeatures = require('../utilis/apiFeatures');
const AppError = require('../utilis/appError');
const catchAsync = require('../utilis/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document for this ID', 404));
    }
    res.status(200).json({ status: 'success' });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('this route not for updating password', 400));
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document for this ID', 404));
    }
    res.status(200).json({ status: 'success', data: { doc } });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    // const newTour = new Tour({})
    // newTour.save()
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query.populate(popOptions);
    }
    const doc = await query;
    if (!doc) {
      return next(new AppError('No Document for this ID', 404));
    }
    res.status(200).json({ status: 'success', data: doc });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    // to allow for nested GET reviews on tour
    let filter = {};
    if (req.params.id) filter = { tour: req.params.id };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .pagination();
    // const doc = await features.query.explain();
    const doc = await features.query;
    res.status(200).json({ status: 'success', results: doc.length, data: doc });
  });
