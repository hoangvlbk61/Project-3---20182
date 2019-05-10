var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TestSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    type: {
        type: String
    },
    name: {
        type: String
    }
});

module.exports = mongoose.model('Test', TestSchema);