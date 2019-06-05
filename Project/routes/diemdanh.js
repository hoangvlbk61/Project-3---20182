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

router.get('/', (req, res, next ) => { 
    id = req.session.user._id ; 
    User.findById(id, (err, _user) => {
        res.render('diemdanh', { data: _user }); 
    })
}); 


module.exports = router; 
