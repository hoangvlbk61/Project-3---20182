const express = require('express');
const router = express.Router();
const Vocab = require('../models/Vocab');
const User = require('../models/User');
const mongoose = require('mongoose');
const auth = require('../api/middleware/checkAuth');
const perm = require('../api/middleware/checkPerm');

function compare(obj1, obj2)
{
    let comparison = 0 ; 
    if(obj1.value < obj2.value) 
        comparison = -1 ; 
    else if( obj1.value > obj2.value)  
        comparison = 1 ;
    return comparison ; 
}

router.all('*', auth, perm);

router.get('/', (req, res, next) => {
    User.findById(req.session.user._id, (err, usr) => {
        if(err)
            throw(err); 
        else 
        { 
            res.render('thietlapdanhsachhoc', {data: usr });
        }
    });
})

router.get('/:query', (req, res, next) => {
    const query = req.params.query;
    const query_list = [];
    Vocab.find({},(err, vocablist) => { 
        if(err) 
            throw(err) ; 
        var temp_arr = [];  
        
        vocablist.forEach((vc)=>{
            if(vc.word.search(query)>=0)
                temp_arr.push({
                    word: vc,
                    value: vc.word.search(query)
                });  
        });
        temp_arr = temp_arr.sort(compare);
        // res.status(200).json({
        //     code: temp_arr 
        // })
        if(temp_arr.length <= 5)
        {
            var len = temp_arr.length ;  
            for(var i = 0 ; i < len ; i ++ )
            {
                var tmp = temp_arr[i]; 
                // console.log(tmp['word']);
                query_list.push(tmp['word']);
            }
        } 
        else query_list = temp_arr.slice(0,5);
        res.render('thietlapdanhsachhoc', {data: req.session.user, query_list: query_list});
    })
})

module.exports = router;