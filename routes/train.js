var express = require('express');
const funcs = require("../funcs.js");
var router = express.Router();

router.get('/:setName', function(req, res, next){
   res.render(funcs.checkLog(req,'pages/train'), { title: 'Train',loggedIn: req.session.loggedIn});
});

module.exports = router;