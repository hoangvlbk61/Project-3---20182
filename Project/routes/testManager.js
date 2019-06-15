const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Writing = require('../models/Writing');
const Speaking = require('../models/Speaking');
const Reading = require('../models/Reading');
const Listening = require('../models/Listening');
const User = require('../models/User');
const Part = require('../models/Part');
const auth = require('../api/middleware/checkAuth');
const perm = require('../api/middleware/checkPerm');

var MongoClient = require('mongodb').MongoClient;

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/audio/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});


function UL(variable, id){
    var part = new Part() ;
    part._id = new mongoose.Types.ObjectId(); 
    part.name = variable.name;
    part.author_id = id; 
    part.type = variable.type; 
    part.content = variable.content; 
    part.explanation = variable.explanation ; 
    for (const prop in variable) {
        if(prop.indexOf("ulqlist") == 0)
            part.questionlist.push(variable[prop]) ; 
        else if(prop.indexOf("ulalist") == 0 ) 
            part.answerlist.push(variable[prop]) ; 
        else if(prop.indexOf("ulslist") == 0 ) 
            part.selectlist.push(variable[prop]) ; 
    }
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
    for (const prop in variable) {
        if(prop.indexOf("inqlist") == 0)
            part.questionlist.push(variable[prop]) ; 
        else if(prop.indexOf("inalist") == 0 ) 
            part.answerlist.push(variable[prop]) ; 
    }
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
    for (const prop in variable) {
        if(prop.indexOf("ulqlist") == 0)
            part.questionlist.push(variable[prop]) ; 
        else if(prop.indexOf("ulalist") == 0 ) 
            part.answerlist.push(variable[prop]) ; 
        else if(prop.indexOf("ulslist") == 0 ) 
            part.selectlist.push(variable[prop]) ; 
    }
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
    part.questionlist.push(variable.question);
    part.answerlist.push(variable.answer);

    for (const prop in variable) 
    {
        if(prop.indexOf("ulslist") == 0 ) 
            part.selectlist.push(variable[prop]) ; 
    }
    part.save();
    return part; 
}

function FB(variable, id){
    console.log("GET IN FB ");
    var part = new Part() ;
    part.name = variable.name;
    part._id = new mongoose.Types.ObjectId(); 
    part.author_id = id; 
    part.type = variable.type; 
    part.content = variable.content; 
    part.explanation = variable.explanation ;
    var matches = part.content.match(/\[.*?\]/g);
    console.log(matches.length);
    
    for(var i = 0 ; i < matches.length; i ++ )
    {
        matches[i] = matches[i].slice(1,matches[i].length -2 );
    }
    part.answerlist = matches ; 
    part.save();
    console.log("Done IN FB ");
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
                                {
                                    Listening.find({}, (err, listeninglist) => {
                                        res.render('quanlydethi', { data:req.session.user, writinglist: writinglist,
                                            'speakinglist': speakinglist, 'readinglist':readinglist, 'listeninglist':listeninglist });
                                    } )
                                }
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

//READING

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
                    reading.part_list.push(UL(part_info, req.session.user.email));  
                    break;
                case("IN"): 
                    reading.part_list.push(IN(part_info, req.session.user.email));  
                    break; 
                case("RD"): 
                    reading.part_list.push(RD(part_info, req.session.user.email));  
                    break; 
                case("CB"): 
                    reading.part_list.push(CB(part_info, req.session.user.email));  
                    break; 
                case("FB"): 
                    reading.part_list.push(FB(part_info, req.session.user.email));  
                    break;     
            }
            reading.save() ; 
            res.render('addpart',{ data: req.session.user, readingtest: reading });
        }
    })
})

