var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    answer_id: {
        type: Number
    },
    author: {   
        type: String
    },
    time: {
        type: Date
    },
    reputations: { 
        type: Number, 
        default: 0
    }, 
    content: {
        type: String
    }},{
        collection:"answer"
    }
);
module.exports = mongoose.model('Answer', AnswerSchema);