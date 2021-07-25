var express = require('express');
var router = express.Router();
var funcs = require('../funcs.js')

router.get('/', function(req, res, next) {
    res.render(funcs.checkLog(req,'pages/sets'), { title: 'Sets',loggedIn: req.session.loggedIn, sets: funcs.returnSets(req)});
});

module.exports = router;