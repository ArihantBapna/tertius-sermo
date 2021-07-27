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
        res.redirect('/');
    }else{
        res.render(funcs.checkLog(req,'pages/editSets'), {title: 'Edit Sets', loggedIn: req.session.loggedIn, chosenSet: set});
    }
});

router.get('/create', function(req,res,next){
   res.render(funcs.checkLog(req,'pages/createSet'), {title: 'Create Sets', loggedIn: req.session.loggedIn});
});

router.post('/create', async function (req, res, next) {
    var createSet = req.body;
    var allSets = JSON.parse(req.session.sets);
    createSet.id = allSets.length + 1;
    allSets.push(createSet);

    var count = 1;
    allSets.forEach(p => {
        p.id = count;
        count++;
    });

    var query = {'username': req.session.username};
    var result = await userModel.update(query, {sets: JSON.stringify(allSets)});

    req.session.sets = JSON.stringify(allSets);
    res.send(result);

});

router.post('/save', async function (req, res, next) {
    var saveSet = req.body;
    var allSets = JSON.parse(req.session.sets);

    var saveIndex = allSets.findIndex(i => i.id === saveSet.id);
    allSets[saveIndex] = saveSet;

    var count = 1;
    allSets.forEach(p => {
        p.id = count;
        count++;
    });

    var query = {'username': req.session.username};
    var result = await userModel.update(query, {sets: JSON.stringify(allSets)});

    //Set the session sets to allSets
    req.session.sets = JSON.stringify(allSets);

    res.send(result);

});

router.post('/delete', async function(req, res, next){
    var dat = req.body;
    var allSets= JSON.parse(req.session.sets);

    allSets = allSets.filter(function(v, i, arr){
        return v.id !== dat.id;
    })

    var count = 1;
    allSets.forEach(p => {
        p.id = count;
        count++;
    });

    var query = {'username': req.session.username};
    var result = await userModel.update(query, {sets: JSON.stringify(allSets)});

    //Set the session sets to allSets
    req.session.sets = JSON.stringify(allSets);

    res.send(result);
});

module.exports = router;