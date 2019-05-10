const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const User = require('../models/User'); 

const auth = require('../api/middleware/checkAuth')

router.all('*', auth); 

router.get('/', function( req, res, next ) {
    var id = req.session.user._id ; 
    User.findById(id, (err, _user_) => { 
        res.render('profile', { data: _user_}); 
    })
});

router.get('/capnhatthongtinnguoidung', function(req, res, next) { 
    var id = req.session.user._id;
    User.findById(id, (err, _user_) => {
        res.render('editprofile', { data: _user_, user: _user_ });
    })
});

router.post('/capnhatthongtinnguoidung', function (req, res, next) {
    const id = req.session.user._id;
    const updateOps = {};
    const input = req.body;
    for (const ops of Object.keys(input)) {
        updateOps[ops] = input[ops];
        console.log(ops + "  " + input[ops])
    }
    User.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.redirect("/profile");
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router ; 