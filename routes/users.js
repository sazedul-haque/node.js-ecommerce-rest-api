const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const isAuth = require('../middleware/is-auth');

const UserController = require('../controllers/user');
const User = require('../models/user');

/* GET users listing. */
router.get('/users', isAuth, UserController.getUsers);

router.post('/register', [
  check('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail().custom((value, { req }) => {
    return User.findOne({ email: value })
      .then(userDoc => {
        if(userDoc) {
          return Promise.reject('Email address already exist!');
        }
      })
  }),
  check('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 catacter'),
  check('name').trim(),
  check('phone').isNumeric().withMessage('Please provide a valid phone number'),
  check('address').trim()
], UserController.registerUser);

router.post('/login', [
  check('email').isEmail().withMessage('Please provide a valid email address.')
], UserController.loginUser);

router.delete('/users/:userId', isAuth, UserController.deleteUser);

module.exports = router;