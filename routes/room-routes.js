const express = require('express');
const router = express.Router();
const RoomModel = require('../models/room-model.js');
const multer = require('multer');

const myUploader = multer({
  //file upload destination folder
  dest: __dirname + '/../public/uploads/'
});

router.get('/rooms/new', (req, res, next) => {
  res.render('room-views/new-room-view.ejs');
});

router.post(
  '/rooms/new',
  // Use multer to process a single file upload
  myUploader.single('roomPhoto'), //input name = "roomPhoto"
  (req, res, next) => {
    const ghosts  = [true, false];
    const theRoom = new RoomModel({
      name:        req.body.roomName,
      description: req.body.roomDesc,
      //multer will create  req.file that contains information about the uploaded picture
      photoURL:    '/uploads/' + req.file.filename,
      hasGhosts:   ghosts[Math.floor(Math.random() * 2)],
      owner:       req.user._id
    });
      theRoom.save((err) => {
        if (err) {
          next(err);
          return;
        }
        res.redirect('/my-rooms');
      });
});

router.get('/my-rooms', (req, res, next) => {
  if(req.user) {
    RoomModel.find(
      {owner: req.user._id},
      (err, roomList) => {
        if(err) {
          next(err);
          return;
        }
        console.log(roomList);
        res.locals.roomList = roomList;
        res.render('room-views/room-list-view.ejs');
  });
}
  else {
    res.redirect('/login');
  }
});


module.exports = router;
