var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartSchema = new Schema({
    id_exam: Number, 
    part: Number,
    action:String,
    audio_src:String,
    dv1:String,
    dv2:String,
    dv3:String,
    data:Object
});
module.exports = mongoose.model('parts', PartSchema);