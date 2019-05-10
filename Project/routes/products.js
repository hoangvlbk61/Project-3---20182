const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/products');
const checkAuth = require('../middleware/check-auth');

router.get('/',checkAuth, (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const response = { 
                count : docs.length, 
                products : docs.map(doc => {
                    return { 
                        name: doc.name, 
                        price: doc.price, 
                        _id: doc._id,
                        request: { 
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/", checkAuth, (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product
        .save()
        .then(result => {
            console.log(result); 
            res.status(201).json({
                message: ' Created Products Successfully ! ',
                createdProduct: {
                    name: result.name,
                    price: result.price, 
                    _id: result._id,
                    request: { 
                        type:'GET',
                        url:'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => 
        {
            console.log(err) ; 
            res.status(500).json({
                error: err 
            });
        });

    
});

router.get('/:productId', (req, res, next)=>{
    const id = req.params.productId; 
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log("From the database", doc);
        if(doc)
        {
            res.status(200).json({
                product: doc, 
                request: { 
                    type: 'GET', 
                    url: 'http://localhost:3000/products/' 
                }
            });
        }
        else 
        { 
            res.status(500).json({
                message: "The provided Id is invalid ! "
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Products has id "+ id , 
                request: {
                    type: 'GET',
                    url:'http://localhost:3000/products/'+id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId ; 
    Product.remove({
        _id : id
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Deleted the product id " + id + " successfully ! " , 
            request: {
                type: 'POST' , 
                url: 'http://localhost:3000/products', 
                body : { 
                    name: "String" , 
                    price: "Number"
                }
            }
        })
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
module.exports = router ;