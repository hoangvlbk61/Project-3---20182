var mongoose = require('mongoose');
var part = require('./Part');
var Schema = mongoose.Schema;

var ReadingSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        default: "Listening"
    },
    author_id: {
        type: String
    },
    content: {
        type: String,
        default: "Listening Content", 
    },
    part_list : [{}
    ],
    explaination: String,
}, {
    collection : "listening"
});
module.exports = mongoose.model('listening', ReadingSchema);