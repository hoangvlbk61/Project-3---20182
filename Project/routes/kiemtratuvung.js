const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const Answer = require('../models/Answer');
const User = require('../models/User');
const vocab = require('../models/Vocab')
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
let obj = require('../DATABASE_DATA/vocab')
const auth = require('../api/middleware/checkAuth');
const perm = require('../api/middleware/checkPerm');

router.all('*', auth); 

router.get('/', (req, res) => {
    //lấyngẫu nhiên 5 từ trong dâtbáe
    vocab.aggregate([
        { $sample: { size: parseInt(5) } }
    ]).exec((err, ok) => {

        res.render('kiemtratuvung', {
            data: {
                firstname: "dfdf",
                lastname: 'cxgfvdsg'
            },
            vocal: ok
        })
    })
})
router.post('/check', (req, res) => {
    //  check các từ bằng cách check từng từ 1
    let ans = req.body
    let result = []
    //check tuần tự từng từ 1 theo id
    console.log(ans)
    console.log(ans['word[0][_id]'])
    vocab.findById(ans['word[0][_id]'], (err, ok) => {
        if (ok) {
            if (ok.word == ans['word[0][word]']) result.push("Chinh xac")
            else result.push("sai")

        } else result.push("sai")
        vocab.findById(ans['word[1][_id]'],(err,ok1)=>{
            if (ok1) {
                if (ok1.word == ans['word[1][word]']) result.push("Chinh xac")
                else result.push("sai")
    
            } else result.push("sai")
            vocab.findById(ans['word[2][_id]'],(err,ok2)=>{
                if (ok2) {
                    if (ok2.word == ans['word[2][word]']) result.push("Chinh xac")
                    else result.push("sai")
        
                } else result.push("sai")  
                vocab.findById(ans['word[3][_id]'],(err,ok3)=>{
                    if (ok3) {
                        if (ok3.word == ans['word[3][word]']) result.push("Chinh xac")
                        else result.push("sai")
            
                    } else result.push("sai") 
                    vocab.findById(ans['word[4][_id]'],(err,ok4)=>{
                        if (ok4) {
                            if (ok4.word == ans['word[4][word]']) result.push("Chinh xac")
                            else result.push("sai")
                
                        } else result.push("sai")
                        res.json(result)
                    })
                })
            })
        })
    })

})


    // if(g.length==0) return res.json({message:"Cau khong ton tai"})
    // if(g[0].word.toLocaleLowerCase()==ans.word.toLocaleLowerCase()) return res.json({message:"chinh xac"})
    // else return res.json({message:"Oh! Sai roi"})
    // User.find({},(err,ok)=>{
    //     console.log(ok)
    // })





module.exports = router