var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    answer_id: {
        type: Number
    },
    post_id: { 
        type: Number
    },
    author_id: {   
        type: Number
    },
    time: {
        type: Date
    },
    reputations: { 
        type: Number
    }, 
    content: {
        type: String
    }
});
module.exports = mongoose.model('Answer', AnswerSchema);