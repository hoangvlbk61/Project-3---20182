var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MediapartSchema = new Schema({
    id_exam:String,
    url:String,
    author:String,
    part:Number
});
module.exports = mongoose.model('mediaparts', MediapartSchema);