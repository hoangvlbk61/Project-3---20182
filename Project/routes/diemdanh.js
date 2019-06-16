const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Vocab = require('../models/Vocab');
const User = require('../models/User');
var MongoClient = require('mongodb').MongoClient;


const auth = require('../api/middleware/checkAuth');
const perm = require('../api/middleware/checkPerm');

router.all('*', auth); 

router.get('/', (req, res, next) => {
    Vocab.find({}, function (err, result) { 
        if (err)
            res.status(200).json({
                error: err
            })
        else {
            id = req.session.user._id;
            User.findById(id, (err, _user) => { 
                res.render('diemdanh', { list_vocab: result, data: _user });
            })
        }
    })
})

router.get('/checkin', (req, res, next) => {
    User.findById(req.session.user._id, (err, _user) => {
        res.render('chitietdiemdanh', {data: _user});
    })
})

// router.post("./chitietdiemdanh", (req, res, next) => {
//     Vocab.findOne({ word: req.body.word })
//         .exec()
//         .then(vocab => {
//             if (vocab) {
//                 console.log(vocab);
//                 res.render('admin/page_404', { message: "vocab not exist !" });
//             } else {
//                 console.log(req.body);
//                 const vocab = new Vocab({
//                     _id: new mongoose.Types.ObjectId(),
//                     word: req.body.word,
//                     meaning: req.body.meaning,                            
//                     examples: req.body.examples,
//                     synonyms: req.body.synonyms
//                 });
//                 vocab
//                     .save()
//                     .then(result => {
//                         console.log(result);
//                         res.redirect('/diemdanh');
//                     })
//                     .catch(err => {
//                         console.log(err);
//                         res.status(500).json({
//                             error: err
//                             });
//                         });
//                     }
//                 });
// })

module.exports = router; 
