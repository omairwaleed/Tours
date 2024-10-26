const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

userRouter.post('/signup', authController.signUp);
userRouter.post('/login', authController.login);
userRouter.post('/logout', authController.logOut);

userRouter.use(authController.protect);
userRouter.patch('/updatePassword', authController.updatePassword);

userRouter.get(
  '/me',

  userController.getMe,
  userController.getUser
);
userRouter.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
userRouter.delete('/deleteMe', userController.deleteMe);
userRouter.use(authController.restrictTo('admin'));
userRouter.route('/').get(userController.getAllUsers);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deletsUser);
module.exports = userRouter;
