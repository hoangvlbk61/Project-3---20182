var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    question_id: {
        type: Number
    },
    type: {
        type: String 
    },
    test_id: {
        type: Number
    },
    content: {
        type: String
    },
    solution: {
        type: String
    },
    explanation: {
        type: String
    },
});

module.exports = mongoose.model('Question', QuestionSchema);