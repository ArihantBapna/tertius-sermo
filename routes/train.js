var express = require('express');
const funcs = require("../funcs.js");

var clusterClues = require('../models/clusterClues');
var allClues = require('../models/allClues');
var answerModel = require("../models/answers");

var router = express.Router();

router.get('/:setName', async function (req, res, next) {
   var set = funcs.getSelectedSet(req);
   if (set === '404') res.redirect('/');
   else {
      var clues = await getCluesFromSet(set);
      req.session.chosenSet = set;
      res.render(funcs.checkLog(req, 'pages/train'), {title: 'Train', loggedIn: req.session.loggedIn, clues: clues});
   }

});

async function getCluesFromSet(set){
   var clues = [];
   for(var i in set.selectAnswers){
      var ans = set.selectAnswers[i];
      for (const clue_id of ans.CLUES_LOADED) {
         var clue;
         if(set.answerLines.length > 0){
            clue = await allClues.find({ID: clue_id});
         }else{
            clue = await clusterClues.find({ID: clue_id});
         }
         clues = clues.concat(clue);
      }
   }
   //Shuffle clues
   clues = clues.sort(() => Math.random() - 0.5);
   return clues;
}

module.exports = router;