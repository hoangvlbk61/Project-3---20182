const express = require('express');
const router = express.Router();
const Vocab = require('../models/Vocab');
const User = require('../models/User');
const mongoose = require('mongoose');
const auth = require('../api/middleware/checkAuth');
const perm = require('../api/middleware/checkPerm');

//Error list 
const user_err = "User đã nhập không hợp lệ ! " ; 
const vocab_not_exist = "Từ cần thêm không có trong csdl" ; 
const vocab_added = "Từ đã được thêm trước đó ! " ; 

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

router.get('/:uid/:vid',(req, res, next) => {
    const uid = req.params.uid ; 
    const vid = req.params.vid; 
    var error = "" ; 
    if(uid !== req.session.user._id ) 
    {
        error += user_err ; 
        res.render('thietlapdanhsachhoc',{
            data: req.session.user , 
            error: error
        })        
    }
    Vocab.findById(vid, (err, svocab ) => {
        User.findById(req.session.user._id, (err, myUser) => {
        if(err) 
            error += err ; 
        else 
        {
            var user = myUser ; 
            var us_vocab_list = user.list_vocab; 
            var flag = 0 ; 
            us_vocab_list.forEach(element => {
                if(element.vocab._id == svocab._id) 
                {
                    console.log(element.vocab._id + " " + svocab._id) ; 
                    flag = 1;
                    error += vocab_added ; 
                    res.render('thietlapdanhsachhoc',{
                        data: myUser , 
                        error: error
                    });
                }
            });
            if(flag==1) 
                console.log("Từ đã tồn tại trong list nên k thêm");
            else{
                var newvc = {
                    vocab: svocab , 
                    date: new Date() ,  
                }
                user.list_vocab.push(newvc); 
                myUser.list_vocab = user.list_vocab;
                myUser.save() ; 
                res.render('thietlapdanhsachhoc',{
                    data: myUser , 
                    error: error
                })   
            }
        }
        })
    })
    
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
        User.findById(req.session.user._id, (err, us) => {
            res.render('thietlapdanhsachhoc', {data: us, query_list: query_list});
        })
    })
})

module.exports = router;