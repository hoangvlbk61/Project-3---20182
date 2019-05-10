var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SelectionSchema = new Schema({
    selection_id: {
        type: Number
    },
    question_id: {
        type: String
    },
    content: {
        type: String
    },
});

module.exports = mongoose.model('Selection', SelectionSchema);