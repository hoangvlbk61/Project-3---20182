var express = require('express');
var path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const User = require('../models/user');
var MongoClient = require('mongodb').MongoClient;

var user_md = require("../models/user_c");
var app = express();
var chuyenthanhObjectId = require('mongodb').ObjectID;
const assert = require('assert');

var memberManager = require('./memberManager');
var testManager = require('./testManager');
var vocabManager = require('./vocabManager');

router.use('/quanlythanhvien',memberManager);
router.use('/quanlytuvung',vocabManager);
router.use('/quanlydethi',testManager);

// Login cua ban admin na
router.get('/', function (req, res, next) {
    res.redirect('admin/login');
});

router.get('/index', function (req, res, next) {
    res.render('admin/index');
});

router.get('/login',function(req, res, next) {
    res.render('admin/login');
});

router.post('/login', function( req, res, next) { 
    var params = req.body;

    if (params.email.trim().length == 0) {
        res.render("login/login", { data: { error: "Please enter an email" } });
    } else {
        user_md.find({ email: params.email }, function (err, dulieu) {
            if(err) {
                throw(err);
            }
            else{
                var user = dulieu[0];
                if (user == undefined) {
                    res.render("admin/login", { error: { error: "Email " + params.email + " chưa được đăng ký !" } });
                }
                else {
                    if (user.password === params.password) {

                        req.session.user = user;

                        if(user.is_admin == true ) 
                        {
                            res.redirect('admin/dashboard'); 
                        } 
                        else if (user.entry_score && user.target_score) {
                            res.redirect("/dashboard/" + req.session.user._id);
                        }
                        else {
                            res.redirect("/dashboard/datmuctieu/" + req.session.user._id);
                        }
                    } else {
                        res.render("admin/login", { err: { error: "Password is not correct" } });
                    }
                }

            }

        })

    }
})

module.exports = router;


