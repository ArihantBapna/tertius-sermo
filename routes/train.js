var express = require('express');
const funcs = require("../funcs.js");

var clusterClues = require('../models/clusterClues');
const answerModel = require("../models/answers");

var router = express.Router();

router.get('/:setName', async function (req, res, next) {
   var set = funcs.getSelectedSet(req);
   if (set === '404') res.redirect('/');
   else {
      var clues = await getCluesFromCat(set);
      res.render(funcs.checkLog(req, 'pages/train'), {title: 'Train', loggedIn: req.session.loggedIn, clues: clues});
   }

});

async function getCluesFromCat(set){
   var answers, temp, toRem, clues;
   answers = [];
   clues = [];
   if(set.cat14 > 0){
      temp = [];
      temp = await answerModel.find({CATEGORY_ID: 14}).limit(10).sort({FREQUENCY: -1});

      toRem = Math.round(1-set.cat14*10);
      temp.sort((a,b) => (a.FREQUENCY < b.FREQUENCY) ? 1 : -1)
      temp.splice(1,toRem);

      temp.forEach(t => {
         answers.push(t);
      });
   }
   if(set.cat15 > 0){
      temp = [];
      temp = await answerModel.find({CATEGORY_ID: 15}).limit(10).sort({FREQUENCY: -1});

      toRem = Math.round(1-set.cat15*10);
      temp.sort((a,b) => (a.FREQUENCY < b.FREQUENCY) ? 1 : -1)
      temp.splice(1,toRem);

      temp.forEach(t => {
         answers.push(t);
      });
   }
   if(set.cat16 > 0){
      temp = [];
      temp = await answerModel.find({CATEGORY_ID: 16}).limit(10).sort({FREQUENCY: -1});

      toRem = Math.round(1-set.cat16*10);
      temp.sort((a,b) => (a.FREQUENCY < b.FREQUENCY) ? 1 : -1)
      temp.splice(1,toRem);

      temp.forEach(t => {
         answers.push(t);
      });
   }
   if(set.cat17 > 0){
      temp = [];
      temp = await answerModel.find({CATEGORY_ID: 17}).limit(10).sort({FREQUENCY: -1});
      toRem = Math.round((1-set.cat17)*10);
      temp.sort((a,b) => (a.FREQUENCY < b.FREQUENCY) ? 1 : -1)
      temp.splice(1,toRem);

      temp.forEach(t => {
         answers.push(t);
      });
   }
   if(set.cat18 > 0){
      temp = [];
      temp = await answerModel.find({CATEGORY_ID: 18}).limit(10).sort({FREQUENCY: -1});

      toRem = Math.round(1-set.cat18*10);
      temp.sort((a,b) => (a.FREQUENCY < b.FREQUENCY) ? 1 : -1)
      temp.splice(1,toRem);

      temp.forEach(t => {
         answers.push(t);
      });
   }
   if(set.cat19 > 0){
      temp = [];
      temp = await answerModel.find({CATEGORY_ID: 19}).limit(10).sort({FREQUENCY: -1});

      toRem = Math.round(1-set.cat19*10);
      temp.sort((a,b) => (a.FREQUENCY < b.FREQUENCY) ? 1 : -1)
      temp.splice(1,toRem);

      temp.forEach(t => {
         answers.push(t);
      });
   }
   if(set.cat20 > 0){
      temp = [];
      temp = await answerModel.find({CATEGORY_ID: 20}).limit(10).sort({FREQUENCY: -1});

      toRem = Math.round(1-set.cat20*10);
      temp.sort((a,b) => (a.FREQUENCY < b.FREQUENCY) ? 1 : -1)
      temp.splice(1,toRem);

      temp.forEach(t => {
         answers.push(t);
      });
   }
   if(set.cat21 > 0){
      temp = [];
      temp = await answerModel.find({CATEGORY_ID: 21}).limit(10).sort({FREQUENCY: -1});

      toRem = Math.round(1-set.cat21*10);
      temp.sort((a,b) => (a.FREQUENCY < b.FREQUENCY) ? 1 : -1)
      temp.splice(1,toRem);

      temp.forEach(t => {
         answers.push(t);
      });
   }
   if(set.cat22 > 0){
      temp = [];
      temp = await answerModel.find({CATEGORY_ID: 22}).limit(10).sort({FREQUENCY: -1});

      toRem = Math.round(1-set.cat22*10);
      temp.sort((a,b) => (a.FREQUENCY < b.FREQUENCY) ? 1 : -1)
      temp.splice(1,toRem);

      temp.forEach(t => {
         answers.push(t);
      });
   }
   if(set.cat25 > 0){
      temp = [];
      temp = await answerModel.find({CATEGORY_ID: 25}).limit(10).sort({FREQUENCY: -1});

      toRem = Math.round(1-set.cat25*10);
      temp.sort((a,b) => (a.FREQUENCY < b.FREQUENCY) ? 1 : -1)
      temp.splice(1,toRem);

      temp.forEach(t => {
         answers.push(t);
      });
   }
   if(set.cat26 > 0){
      temp = [];
      temp = await answerModel.find({CATEGORY_ID: 26}).limit(10).sort({FREQUENCY: -1});

      toRem = Math.round(1-set.cat26*10);
      temp.sort((a,b) => (a.FREQUENCY < b.FREQUENCY) ? 1 : -1)
      temp.splice(1,toRem);

      temp.forEach(t => {
         answers.push(t);
      });
   }

   answers.sort((a,b) => (a.FREQUENCY > b.FREQUENCY) ? 1 : -1);
   for(var i in answers){
      var ans = answers[i];
      var tempClues = await clusterClues.find({ANSWER_ID: ans.ID}).limit(10).sort({FREQUENCY: -1});
      tempClues.forEach(t => {
         clues.push(t);
      });
   }

   return clues;
}

module.exports = router;