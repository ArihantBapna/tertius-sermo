var mongoose = require('mongoose');
var answerModel = mongoose.model('answers',{
    _id: {type: String, required: true},
    ANSWER: {type: String, required: true},
    CATEGORY_ID: {type: Number, required: true},
    DIFF1: {type: Number, required: true},
    DIFF2: {type: Number, required: true},
    DIFF3: {type: Number, required: true},
    DIFF4: {type: Number, required: true},
    DIFF5: {type: Number, required: true},
    DIFF6: {type: Number, required: true},
    DIFF7: {type: Number, required: true},
    DIFF8: {type: Number, required: true},
    DIFF9: {type: Number, required: true},
    FREQUENCY: {type: Number, required: true},
    ID: {type: Number, required: true},
    QID: {type: String, required: true}
});
module.exports = answerModel;