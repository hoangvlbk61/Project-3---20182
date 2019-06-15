var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VocabSchema = new Schema({

    word: {
      type: String  
    },
    meaning: { 
        type: String 
    },
    examples: { 
        type: String
    },
    synonyms: {
        type: String
    }
    });
module.exports = mongoose.model('vocabs', VocabSchema);