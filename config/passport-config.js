// We are configuring Passport in a separate file
// to avoid  making a mess in app.js
const passport      = require('passport');
const bcrypt        = require('bcrypt');
const UserModel     = require('../models/user-model.js');

//serializeUser (constrols what goes inside the 'bowl')
// -saves user's database ID to the 'bowl'
//-happens ONLY when you log in
passport.serializeUser((userFromDb, next) => {
  next(null, userFromDb._id);
  //   null meaans there was NO ERROR, proceed to the next argument which is userfromDb_.id
});
//deserializeUser (constrols what you get when you check the 'bowl')
//-uses the ID in the bowl to retrieve user's information
//-happens everytime you visit any page on the site after loggin in
passport.deserializeUser((idFromBowl, next) => {
   UserModel.findById(
     idFromBowl,
     (err, userFromDb) => {
       if (err) {
         next(err);
         return;
       }
       next(null, userFromDb);
     }
   );
});

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

// FACEBOOK login strategy
const FbStrategy = require('passport-facebook').Strategy;
passport.use(new FbStrategy(
     {
       clientID:     process.env.facebookClientID,
       clientSecret: process.env.facebookClientSecret,
       callbackURL:  '/auth/facebook/callback' //whatever URL you want
     },
     (accessToken, refreshToken, profile, next) => {
       console.log("FACEBOOK PROFILE INFO");
       console.log(profile);
        UserModel.findOne(
          {facebookId: profile.id},
          (err, userFromDb) => {
            if (err) {
              next(err);
              return;
            }
            if(userFromDb) {          //if user found means he already logged in with facebook before
              next(null, userFromDb);
              return;
            }
            //if this is the first time users logs in with facebook -> SAVE them in out DB
            const theUser = new UserModel ({
              fullName: profile.displayName,
              facebookId: profile.id
            });
            theUser.save((err) => {
              if (err) {
                next(err);
                return;
              }
              next(null, theUser);
            });
          });
     }
));

//GOOGLE login strategy
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
passport.use(new GoogleStrategy(
     {
       clientID:     process.env.googleClientID,
       clientSecret: process.env.googleClientSecret,
       callbackURL:  '/auth/google/callback' //whatever URL you want
     },
     (accessToken, refreshToken, profile, next) => {
       console.log("GOOGLE PROFILE INFO");
       console.log(profile);
        UserModel.findOne(
          {googleId: profile.id},
          (err, userFromDb) => {
            if (err) {
              next(err);
              return;
            }
            if(userFromDb) {          //if user found means he already logged in with facebook before
              next(null, userFromDb);
              return;
            }
            //if this is the first time users logs in with facebook -> SAVE them in out DB
            const theUser = new UserModel ({
              fullName: profile.displayName,
              googleId: profile.id
            });

            if(theUser.fullName === undefined) {
             theUser.fullName = profile.emails[0].value;
          }

            theUser.save((err) => {
              if (err) {
                next(err);
                return;
              }
              next(null, theUser);
            });
          });
     }
));
