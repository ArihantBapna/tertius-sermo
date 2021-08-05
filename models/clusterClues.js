var mongoose = require('mongoose');
var ClusterClues = mongoose.model('ClusterClues',{
    _id: {type: String, required: true},
    ANSWER: {type: String, required: true},
    ANSWER_FREQUENCY: {type: Number, required: true},
    ANSWER_ID: {type: Number, required: true},
    CATEGORY_ID: {type: Number, required: true},
    CATEGORY_NAME: {type: String, required: true},
    CLUE: {type: String, required: true},
    CLUES_LIST: {type: String, required: true},
    CLUE_FREQUENCY: {type: Number, required: true},
    DIFFICULTY: {type: Number, required: true},
    ID: {type: Number, required: true},
    LINE: {type: Number, required: true},
    QUESTION_ID: {type: Number, required: true},
    SKEW_DIFFICULTY: {type: Number, required: true},
    TOURNAMENT_ID: {type: Number, required: true},
    TOURNAMENT_NAME: {type: String, required: true},
}, "ClusterClues");
module.exports = ClusterClues;