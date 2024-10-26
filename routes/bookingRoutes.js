const { get } = require('mongoose');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.get(
  '/Checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
