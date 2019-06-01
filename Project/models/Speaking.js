var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpeakingSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        default: "Speaking"
    },
    author_id: {
        type: String
    },
    cuecards: String,
    content: {
        type: String,
        default: "Speaking Content", 
    },
    explanation: String,
}, {
    collection : "speaking"
});
module.exports = mongoose.model('speaking', SpeakingSchema);