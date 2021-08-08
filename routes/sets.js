var express = require('express');
var router = express.Router();

var funcs = require('../funcs.js')

var userModel = require('../models/users');
var answerModel = require('../models/answers');
var cluesModel = require('../models/clusterClues');
var allClues = require('../models/allClues');

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

    //Set Element with all probability
    var createSet = req.body;

    //Generate answer lines and clues (if answerLines are empty)
    if(createSet.answerLines.length == 0){
        createSet = await getAnswersFromSet(createSet);
    }else{
        createSet = await getCluesFromSet(createSet);
    }

    var allSets = JSON.parse(req.session.sets);
    createSet.id = allSets.length + 1;
    allSets.push(createSet);

    var total = parseFloat(createSet.cat14) + parseFloat(createSet.cat15) + parseFloat(createSet.cat16) + parseFloat(createSet.cat17) + parseFloat(createSet.cat18) + parseFloat(createSet.cat19) + parseFloat(createSet.cat20) + parseFloat(createSet.cat21) + parseFloat(createSet.cat22) + parseFloat(createSet.cat25) + parseFloat(createSet.cat26);

    if(total !== 1){
        res.send('close');
    }else{
        var count = 1;
        allSets.forEach(p => {
            p.id = count;
            count++;
        });

        var query = {'username': req.session.username};
        var result = await userModel.updateOne(query, {sets: JSON.stringify(allSets)});

        req.session.sets = JSON.stringify(allSets);
        res.send('success');
    }
});

router.post('/save', async function (req, res, next) {
    var saveSet = req.body;

    //Generate answer lines and clues (if answerLines are empty)
    if(saveSet.answerLines.length == 0){
        saveSet = await getAnswersFromSet(saveSet);
    }else{
        //Just grab clues from AllClues if we have answerLines to train
        saveSet = await getCluesFromSet(saveSet);
    }

    var allSets = JSON.parse(req.session.sets);

    var total = parseFloat(saveSet.cat14) + parseFloat(saveSet.cat15) + parseFloat(saveSet.cat16) + parseFloat(saveSet.cat17) + parseFloat(saveSet.cat18) + parseFloat(saveSet.cat19) + parseFloat(saveSet.cat20) + parseFloat(saveSet.cat21) + parseFloat(saveSet.cat22) + parseFloat(saveSet.cat25) + parseFloat(saveSet.cat26);
    if(total !== 1){
        res.send('close');
    }else{
        var saveIndex = allSets.findIndex(i => i.id === saveSet.id);
        allSets[saveIndex] = saveSet;

        var count = 1;
        allSets.forEach(p => {
            p.id = count;
            count++;
        });

        var query = {'username': req.session.username};
        var result = await userModel.updateOne(query, {sets: JSON.stringify(allSets)});

        //Set the session sets to allSets
        req.session.sets = JSON.stringify(allSets);

        res.send(result);
    }

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
    var result = await userModel.updateOne(query, {sets: JSON.stringify(allSets)});

    //Set the session sets to allSets
    req.session.sets = JSON.stringify(allSets);

    res.send(result);
});


async function getCluesFromSet(set){
    var answerLines = set.answerLines;
    set = getClues(set, answerLines, 2);
    return set;
}

