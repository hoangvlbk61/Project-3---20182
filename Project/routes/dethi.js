var express = require('express');
var partI_md=require("../models/partI");
var router = express.Router();


const MongoClient = require('mongodb').MongoClient;
var chuyenthanhObjectId = require('mongodb').ObjectID;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'englishWebsite';

/* GET home page. */
router.get('/', function (req, res, next) {


  partI_md.find({},function(err,data){
   
    res.render("dethi/danhsachdethi",{data:data});

  })

});


router.get('/list_part1', function (req, res, next) {


  partI_md.find({},function(err,data){
   
    res.render("dethi/dsPart1",{data:data});

  })

});



/* GET home page. */
router.get('/part1/:id', function (req, res, next) {
  var id=chuyenthanhObjectId(req.params.id);

  partI_md.findById(id,function(err,dethi){
    res.render('dethi/listening/part1',{dethi:dethi});
  })
 

  

});

router.post('/part1/:id', function (req, res) {
  var id=chuyenthanhObjectId(req.params.id);

  partI_md.findById(id,function(err,dethi){
    var q_list = [];
   
    let i=1;
    
    dethi.PartI.bo_cau_hoi.forEach(function (cauhoi) {
      let a='a'+i;
      var item = {
        iq_id: cauhoi.id_cauhoi,
        explain: cauhoi.explain
      };
  
      if (cauhoi[a] == req.body[a]) {
        item.result = 1;
      } else {
        item.result = 0;
      }
      i++;
  
      q_list.push(item);
    })
  
    
    res.json({ q_list: q_list });
   
  });
    
  
  })

module.exports=router;

