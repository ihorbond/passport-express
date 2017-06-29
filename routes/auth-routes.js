const express = require('express');

const UserModel = require('../models/user-model');

const router = express.Router();

const bcrypt = require('bcrypt');

router.get('/signup', (req, res, next) => {
  res.render('auth-views/signup-view.ejs');
});

router.post('/signup', (req, res, next) => {
  if (req.body.userName === '' || req.body.password === '') {
    res.locals.messageForDumbUsers = 'Please provide both username and password';
    res.render('auth-views/signup-view.ejs');
    return;
  }
  UserModel.findOne({
      userName: req.body.userName
    },
    (err, userFromDb) => {
      if (userFromDb) {
        res.locals.messageForDumbUsers = 'Sorry that username is already taken bro';
        res.render('auth-views/signup-view.ejs');
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const scrambledPassword = bcrypt.hashSync(req.body.password, salt);
      const user = new UserModel({
        fullName: req.body.fullName,
        userName: req.body.userName,
        encryptedPassword: scrambledPassword
      });

      user.save((err) => {
        if (err) {
          next(err);
          return;
        }
        res.redirect('/');
      });
    }
  );
});



module.exports = router;
