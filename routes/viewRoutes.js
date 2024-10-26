const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();
router.get('/me', authController.protect, viewController.getAccount);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);
router.get('/my-tours', authController.protect, viewController.getMyTours);

//unprotected routes have isLoggedIn to prevene dublicate queries
router.use(authController.isLoggedIn);
router.get(
  '/',
  bookingController.createBookingChekout,
  viewController.getOverview
);
router.get('/login', viewController.getLogin);
router.get('/signup', viewController.getSignup);
router.get('/tour/:slug', viewController.getTour);

module.exports = router;
