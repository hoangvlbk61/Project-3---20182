// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const User = require('../models/user');
// var MongoClient = require('mongodb').MongoClient;


// router.get('/', (req, res, next) => {
//     MongoClient.connect(process.env.MONGO_ATLAS_PATH, { useNewUrlParser: true }, function (err, db) {
//         if(err) throw err ; 
//         else { 
//             var dbo = db.db("ESS");
//             dbo.collection("users").find().toArray((err, result) => {
//                 res.render("admin/quanlythanhvien", { list_user: result });
//                 db.close();
//             });
//         }
//     });  
// })

// router.get('/themmoithanhvien', (req, res, next) => {
//     res.render('admin/themmoithanhvien');
// })

// router.get('/:_id', (req, res, next) => {
//     User.findById(req.params._id)
//     .exec()
//     .then( result => {
//         if(result)
//         {
//             res.render('admin/chitietthanhvien', { user: result});
//         }
//         else 
//         {
//             res.render('admin/page_404', { message: "User not exist !" });
//         }
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });
// })

// router.get('/:_id/capnhatthongtinthanhvien', (req, res, next) => {
//     User.findById(req.params._id)
//         .exec()
//         .then(result => {
//             if (result) {
//                 res.render('admin/capnhatthongtinthanhvien', { user: result });
//             }
//             else {
//                 res.render('admin/page_404', { message: "User not exist !" });
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// })

// router.post('/:_id/capnhatthongtinthanhvien', (req, res, next) => {
//     const id = req.params._id;
//     const updateOps = {};
//     const input = req.body;
//     for (const ops of Object.keys(input)) {
//         updateOps[ops] = input[ops];
//         console.log(ops + "  " + input[ops] )
//     }
//     User.update({ _id: id }, { $set: updateOps })
//         .exec()
//         .then(result => {
//             res.redirect("../:_id");
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

// router.get('/:uid/delete', (req, res, next) => {
//     const id = req.params.uid;
//     User.remove({
//         _id: id
//     })
//         .exec()
//         .then(result => {
//             res.redirect('../../quanlythanhvien');
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

// router.post("/themmoithanhvien", (req, res, next) => {
//     var uid ; 
//     console.log("SO LUONG BAN GHI LA: " + uid);
//     MongoClient.connect(process.env.MONGO_ATLAS_PATH, { useNewUrlParser: true }, function (err, db) {
//         var dbo = db.db("ESS");
//         dbo.collection("users").find().toArray((err, result) => {
//             uid = result.length;
//             console.log("UID = " + uid); 
//             //
//             User.findOne({ email: req.body.email, id: req.body.id })
//                 .exec()
//                 .then(user => {
//                     if (user) {
//                         console.log(user);
//                         return res.status(409).json({
//                             message: "User exists"
//                         });
//                     } else {
//                         console.log(req.body.password);
//                         bcrypt.hash(req.body.password, 10, (err, hash) => {
//                             if (err) {
//                                 return res.status(500).json({
//                                     error: err
//                                 });
//                             } else {
//                                 var today = new Date();
//                                 // Take the date of today !
//                                 var dd = String(today.getDate()).padStart(2, '0');
//                                 var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//                                 var yyyy = today.getFullYear(); 
//                                 today = mm + '/' + dd + '/' + yyyy;
//                                 // Init the new user
//                                 const user = new User({
//                                     _id: new mongoose.Types.ObjectId(),
//                                     // user_id: uid + 1,
//                                     id: req.body.id,
//                                     password: hash,
//                                     email: req.body.email,
//                                     username: req.body.username,
//                                     phonenumber: req.body.phonenumber,
//                                     workplace: req.body.workplace,
//                                     reputation: 0,
//                                     last_login: today,
//                                     is_superuser: (req.body.is_superuser === "yes" ? true : false),
//                                     is_active: true,
//                                     date_joined: today,
//                                     list_vocab: []
//                                 });
//                                 user
//                                     .save()
//                                     .then(result => {
//                                         console.log(result);
//                                         res.redirect('/quanlythanhvien');
//                                     })
//                                     .catch(err => {
//                                         console.log(err);
//                                         res.status(500).json({
//                                             error: err
//                                         });
//                                     });
//                             }
//                         });
//                     }
//                 });
//                 //

//         });
//     });
//     //
// });

// module.exports = router;