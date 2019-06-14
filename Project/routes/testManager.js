const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Writing = require('../models/Writing');
const Speaking = require('../models/Speaking');
const Reading = require('../models/Reading');
const User = require('../models/User');
const Part = require('../models/Part');
const auth = require('../api/middleware/checkAuth');
const perm = require('../api/middleware/checkPerm');

var MongoClient = require('mongodb').MongoClient;

function UL(variable, id){
    var part = new Part() ;
    part._id = new mongoose.Types.ObjectId(); 
    part.name = variable.name;
    part.author_id = id; 
    part.type = variable.type; 
    part.content = variable.content; 
    part.explanation = variable.explanation ; 
    part.questionlist = variable.qlist.split("\n"); 
    part.answerlist = variable.alist.split("\n"); 
    part.selectlist = variable.slist.split("\n"); 
    part.save();
    return part; 
};

function IN(variable, id){
    var part = new Part() ;
    part.name = variable.name;
    part._id = new mongoose.Types.ObjectId(); 
    part.author_id = id; 
    part.type = variable.type; 
    part.content = variable.content; 
    part.explanation = variable.explanation ; 
    part.questionlist = variable.qlist.split("\n"); 
    part.answerlist = variable.alist.split("\n"); 
    part.save();
    return part; 
};

function RD(variable, id){
    var part = new Part() ;
    part.name = variable.name;
    part._id = new mongoose.Types.ObjectId(); 
    part.author_id = id; 
    part.type = variable.type; 
    part.content = variable.content; 
    part.explanation = variable.explanation ; 
    part.questionlist = variable.qlist.split("\n"); 
    part.answerlist = variable.alist.split("\n"); 
    part.selectlist = variable.slist.split("\n"); 
    part.save();
    return part; 
}

function CB(variable, id){
    var part = new Part() ;
    part.name = variable.name;
    part._id = new mongoose.Types.ObjectId(); 
    part.author_id = id; 
    part.type = variable.type; 
    part.content = variable.content; 
    part.explanation = variable.explanation ; 
    part.questionlist = variable.qlist.split(" "); 
    part.answerlist = variable.alist.split("\n"); 
    part.selectlist = variable.slist.split("\n"); 
    part.save();
    return part; 
}

function FB(variable, id){
    var part = new Part() ;
    part.name = variable.name;
    part._id = new mongoose.Types.ObjectId(); 
    part.author_id = id; 
    part.type = variable.type; 
    part.content = variable.content; 
    part.explanation = variable.explanation ; 
    part.questionlist = variable.qlist.split("\n"); 
    part.answerlist = variable.alist.split("\n"); 
    part.save();
    return part; 
}


router.all('*', auth, perm);

router.get('/', (req, res, next) => {
    id = req.session.user._id ; 
    User.findById(id, (err, _user) => {
        if(err) 
            res.status(200).json({
                err: err
            });
        else 
        {
            // res.status(200).json({
            //     code: "ookokasodk"
            // })
            Writing.find({}, (err, writinglist ) => {
                if(err)
                    res.status(200).json({
                        err: err 
                    });
                else 
                {
                    Speaking.find({}, (err, speakinglist) => {
                        if(err)
                            throw(err) 
                        else
                        {
                            Reading.find({}, (err, readinglist) => {
                                if(err)
                                    throw(err)
                                else 
                                    res.render('quanlydethi', { data:req.session.user, writinglist: writinglist,
                                         'speakinglist': speakinglist, 'readinglist':readinglist });
                            })
                        }
                    })
                }
            })
        };
        // next() ;
    });
})

router.get('/themmoidethi', (req, res, next) => {
    res.redirect('themmoidethi/writing');
})

router.get('/themmoidethi/writing', (req, res, next) => {
    User.findById(req.session.user._id, (err, _user) => {
        if(err) 
            throw(err) 
        else 
            res.render('writing', { data:_user });
    })
})

router.post('/themmoidethi/writing', (req, res, next) => {
    var body = req.body; 
    const newpart = Writing() ; 
    newpart._id = new mongoose.Types.ObjectId(),
    newpart.name = body.name ; 
    newpart.content = body.content; 
    newpart.explanation = body.explanation ; 
    newpart.author_id = req.session.user._id ; 
    newpart.save() ; 
    res.redirect('/quanlydethi');
})

