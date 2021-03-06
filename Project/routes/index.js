var express = require('express');
var bcrypt = require('bcrypt');
// var user_md=require("../models/user_c");
const User = require("../models/User");
var router = express.Router();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
// var chuyenthanhObjectId = require('mongodb').ObjectID;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'englishWebsite';

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.user) {
    res.redirect("/dashboard");
  }
  else
    res.redirect('login');
});

/* GET register */
router.get('/register', function (req, res, next) {
  if (req.session.user) {
    res.redirect("/dashboard" + req.session.user._id);
  }
  else
    res.render('login', { data: {} });
});

router.post("/register", function (req, res, next) {
  if(req.session.user) 
    res.redirect("dashboard") ; 
  else 
  {
    var data = req.body;
    if (data.email.trim().length == 0) {
      res.render('login/register', { error_msg: "Email is require"  });
    } else if (data.passwd != data.repasswd && data.passwd.trim().length != 0) {
      res.render('login/register', { error_msg: "Password not match"  });
    } else {
      User.findOne({ email: req.body.email, id: req.body.id })
        .exec()
        .then(user => {
          if (user) {
            console.log(user);
            return res.status(409).json({
              message: "User exists"
            });
          } else {
            console.log(req.body.password);
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                return res.status(500).json({
                  error: err
                });
              } else {
                var today = new Date();
                // Take the date of today !
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                today = mm + '/' + dd + '/' + yyyy;
                // Init the new user
                const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  // user_id: uid + 1,
                  firstname: req.body.firstname,
                  password: hash,
                  email: req.body.email,
                  lastname: req.body.lastname,
                  phonenumber: req.body.phonenumber,
                  workplace: req.body.workplace,
                  reputation: 0,
                  last_login: today,
                  is_active: true,
                  date_joined: today,
                  list_vocab: []
                });
                user
                  .save()
                  .then(result => {
                    console.log(result);
                    res.redirect('/login');
                  })
                  .catch(err => {
                    console.log(err);
                    res.status(500).json({
                      error: err
                    });
                  });
              }
            });
          }
        });
    }
  }
  }
)

/* GET  login*/
router.get('/login', function (req, res, next) {
  if (req.session.user)
  {
    res.redirect("/dashboard");
  }
  else 
    res.render("login", {error_msg: ""});
});

// Post login
router.post("/login", function (req, res, next) {
  var params = req.body;

  if (params._email.trim().length == 0) {
    res.render("login", { data: { error_msg: "Bạn chưa nhập dữ liệu" } });
  } else {
    User.find({ email: params._email },function (err,dulieu){
      var user=dulieu[0];
      if(user == undefined) 
      {
        res.render("login", { error_msg: "Tài khoản " + params._email + " chưa được đăng ký !"  });
      } 
      else 
      {
        bcrypt.compare(params._password, user.password, (err, ret) => {
          if(err) 
            throw (err) ; 
          else if(ret == false)
            res.render("login", { error_msg: "Mật khẩu không đúng !"  }); 
          else 
          {
            user.last_login = Date.now() ; 
            user.save();
            req.session.user = user;
            res.redirect("/dashboard");
          }
        })
      }
    });
  }
})

router.get("/logout",function(req,res,next){
  req.session.user=null;
  res.redirect("/login");
});


/* GET thêm dữ liệu */
router.get('/them', function (req, res, next) {
  res.render('CRUD/them', { data: {} });
});

/* Post thêm dữ liệu */
router.post('/them', function (req, res, next) {
  var data = req.body;
  if (!data.ten) {
    res.render('CRUD/them', { data: { err: "Name is not correct" } });
  } else if (!data.dt) {
    res.render('CRUD/them', { data: { err: "Phone is not correct" } });
  } else {


    var dulieu01 = {
      ten: data.ten,
      dt: data.dt
    }

    const insertDocuments = function (db, callback) {
      // Get the documents collection
      const collection = db.collection('nguoidung');
      // Insert some documents
      collection.insert(dulieu01, function (err, result) {
        assert.equal(err, null);
        console.log("Inserted into the collection");
        callback(result);
      });
    }

    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      const db = client.db(dbName);

      insertDocuments(db, function () {
        client.close();
      });
    });
    res.render('CRUD/them', { data: { err: "Thêm dữ liệu thành công" } });

  }

});

/* GET xem dữ liệu */
router.get('/xem', function (req, res, next) {

  const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs)
      callback(docs);
    });
  }

  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    const db = client.db(dbName);


    findDocuments(db, function (dulieu) {
      res.render('CRUD/xem', { data: dulieu });
      client.close();
    });

  });

});

/* Xoa du lieu . */
router.get('/xoa/:idcanxoa', function (req, res, next) {
  var idcanxoa = chuyenthanhObjectId(req.params.idcanxoa);
  //ham xoa 
  const xoacontact = function (db, callback) {
    const collection = db.collection('nguoidung');
    collection.deleteOne({ _id: idcanxoa }, function (err, result) {
      assert.equal(err, null);
      console.log("Xoa thanh cong ");

      callback(result);

    });
  }
  // ket noi mongo
  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
    xoacontact(db, function () {
      client.close();
      res.redirect('/xem');
    });
  });


});  // end xoa du lieu 

// sua du lieu

router.get('/sua/:idcansua', function (req, res, next) {
  var idcansua = chuyenthanhObjectId(req.params.idcansua);

  //ham tim kiem
  const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Find some documents
    collection.find({ _id: idcansua }).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs);
      callback(docs);
    });
  }

  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    const db = client.db(dbName);


    findDocuments(db, function (dulieu) {
      console.log(dulieu);
      res.render('CRUD/sua', { data: dulieu });
      client.close();
    });

  });



});


//sua du lieu

router.post('/sua/:idcansua', function (req, res, next) {
  var idcansua = chuyenthanhObjectId(req.params.idcansua);

  var dulieu01 = {
    ten: data.ten,
    dt: data.dt
  }

  const updateDocument = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ _id: idcansua }
      , { $set: dulieu01 }, function (err, result) {
        assert.equal(err, null);
        console.log("Updated ");
        callback(result);
      });
  }

  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);


    updateDocument(db, function () {
      client.close();
      res.redirect('/xem');
    });
  });


});  // end sua du lieu 
module.exports = router;