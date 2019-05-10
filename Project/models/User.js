var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var UserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    firstname: {
        type: String, 
        unique: true
    },
    lastname: {
        type: String,
        unique: true
    },
    phonenumber: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    workplace: {
        type: String,
        required: true
    },
    reputation: {
        type: Number,
        default : 0 
    },
    last_login: {
        type: Date,
        default: Date.now()
    },
    is_admin: {
        type: Boolean, 
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    date_joined: {
        type: Date,
        default: Date.now()
    },
    list_vocab: [
        {
            vocab_id: Number 
        }
    ],
}, {
    collection:"user"
}
); 

module.exports = mongoose.model('User', UserSchema);