async function getAnswersFromSet(set) {
    var answerLines = [];
    var tempAnswers;

    //Distribution conversion: 0.1 -> 2 answer lines, 0.55 -> 11 answer lines, 1 -> 20 answer lines.
    /*
     * Check if the category has a positive non zero probability, then pick the most common answer lines from those and add them to answerLines
     * NOTE: For the 100th time, .push in js doesn't push ALL the elements of the array into another one, it pushes it as one compressed element.
     * PAAIIN.
     */

    if (set.cat14 > 0) {
        tempAnswers = await answerModel.find({CATEGORY_ID: 14}).limit(Math.round(set.cat14) * 20).sort({FREQUENCY: -1});
        answerLines = answerLines.concat(tempAnswers);
        tempAnswers = [];
    }
    if (set.cat15 > 0) {
        tempAnswers = await answerModel.find({CATEGORY_ID: 15}).limit(Math.round(set.cat15) * 20).sort({FREQUENCY: -1});
        answerLines = answerLines.concat(tempAnswers);
        tempAnswers = [];
    }
    if (set.cat16 > 0) {
        tempAnswers = await answerModel.find({CATEGORY_ID: 16}).limit(Math.round(set.cat16) * 20).sort({FREQUENCY: -1});
        answerLines = answerLines.concat(tempAnswers);
        tempAnswers = [];
    }
    if (set.cat17 > 0) {
        tempAnswers = await answerModel.find({CATEGORY_ID: 17}).limit(Math.round(set.cat17) * 20).sort({FREQUENCY: -1});
        answerLines = answerLines.concat(tempAnswers);
        tempAnswers = [];
    }
    if (set.cat18 > 0) {
        tempAnswers = await answerModel.find({CATEGORY_ID: 18}).limit(Math.round(set.cat18) * 20).sort({FREQUENCY: -1});
        answerLines = answerLines.concat(tempAnswers);
        tempAnswers = [];
    }
    if (set.cat19 > 0) {
        tempAnswers = await answerModel.find({CATEGORY_ID: 19}).limit(Math.round(set.cat19) * 20).sort({FREQUENCY: -1});
        answerLines = answerLines.concat(tempAnswers);
        tempAnswers = [];
    }
    if (set.cat20 > 0) {
        tempAnswers = await answerModel.find({CATEGORY_ID: 20}).limit(Math.round(set.cat20) * 20).sort({FREQUENCY: -1});
        answerLines = answerLines.concat(tempAnswers);
        tempAnswers = [];
    }
    if (set.cat21 > 0) {
        tempAnswers = await answerModel.find({CATEGORY_ID: 21}).limit(Math.round(set.cat21) * 20).sort({FREQUENCY: -1});
        answerLines = answerLines.concat(tempAnswers);
        tempAnswers = [];
    }
    if (set.cat22 > 0) {
        tempAnswers = await answerModel.find({CATEGORY_ID: 22}).limit(Math.round(set.cat22) * 20).sort({FREQUENCY: -1});
        answerLines = answerLines.concat(tempAnswers);
        tempAnswers = [];
    }
    if (set.cat25 > 0) {
        tempAnswers = await answerModel.find({CATEGORY_ID: 25}).limit(Math.round(set.cat25) * 20).sort({FREQUENCY: -1});
        answerLines = answerLines.concat(tempAnswers);
        tempAnswers = [];
    }
    if (set.cat26 > 0) {
        tempAnswers = await answerModel.find({CATEGORY_ID: 26}).limit(Math.round(set.cat26) * 20).sort({FREQUENCY: -1});
        answerLines = answerLines.concat(tempAnswers);
        tempAnswers = [];
    }

    set = getClues(set, answerLines, 1);
    
    return set;
}

async function getClues(set, answerLines, type){
    // Then, for each answer line, pick out the top x (for now using 5) clues and add them to the answerLines clue section;
    set.selectAnswers = [];
    for (var ans of answerLines) {
        var i = answerLines.indexOf(ans);
        var clues;
        if(type == 1){
           clues = await cluesModel.find({ANSWER_ID: ans.ID}).limit(5).sort({CLUE_FREQUENCY: -1});
        }else{
           clues = await allClues.find({ANSWER_ID: ans.ID}).limit(5).sort({CLUE_FREQUENCY: -1});
        }
        var clue_ids = [];
        clues.forEach(el => {
            clue_ids.push(el.ID);
        });
        var el = {
            ID: ans.ANSWER_ID,
            ANSWER: ans.ANSWER,
            FREQUENCY: ans.FREQUENCY,
            CLUES_LOADED: clue_ids,
            CLUES_SEEN: [],
            COMPLETE: false
        }
        set.selectAnswers.push(el);
    }

    return set;
}
module.exports = router;