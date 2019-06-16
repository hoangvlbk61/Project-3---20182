const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Vocab = require('../models/Vocab');
const User = require('../models/User');
const Checkin = require('../models/Checkin');
var MongoClient = require('mongodb').MongoClient;


const auth = require('../api/middleware/checkAuth');
const perm = require('../api/middleware/checkPerm');

function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    var _MS_PER_DAY = 24*3600*1000 ;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

router.all('*', auth); 

router.get('/', (req, res, next) => {
    var query = {
        user_id: req.session.user._id
    };
    Checkin.find(query, (err, checklist) =>  {
        if(err) 
            throw(err); 
        else {
            res.render('checkin', {
                data: req.session.user , 
                checkinlist: checklist
            })
        }
    })
}) 

router.get('/docheckin', (req, res, next) => {
    console.log("Do checkin") ; 
    const user = req.session.user ;
    const uservocablist = user.list_vocab ; 
    var vocabchecklist = [] ; 
    const today = new Date() ; 
    if(uservocablist.length) 
    {
        uservocablist.forEach(element => {
            console.log(element.vocab.word + " " + element.date + " cppto: " + new Date(element.date) )  ; 
            var temp = dateDiffInDays(today, new Date(element.date)) ; 
            console.log("temp = " + temp) ;
            if(temp==0 || temp == 1|| temp == 3 || temp == 5 || temp == 7 || temp == 14 || temp == 30) 
            {
                vocabchecklist.push(element.vocab);
            }
        });
        vocabchecklist.sort(function() {
            return 0.5 - Math.random();
        });
        req.session.vocabchecklist = vocabchecklist ; 
        res.render('docheckin',{
            data: req.session.user, 
            checkinlist: vocabchecklist
        });
    }
    else {
        res.render('docheckin',{
            data: req.session.user, 
            checkinlist: [] ,
            message: "Hãy học từ mới bằng cách <a href\"\\thietlapdanhsachhoc\"> thêm từ </a> vào danh sách học !"
        });
    }
})

router.post('/docheckin', (req, res, next) => {
    const listcheck = req.session.vocabchecklist ;  
    const body = req.body ;
    var iter = 0 ; 
    var count = 0 ;
    var total = Object.keys(body).length ; 
    var input = [] ; 
    for (const prop in body) {
        input.push(body[prop]);
        console.log(body[prop] + "___" + listcheck[iter].word)
        if(body[prop]==listcheck[iter].meaning) 
            count ++ ; 
        iter ++ ; 
    }; 
    // res.status(200).json({body: body, count: count, total: total, listcheck: listcheck});
    var newCheckIn = new Checkin() ; 
    newCheckIn._id = new mongoose.Types.ObjectId() ; 
    newCheckIn.date = new Date() ; 
    newCheckIn.user_id = req.session.user._id ; 
    newCheckIn.vocab_list =   listcheck ; 
    newCheckIn.input = input ; 
    newCheckIn.result = count ; 
    newCheckIn.save() ; 
    res.redirect(200,'/checkin');
})

module.exports = router; 
