const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myRoomSchema = new Schema (
  {
    name: {type: String},
    description: {type: String},
    photoURL: {type: String},
    hasGhosts: {type: Boolean, default: false},
    //the id of the user who owns the room
    owner: {type: Schema.Types.ObjectId}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Room', myRoomSchema);
