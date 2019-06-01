var mongoose = require('mongoose');
var part = require('./Part');
var Schema = mongoose.Schema;

var ReadingSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        default: "Reading"
    },
    author_id: {
        type: String
    },
    content: {
        type: String,
        default: "Reading Content", 
    },
    part_list: [
        {}
    ],
    explanation: String,
}, {
    collection : "reading"
});
module.exports = mongoose.model('reading', ReadingSchema);