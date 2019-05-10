var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var UserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {
        type: Number,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    firstname: {
        type: String,
        default: "Unknown",
        required: true
    },
    lastname: {
        type: String,
        default: "Unknown",
        required: true
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
    
});

module.exports = mongoose.model('User', UserSchema);