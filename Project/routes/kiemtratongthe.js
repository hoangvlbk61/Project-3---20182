const express = require('express');
const router = express.Router();
let Part=require('../models/Part')
let MediaPart = require('../models/Mediapart')

// router.all('*', auth); 

router.get('/',(req,res)=>{
res.render('kiemtratongthe',{
    data:{
        firstname:"Sgdsfg",
        lastname:"dfdsf",
        part:0
    }
})
})
router.get('/:id_exam',(req,res)=>{
    //lấy dữ liệu của các phân tương ứng cua đề thi với id dc truyền vào params
    //lấy dữ liệu của phần listening 
    if(req.query.action=="listening"){
   Part.find({
       id_exam:req.params.id_exam,
       action:req.query.action
   },(err,ok)=>{
    //    console.log(ok.filter(x=>{return x.part==1})[0]['audio_src'])
      res.render('kiemtratongthelistening',{
          data:{
              lastname:"Test",
              firstname:"test",
              id:222
          },
          //trả dữ liệu vè các part tương ứng
          part1:ok.filter(x=>{return x.part==1})[0],
          part2:ok.filter(x=>{return x.part==2})[0],
          part3:ok.filter(x=>{return x.part==3})[0],
          part4:ok.filter(x=>{return x.part==4})[0]
      })
   })
    }
    if(req.query.action=="reading"){
        //lấy  dữ lieeij reading
        Part.find({
            id_exam:req.params.id_exam,
            action:'reading'
        },(err,ok)=>{
            res.render('kiemtratongthereading',{
                data:{
                    lastname:"Test",
                    firstname:"test",
                    id:213354
                },
                //tra dữ liệu về các part tương ứng
                part5:ok.filter(x=>{return x.part==5})[0],
                part6:ok.filter(x=>{return x.part==6})[0],
                part7:ok.filter(x=>{return x.part==7})[0],
            })
        })
    }
    if(req.query.action=="speaking"){
        //lấy dữ liệu của speaking
        Part.find({
            id_exam:req.params.id_exam,
            action:req.query.action
        },(err,ok)=>{
            res.render('kiemtratongthespeaking',{
                data:{
                    lastname:"sdfsd",
                    firstname:"Ddfsdf",
                    id:3333
                },
                part8:ok.filter(x=>{return x.part==8})[0]
            })
        })
    }
    if(req.query.action=="writting"){
        //lấy dữ liệu cảu writting
        Part.find({
            id_exam:req.params.id_exam,
            action:req.query.action
        },(err,ok)=>{
            res.render('kiemtratongthewritting',{
                data:{
                    lastname:"sdfsd",
                    firstname:"Ddfsdf",
                    id:3333
                },
                part9:ok.filter(x=>{return x.part==9})[0]
            })
        })
    }
   
})
router.post('/:id_exam/check',(req,res)=>{
    //check kết quả của phần tương ứng của đề thi với id đề dc truyền vào params,
    let data=[] 
    let corr=[]
    if(req.query.action=="listening"){
        //check kết quả của listening 
        //lấy dữ liệu của phần listening
        Part.find({
            id_exam:req.params.id_exam,
            action:req.query.action
        },(err,ok)=>{
            //check từng câu, câu đúng dc thêm vào mảng corr
            ok.map(x=>{
                x.data.map(y=>{
                    if(req.query[y.id_cauhoi]){
                        if(req.query[y.id_cauhoi]==y.answer){
                             corr.push(y.id_cauhoi)
                        }
                    }
                })
            })
            
          res.json(corr)
        })
       
    }
    if(req.query.action=='reading'){
        Part.find({
            id_exam:req.params.id_exam,
            action:req.query.action
        },(err,ok)=>{
          
            //check từng câu, câu đúng dc thêm vào mảng corr
            ok.map(x=>{
                x.data.map(y=>{
                    if(req.query[y.id_cauhoi]){
                        if(req.query[y.id_cauhoi]==y.answer){
                             corr.push(y.id_cauhoi)
                        }
                    }
                })
            })
            
          res.json(corr)
        })
    }
    if(req.query.action=="speaking"){
        //gủi url file media lên server 
        let data= new MediaPart({
            id_exam:req.params.id_exam,
            url:req.query.url,
            part:8,
            author:""
        })
        data.save((err)=>{
           
        }) 
        res.json("ok")
    }
    if(req.query.action=="writting"){
        //gủi url file media lên server 
        let data= new MediaPart({
            id_exam:req.params.id_exam,
            url:req.query.url,
            part:9,
            author:""
        })
        data.save((err)=>{
            
        })
        res.json("ok")
    }
    
    
})





module.exports = router