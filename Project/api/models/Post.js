var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    post_id: {
        type: Number
    },
    views: {
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
module.exports = mongoose.model('Post', PostSchema);