const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index.ejs');
});

router.get('/special', (req, res, next) => {
  if(req.user) {
      res.render('special.ejs');
  }
  else {
    res.redirect('/login');
  }
});

router.get('/rooms/new', (req, res, next) => {
  if(req.user) {
      res.render('room-views/new-room-view.ejs');
  }
  else {
    res.redirect('/login');
  }
});

module.exports = router;
