const express = require('express');

const UserModel = require('../models/user-model');

const router = express.Router();

const bcrypt = require('bcrypt');

const passport = require('passport');


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
//----------------END OF SIGNUP--------------------------------

//-----------LOCAL LOG IN----------------
router.get('/login', (req, res, next) => {
  if (req.user) {
    res.redirect('/');
  }
  res.render('auth-views/login-view.ejs');
});
router.post('/login', passport.authenticate(//receives 2 args
  'local',                                  //1st arg is name of the strategy
  {                                         //2nd arg is settings object
    successRedirect: '/',                   //where to go if login SUCCESS
    failureRedirect: '/login'               //where to go if login FAILED
  }
));
//---------------END LOGIN-----------------
//Local Logout
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

//SOCIAL LOGINS
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate(
  'facebook',
   {
     successRedirect: '/special',
     failureRedirect: '/login'
   }
));

router.get('/auth/google', passport.authenticate(
  'google',
  {
    scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
  }
));
router.get('/auth/google/callback', passport.authenticate(
  'google',
   {
     successRedirect: '/special',
     failureRedirect: '/login'
   }
));

module.exports = router;
