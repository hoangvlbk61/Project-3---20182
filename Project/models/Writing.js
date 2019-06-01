var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WritingSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        default: "Writing"
    },
    author_id: {
        type: String
    },
    content: {
        type: String,
        default: "Writing Content", 
    },
    explanation: String,
}, {
    collection : "writing"
});
module.exports = mongoose.model('writing', WritingSchema);