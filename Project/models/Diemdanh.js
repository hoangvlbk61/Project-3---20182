var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiemdanhSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    word: {
      type: String  
    },
    meaning: { 
        type: String 
    },
    time: {
        type: Date
    },
    },
    {
        collection:"diemdanh"
    
});
module.exports = mongoose.model('Diemdanh', DiemdanhSchema);