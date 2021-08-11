var express = require('express');
var router = express.Router();

var userModel = require('../models/users');
var funcs = require("../funcs");
var mongoose = require("mongoose");


router.get('/register',  function(req,res,next){
  res.render('pages/register', {title: 'Register', loggedIn: req.session.loggedIn, footerText: funcs.getFooterText()})
});

router.post('/save', async function(req, res, next){
  var id = await userModel.countDocuments({});
  var user = {
    _id: mongoose.Types.ObjectId(),
    username: funcs.generateTextId(9),
    id: (id+1),
    password: req.body.md5password,
    email: req.body.email,
    sets: '[]',
    scores: '[]'
  }
  var accessToken = req.body.token;
  if(accessToken === process.env.ACCESS_TOKEN){
    var result = await userModel.create(user);
    res.redirect('/');
  }
})

/* POST users to check if they exist. */
router.post('/log',async function (req, res, next) {
  var user = await userModel.findOne({email: req.body.email, password: req.body.md5password});
  if(user){
    req.session.loggedIn = true;
    req.session.username = user.username;
    req.session.sets = user.sets;
    req.session.scores = user.scores;
  }
  res.redirect('/');
});

module.exports = router;
