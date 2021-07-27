var express = require('express');
var router = express.Router();

var funcs = require('../funcs.js')

var userModel = require('../models/users');

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

router.post('/save', async function (req, res, next) {
    var saveSet = req.body;
    var allSets = JSON.parse(req.session.sets);

    var saveIndex = allSets.findIndex(i => i.id === saveSet.id);
    allSets[saveIndex] = saveSet;

    var query = {'username': req.session.username};
    var result = await userModel.update(query, {sets: JSON.stringify(allSets)});

    //Set the session sets to allSets
    req.session.sets = JSON.stringify(allSets);

    res.send(result);

});

module.exports = router;