var express = require('express');
var router = express.Router();
var funcs = require('../funcs.js')

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render(funcs.checkLog(req,'pages/index'), { title: 'Home',loggedIn: req.session.loggedIn, footerText: funcs.getFooterText()});
});

router.get('/logout', function (req,res,next){
  req.session.loggedIn = false;

  req.session.username = '';
  //sets is a stringified version of the sets object
  req.session.sets = '';
  //chosenSet is the object itself in json version
  req.session.chosenSet = '';
  res.redirect('/');
});

/*
 * Home page, redirects to login if not logged in
 * Login powered by express user
 * routes are dynamic to a user
 * mongodb - by atlas, cluster based storage
 *
 * user data:
 *  username
 *  password
 *  practice sets (json)
 *  email
 *  userscores (json)
 *
 *
 */

module.exports = router;