router.get('/writing/:wid', (req, res, next) => {
    Writing.findById(req.params.wid)
    .exec()
    .then( result => {
        if(result)
        {
            res.render('writingdetail', { writing: result, data: req.session.user });
        }
        else 
        {
            res.render('page_404', { message: "User not exist !" });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(200).json({
            error: err,
            code: "ma500"
        });
    });
})

router.get('/writing/:pid/delete', (req, res, next) => { 
    const id = req.params.pid;
    Writing.remove({
        _id: id
    })
        .exec()
        .then(result => {
            res.redirect('/quanlydethi');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.get('/writing/:_id/edit', (req, res, next) => {
    Writing.findById(req.params._id)
        .exec()
        .then(result => {
            if (result) {
                res.render('writingupdate', { writing: result, data:req.session.user });
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

router.post('/writing/:_id/edit', (req, res, next) => {
    const id = req.params._id;
    const updateOps = {};
    const input = req.body;
    for (const ops of Object.keys(input)) {
        updateOps[ops] = input[ops];
        console.log(ops + "  " + input[ops])
    }
    Writing.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.redirect("/quanlydethi/writing/"+id);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Speaking 
router.get('/themmoidethi/speaking', (req, res, next) => {
    User.findById(req.session.user._id, (err, _user) => {
        if(err) 
            throw(err) 
        else 
            res.render('speaking', { data:_user });
    })
})

router.post('/themmoidethi/speaking', (req, res, next) => {
    
    var body = req.body; 
    const newpart = Speaking() ; 
    newpart._id = new mongoose.Types.ObjectId(),
    newpart.name = body.name ; 
    newpart.content = body.content; 
    newpart.explanation = body.explanation ; 
    newpart.author_id = req.session.user._id ;
    newpart.cuecards = body.cuecards ;
    newpart.save() ; 
    res.redirect('/quanlydethi');
})

router.get('/speaking/:sid', (req, res, next) => {
    Speaking.findById(req.params.sid)
    .exec()
    .then( result => {
        if(result)
        {
            res.render('speakingdetail', { speaking: result, data: req.session.user });
        }
        else 
        {
            res.render('page_404', { message: "User not exist !" });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(200).json({
            error: err,
            code: "ma500"
        });
    });
})

router.get('/speaking/:sid/delete', (req, res, next) => { 
    const id = req.params.sid;
    Speaking.remove({
        _id: id
    })
        .exec()
        .then(result => {
            res.redirect('/quanlydethi');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.get('/speaking/:_id/edit', (req, res, next) => {
    Speaking.findById(req.params._id)
        .exec()
        .then(result => {
            if (result) {
                res.render('speakingupdate', { speaking: result, data:req.session.user });
            }
            else {
                res.render('admin/page_404', { message: "Speaking part not exist !" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.post('/speaking/:_id/edit', (req, res, next) => {
    const id = req.params._id;
    const updateOps = {};
    const input = req.body;
    for (const ops of Object.keys(input)) {
        updateOps[ops] = input[ops];
        console.log(ops + "  " + input[ops])
    }
    Speaking.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.redirect("/quanlydethi/speaking/"+id);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/themmoidethi/reading', (req, res, next) => {
    res.render('reading', data= req.session.user);
})

router.post('/themmoidethi/reading', (req, res, next) => {
    params = req.body ; 
    var newtest = new Reading() ; 
    newtest._id = new mongoose.Types.ObjectId;
    newtest.name = params.name ; 
    newtest.content = params.content; 
    newtest.author_id = req.session.user._id ; 
    newtest.explanation = params.explanation; 
    newtest.part_list = [] ; 
    newtest.save() 
    res.redirect('/quanlydethi/reading/'+newtest._id +'/addpart');
})

router.get('/reading/:_id', (req, res, next) => {
    Reading.findById(req.params._id)
    .exec()
    .then( result => {
        if(result)
        {
            res.render('readingdetail', { reading: result, data: req.session.user });
        }
        else 
        {
            res.render('page_404', { message: "Test not exist !" });
        }
    })
    .catch(err => {
        console.log(err);
        res.render('page_404', { message: "Test not exist !" });
    });
})

router.get('/reading/:_id/addpart', (req, res, next ) => { 
    Reading.findById(req.params._id, (err, reading) => {
        if (err)
            throw err ; 
        else 
        {
            res.render('addpart',{ data: req.session.user, readingtest: reading });
        }
    })
})

router.post('/reading/:_id/addpart', (req, res, next ) => {
    Reading.findById(req.params._id, (err, reading) => {
        if (err)
            throw err ; 
        else 
        {
            part_info = req.body ; 
            switch(part_info.type) 
            {
                case("UL"): 
                    res.status(200).json({
                        data: part_info 
                    });
                    // reading.part_list.push(UL(part_info, req.session.user.email));  
                    break;
                case("IN"): 
                    res.status(200).json({
                        data: "IN"
                    });
                    reading.part_list.push(IN(part_info, req.session.user.email));  
                    break; 
                case("RD"): 
                    res.status(200).json({
                        data: "RD"
                    });
                    reading.part_list.push(RD(part_info, req.session.user.email));  
                    break; 
                case("CB"): 
                    res.status(200).json({
                        data: "CB"
                    });
                    reading.part_list.push(CB(part_info, req.session.user.email));  
                    break; 
                case("FB"): 
                    res.status(200).json({
                        data: "FB"
                    });
                    reading.part_list.push(FB(part_info, req.session.user.email));  
                    break;     
            }
            reading.save() ; 
            res.render('addpart',{ data: req.session.user, readingtest: reading });
        }
    })
})




router.get('/themmoidethi/listening', (req, res, next) => {
    res.render('listening');
})

module.exports = router;