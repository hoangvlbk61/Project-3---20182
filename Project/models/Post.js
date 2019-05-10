var mongoose = require('mongoose');
var Answer = require('./Answer');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    views: {
        type: Number,
        default: 0
    },
    author_id: {
        type: String
    },
    time: {
        type: Date
    },
    reputations: {
        type: Number,
        default: 0, 
    },
    title: String,
    content: {
        type: String
    },
    answers:  [
        {}
    ],
}, {
    collection : "post"
});
module.exports = mongoose.model('Post', PostSchema);