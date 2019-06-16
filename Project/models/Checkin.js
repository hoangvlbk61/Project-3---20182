var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CheckinSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: {
      type: Date
    },
    user_id: mongoose.Schema.Types.ObjectId ,
    vocab_list:[{}] , 
    input: [] , 
    result: Number,
},
    {
        collection:"checkin"
    }
);
module.exports = mongoose.model('Checkin', CheckinSchema);