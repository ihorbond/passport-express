// We are configuring Passport in a separate file
// to avoid  making a mess in app.js
const passport = require('passport');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user-model.js');
// SETUP of local strategy
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  {                   //1st argument -> settings object
     usernameField: 'loginUsername',
     passwordField: 'loginPassword'
  },
  (formUsername, formPassword, next) => {   //2nd argument - callback
                                          //(will be called when user tries to log in)
//#1 is there such username in the database?
    UserModel.findOne(
      {userName: formUsername},
      (err, userFromDb) => {
        if (err) {
          next(err);
          return;
        }
        if (!userFromDb) {
        //in Passport, if you call next() with false means LOGIN FAILED
          next(null, false);
          return;
        }
        if (!bcrypt.compareSync(formPassword, userFromDb.encryptedPassword)) {
          //same thing: LOGIN FAILED
         next(null, false);
         return;
        }
        // LOGIN SUCCESS! 
        next(null, userFromDb);
      }
    );
  }
));