router.get('/reading/:pid/delete', (req, res, next) => { 
    const id = req.params.pid;
    Reading.remove({
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

router.get('/reading/:_id/edit', (req, res, next) => {
    Reading.findById(req.params._id)
        .exec()
        .then(result => {
            if (result) {
                res.render('readingupdate', { reading: result, data:req.session.user });
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

router.post('/reading/:_id/edit', (req, res, next) => {
    const id = req.params._id;
    const updateOps = {};
    const input = req.body;
    for (const ops of Object.keys(input)) {
        updateOps[ops] = input[ops];
        console.log(ops + "  " + input[ops])
    }
    Reading.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.redirect("/quanlydethi/reading/"+id);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//LISTENING

router.get('/themmoidethi/listening', (req, res, next) => {
    res.render('listening', data= req.session.user);
})

router.post('/themmoidethi/listening', upload.single('file'), (req, res, next) => {
    params = req.body ; 
    // res.status(200).json({
    //     form_data: req.body
    // });
    var newtest = new Listening() ; 
    newtest.audio = req.file.path ;
    newtest._id = new mongoose.Types.ObjectId;
    newtest.name = params.name ; 
    newtest.content = params.content; 
    newtest.author_id = req.session.user._id ; 
    newtest.explanation = params.explanation; 
    newtest.part_list = [] ; 
    newtest.save() 
    res.redirect('/quanlydethi/listening/'+newtest._id +'/addpart');
})

router.get('/listening/:_id', (req, res, next) => {
    Listening.findById(req.params._id)
    .exec()
    .then( result => {
        if(result)
        {
            res.render('listeningdetail', { listening: result, data: req.session.user });
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

router.get('/listening/:_id/addpart', (req, res, next ) => { 
    Listening.findById(req.params._id, (err, listening) => {
        if (err)
            throw err ; 
        else 
        {
            res.render('addpart',{ data: req.session.user, listeningtest: listening });
        }
    })
})

router.post('/listening/:_id/addpart', (req, res, next ) => {
    console.log("---------------------------------------------------------------------");
    console.log("LISTENING ADD PART !!! ")
    Listening.findById(req.params._id, (err, listening) => {
        if (err)
            throw err ; 
        else 
        {
            console.log("K co LOI ")
            part_info = req.body ; 
            console.log(part_info.type)
            switch(part_info.type) 
            {
                case("UL"): 
                    console.log("THISS ISS UL");
                    // res.status(200).json({
                    //     data: UL(part_info, req.session.user.email)
                    // })
                    listening.part_list.push(UL(part_info, req.session.user.email));  
                    break;
                case("IN"): 
                    console.log("THISS ISS IN");
                    listening.part_list.push(IN(part_info, req.session.user.email));  
                    break; 
                case("RD"): 
                    console.log("THISS ISS RD");
                    listening.part_list.push(RD(part_info, req.session.user.email));  
                    break; 
                case("CB"): 
                    console.log("THISS ISS CB");
                    listening.part_list.push(CB(part_info, req.session.user.email));  
                    break; 
                case("FB"): 
                    console.log("THISS ISS FB");
                    // res.status(200).json({
                    //     data: part_info 
                    // });
                    listening.part_list.push(FB(part_info, req.session.user.email));  
                    break;     
            }
            listening.save() ; 
            res.render('addpart',{ data: req.session.user, listeningtest: listening });
        }
    })
})


router.get('/themmoidethi/listening', (req, res, next) => {
    res.render('listening');
})

router.get('/listening/:pid/delete', (req, res, next) => { 
    const id = req.params.pid;
    Listening.remove({
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

router.get('/listening/:_id/edit', (req, res, next) => {
    Listening.findById(req.params._id)
        .exec()
        .then(result => {
            if (result) {
                res.render('listeningupdate', { listening: result, data:req.session.user });
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

router.post('/listening/:_id/edit', (req, res, next) => {
    const id = req.params._id;
    const updateOps = {};
    const input = req.body;
    for (const ops of Object.keys(input)) {
        updateOps[ops] = input[ops];
        console.log(ops + "  " + input[ops])
    }
    Listening.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.redirect("/quanlydethi/listening/"+id);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;