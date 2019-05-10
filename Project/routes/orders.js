const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 

const Orders = require('../models/orders');
const Products = require('../models/products');

router.get('/', (req, res, next) => { 
    Orders.find()
    .select('product quantity _id')
    .exec()
    .then(docs => {
        res.statis(200).json({
            count: docs.length,
            orders: docs.map(doc=>{
                return { 
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity, 
                    request: {
                        type: 'GET',
                        url: 'htpp://localhost:3000/orders/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        console.log(err) ; 
        res.status(500).json({
            error: err 
        });
    }); 
});

router.post('/', (req, res, next) => {
    Products.findById(req.body.productId)
    .then(product => {
        if(!product) {
            res.status(404).json({
                message: 'Product not found'
            });
        }

        const order = new Orders({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        })

        order
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: ' Order stored ! ',
                    createdOrder: {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity
                    },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders' + result._id
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }) 
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            message: 'Product not found by id',
            error: err
        });
    })
    
});

router.get('/:orderId', (req, res, next) => {
    Orders.find(req.params.orderId)
    .exec()
    .then( order => {
        if(!order)
        {
            return res.status(404).json({
                message: "Order not found ! "
            })
        }
        res.status(200).json({
            order: order, 
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    });

});

router.delete('/:orderId', (req, res, next) => {
    Orders.remove({_id: req.params.orderId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'Remove ' + req.params.orderId + ' successfully' , 
            request:{
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {
                    productId: "String", 
                    quantity: "Number"
                }
            }
        });
    })
    .catch();
});

module.exports = router;