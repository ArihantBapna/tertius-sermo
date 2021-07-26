var express = require('express');
var router = express.Router();
var funcs = require('../funcs.js')

router.get('/', function(req, res, next) {
    res.render(funcs.checkLog(req,'pages/sets'), { title: 'Sets',loggedIn: req.session.loggedIn, sets: funcs.returnSets(req)});
});

router.get('/edit/:setName', function(req,res,next){

    var set = funcs.getSelectedSet(req);
    if(set === '404'){
        res.render('pages/error',{title: 'Error', loggedIn: req.session.loggedIn, message: 'Could not find the set or you\'re not logged in', error: {status: 404, stack: ''}});
    }else{
        res.render(funcs.checkLog(req,'pages/editSets'), {title: 'Edit Sets', loggedIn: req.session.loggedIn, chosenSet: set});
    }

});

module.exports = router;