const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const myUserSchema = new Schema(
  {                                       //1st arg is a structure object
    fullName: {type: String},
    //SIGN UP/LOGIN users
    userName: {type: String},
    encryptedPassword: {type: String},

    //GOOGLE users-----------------
   googleId: {type: String},

   //FACEBOOK users----------------
   facebookId: {type: String}
  },
  {   //2nd arg is additional settings (optional)
    timestamps: true
    //timestamps creates 2 additional fields: 'createdAt' & 'updatedAt'
  }
);

const UserModel = mongoose.model('User', myUserSchema);

module.exports = UserModel;
