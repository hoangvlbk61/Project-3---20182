const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Vocab = require('../models/Vocab');
var MongoClient = require('mongodb').MongoClient;

var user_md = require("../models/user_c");

var chuyenthanhObjectId = require('mongodb').ObjectID;
const assert = require('assert');

const auth = require('../api/middleware/checkAuth');
const perm = require('../api/middleware/checkPerm');

router.all('*',auth,perm); 

router.get('/', function (req, res, next) {
    User.find({},function (err, result)  {
        if(err)
            res.status(200).json({
                error: err
            })
        else  
        {
            id = req.session.user._id ; 
            User.findById(id, (err, _user) => {
                res.render('quanlythanhvien', {list_user: result, data:_user });
            })
        }
    })
})

router.get('/themmoithanhvien', (req, res, next) => {
    id = req.session.user._id;
    User.findById(id, (err, _user) => {
        res.render('themmoithanhvien', { data: _user });
        next();
    })
})

router.get('/:_id', (req, res, next) => {
    User.findById(req.params._id)
    .exec()
    .then( result => {
        if(result)
        {
            id = req.session.user._id;
            User.findById(id, (err, _user) => {
                // res.status(200).json({
                //     user: result, data: _user
                // })
                if(err) 
                    res.status(200).json({err: err});
                else 
                    // res.status(200).json({})
                    res.render('chitietthanhvien', { user: result, data: _user });
                next();
            })
            // res.render('chitietthanhvien', { user: result});
        }
        else 
        {
            res.render('page_404', { message: "User not exist !" });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
})

router.get('/:_id/capnhatthongtinthanhvien', (req, res, next) => {
    User.findById(req.params._id)
        .exec()
        .then(result => {
            if (result) {
                id = req.session.user._id;
                User.findById(id, (err, _user) => {
                    // res.status(200).json({
                    //     user: result, data: _user
                    // })
                    if (err)
                        res.status(200).json({ err: err });
                    else
                        // res.status(200).json({})
                        res.render('capnhatthongtinthanhvien', { user: result, data: _user });
                    next();
                })
                // res.render('chitietthanhvien', { user: result});
            }
            else {
                res.render('page_404', { message: "User not exist !" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.post('/:_id/capnhatthongtinthanhvien', (req, res, next) => {
    const id = req.params._id;
    const updateOps = {};
    const input = req.body;
    for (const ops of Object.keys(input)) {
        updateOps[ops] = input[ops];
        console.log(ops + "  " + input[ops] )
    }
    User.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:uid/delete', (req, res, next) => {
    const id = req.params.uid;
    User.remove({
        _id: id
    })
        .exec()
        .then(result => {
            res.redirect('../../quanlythanhvien');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/themmoithanhvien", (req, res, next) => {
    var data = req.body;
    if (data.email.trim().length == 0) {
        res.render('login/register', { data: { error: "Email is require" } });
    } else if (data.passwd != data.repasswd && data.passwd.trim().length != 0) {
        res.render('login/register', { data: { error: "Password not match" } });
    } else {
        User.findOne({ email: req.body.email, id: req.body.id })
            .exec()
            .then(user => {
                if (user) {
                    console.log(user);
                    return res.status(409).json({
                        message: "User exists"
                    });
                } else {
                    console.log(req.body.password);
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            var today = new Date();
                            // Take the date of today !
                            var dd = String(today.getDate()).padStart(2, '0');
                            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                            var yyyy = today.getFullYear();
                            today = mm + '/' + dd + '/' + yyyy;
                            // Init the new user
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                // user_id: uid + 1,
                                firstname: req.body.firstname,
                                password: hash,
                                email: req.body.email,
                                lastname: req.body.lastname,
                                phonenumber: req.body.phonenumber,
                                workplace: req.body.workplace,
                                reputation: 0,
                                last_login: today,
                                is_superuser: (req.body.is_superuser === "yes" ? true : false),
                                is_active: true,
                                date_joined: today,
                                list_vocab: []
                            });
                            user
                                .save()
                                .then(result => {
                                    console.log(result);
                                    res.redirect('/quanlythanhvien');
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                        }
                    });
                }
            });
    }
    //
});

module.exports = router;
