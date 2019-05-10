var express = require('express');
var user_md=require("../models/user_c");
const User = require("../models/User");
var router = express.Router();


const MongoClient = require('mongodb').MongoClient;
var chuyenthanhObjectId = require('mongodb').ObjectID;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'englishWebsite';



router.get('/', function (req, res, next) {
  
  if (! req.session.user) {
      res.redirect("/login");
  }
  else {
    var id = req.session.user._id ; 
    User.findById(id, function (err, dulieu) {
      if(err)
        throw(err)
      else
        res.render("index", { data: dulieu });
    })
  }
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    if(req.session.user){
        var id= chuyenthanhObjectId(req.params.id);
        User.findById(id,function(err,dulieu){
          res.redirect("/dashboard");
          // res.render("index",{data:dulieu});
        })
      }else{
        res.redirect("/login");
      }     
});

/* GET dat muc tieu */
router.get('/datmuctieu/:id', function (req, res, next) {
    if(req.session.user){
      var id= chuyenthanhObjectId(req.params.id);
    
      user_md.findById(id,function(err,dulieu){
        res.render("dashboard/datmuctieu",{data:dulieu});
      })
     
    }else{
      res.redirect("/login");
    }
  });

  router.post("/datmuctieu",function(req,res){

    if(req.session.user){
     var data=req.body;
     var idcansua=chuyenthanhObjectId(req.session.user._id);
     user_md.findById(idcansua,function(err,dulieu){
       dulieu.entry_score=data.entry_score;
       dulieu.target_score=data.target_score;
       dulieu.start_study=new Date();
       dulieu.save();
       req.session.user=dulieu;
     });
  
     res.redirect("/dashboard/"+req.session.user._id);
    }else{
      res.redirect("/login");
    }
  });
  

  router.get('/capnhatmuctieu/:id',function(req,res,next){
    if(req.session.user){
      var id= chuyenthanhObjectId(req.params.id);
    
      user_md.findById(id,function(err,dulieu){
        res.render("dashboard/capnhatmuctieu",{data:dulieu,error:null});
      })
     
    }else{
      res.redirect("/login");
    }
   
  })

  router.post('/capnhatmuctieu/:id',function(req,res,next){
    if(req.session.user){

      var new_target_score=req.body.target_score;
        var id=chuyenthanhObjectId(req.params.id);
        user_md.findById(id,function(err,dulieu){

          if(dulieu.entry_score>new_target_score || new_target_score>990){
            res.render("dashboard/capnhatmuctieu",{data:dulieu,error:"Điểm mục tiêu không hơp lệ"});

          }else{
            dulieu.target_score=new_target_score;
            dulieu.save();
            req.session.user=dulieu;
            res.redirect("/dashboard/"+dulieu._id);
            

          }

        });
        
    }else{
      res.redirect("/login");
    }
  })

module.exports = router;
