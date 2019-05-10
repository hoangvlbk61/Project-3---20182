const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./User');
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb+srv://hoangvlbk61:@Lehoang606@cluster0-z9rem.mongodb.net/ESS?retryWrites=true";

MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) console.log(err);
    else{
        var dbo = db.db("ESS");
        dbo.collection("users").find().toArray(function (err, res) {
            console.log(res);
            console.log(res.length);
        });
        db.close();
    }
});



// mongoose.connect(process.env.MONGO_ATLAS_PATH,{ useNewUrlParser: true,});
// mongoose.Promise = global.Promise; 

// User.create({
//     _id: new mongoose.Types.ObjectId,
//     user_id: 1,
//     email: "hoangvlbk61@gmail.com",
//     username: "hoangvlbk61",
//     phonenumber: "0919066123",
//     password: "hoang",
//     workplace: "asd",
//     reputation: 0,
//     last_login: "",
//     is_superuser: false,
//     is_active: true,
//     date_joined: "",
//     list_vocab: [
//         {
//             vocab_id: 1
//         }
//     ],
// });