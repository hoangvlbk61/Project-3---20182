var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CheckinSchema = new Schema({
   
    word:String,
    meaning:String,
    time:String
}
);
module.exports = mongoose.model('Diendanhs', CheckinSchema);