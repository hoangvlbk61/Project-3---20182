const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Vocab = require('../models/Vocab');
const User = require('../models/User');
var MongoClient = require('mongodb').MongoClient;


const auth = require('../api/middleware/checkAuth');
const perm = require('../api/middleware/checkPerm');

router.all('*', auth, perm); 

router.get('/', (req, res, next) => {
    Vocab.find({}, function (err, result) { 
        if (err)
            res.status(200).json({
                error: err
            })
        else {
            id = req.session.user._id;
            User.findById(id, (err, _user) => { 
                res.render('quanlytuvung', { list_vocab: result, data: _user });
            })
        }
    })
})

router.get('/themmoituvung', (req, res, next) => {
    User.findById(req.session.user._id, (err, _user) => {
        res.render('themmoituvung', {data: _user});
    })
})

router.get('/:_id', (req, res, next) => {
    Vocab.findById(req.params._id)
        .exec()
        .then(result => {
            if (result) {
                User.findById(req.session.user._id, (err, _user) => {
                    res.render('chitiettuvung', { vocab: result,data: _user });
                })
            }
            else {
                res.render('page_404', { message: "Vocab not exist !" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.get('/:_id/capnhattuvung', (req, res, next) => {
    Vocab.findById(req.params._id)
        .exec()
        .then(result => {
            if (result) {
                User.findById(req.session.user._id, (err, _user) => {
                    res.render('capnhattuvung', { vocab: result, data: _user });
                })
            }
            else {
                res.render('admin/page_404', { message: "Vocab not exist !" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.post('/:_id/capnhattuvung', (req, res, next) => {
    const id = req.params._id;
    const updateOps = {};
    const input = req.body;
    for (const ops of Object.keys(input)) {
        updateOps[ops] = input[ops];
        console.log(ops + "  " + input[ops])
    }
    Vocab.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.redirect('quanlytuvung');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:_id/delete', (req, res, next) => {
    const id = req.params._id;
    Vocab.remove({
        _id: id
    })
        .exec()
        .then(result => {
            res.redirect('../../quanlytuvung');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/themmoituvung", (req, res, next) => {
        Vocab.findOne({ word: req.body.word })
            .exec()
            .then(vocab => {
                if (vocab) {
                    console.log(vocab);
                    res.render('admin/page_404', { message: "vocab not exist !" });
                } else {
                    console.log(req.body);
                    const vocab = new Vocab({
                        _id: new mongoose.Types.ObjectId(),
                        word: req.body.word,
                        meaning: req.body.meaning,                            
                        examples: req.body.examples,
                        synonyms: req.body.synonyms
                    });
                    vocab
                        .save()
                        .then(result => {
                            console.log(result);
                            res.redirect('/quanlytuvung');
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                                });
                            });
                        }
                    });
})
module.exports = router;