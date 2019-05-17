const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const Answer = require('../models/Answer');
const User = require('../models/User');
var MongoClient = require('mongodb').MongoClient;


const auth = require('../api/middleware/checkAuth');
const perm = require('../api/middleware/checkPerm');

router.all('*', auth); 

router.get('/', (req, res, next ) => { 
    
    Post.find({}, (err, list_post) => {
        id = req.session.user._id ; 
        User.findById(id, (err, _user) => {
            res.render('forum', { list_post: list_post.reverse(), data: _user }); 
        })
    });
}); 

router.get('/thembaidang', (req, res, next) => {
    var userid = req.session.user._id;
    User.findById(userid, (err, _user) => {
        res.render('newpost', data = _user);
    });
});

router.post('/thembaidang', (req, res, next) => {
    var userid = req.session.user._id;
    User.findById(userid, (err, _user) => {
        request = req.body;
        var today = new Date();
        // Take the date of today !
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        //today = mm + '/' + dd + '/' + yyyy;
        var time = today.getTime();
        today = time;
    
        const newpost = new Post({
            _id: new mongoose.Types.ObjectId(),
            author_id: _user.firstname + " " + _user.lastname,
            title: request.title,
            content: request.content,
            time: today,
            answers: [],
        });
        newpost
        .save()
        .then(result => {
            console.log(result);
            res.redirect('/forum');
        })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        // res.status(200).json({
        //     res: newpost
        // })
        res.redirect('/forum');
    });
})

router.get('/:_id', (req, res, next) => {
    var postid = req.params._id; 
    var userid = req.session.user._id; 
    Post.findById(postid, (err, _post) => {
        User.findById(userid, (err, _user) => {
            _post.views += 1 ; 
            _post.save() ;
            var upload_data = {data: _user, post:_post };
            res.render('postdetail', upload_data );
        });
    });
});

router.post('/:_id', (req, res, next) => {
    var postid = req.params._id;
    var userid = req.session.user._id;
    Post.findById(postid, (err, _post) => {
        User.findById(userid, (err, _user) => {
            request = req.body;
            var today = new Date();
            // Take the date of today !
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy; 

            const ans = new Answer({
                _id: new mongoose.Types.ObjectId(),
                author: _user.firstname + " " + _user.lastname,
                title: request.title,
                content: request.content,
                time: today
            });
            _post.answers.push(ans);
            _post.save();
            ans
                .save()
                .then(result => {
                    console.log(ans);
                    console.log(_user.firstname + " " + _user.lastname);
                    res.redirect('/forum/'+postid);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

            // res.redirect('/forum/'+postid);
        });
    });
});

router.get('/:_id/delete', perm, (req, res, next ) => {
    const id = req.params._id;
    Post.remove({
        _id: id
    })
        .exec()
        .then(result => {
            res.redirect('/forum');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.get('/:_id/downvote', perm, (req, res, next) => {
    const id = req.params._id;
    Post.findById(id, (err, _post)=>{
        _post.reputations -= 1 ; 
        _post.views -= 1; 
        _post.save() ;
        res.redirect('/forum/' + id);
    });
})

router.get('/:_id/upvote', perm, (req, res, next) => {
    const id = req.params._id;
    Post.findById(id, (err, _post) => {
        _post.reputations += 1;
        _post.views -= 1; 
        _post.save();
        res.redirect('/forum/' + id);
    });
})



module.exports = router; 