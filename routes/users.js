var express = require('express');
var router = express.Router();

var userModel = require('../models/users');

/* POST users to check if they exist. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/log',async function (req, res, next) {
  var user = await userModel.findOne({email: req.body.email, password: req.body.md5password});
  if(user){
    req.session.loggedIn = true;
    req.session.username = user.username;
  }
  res.redirect('/');
});

module.exports = router;