const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    oroduct: {
        type: mongoose.Schema.Types.ObjectId, 
        red: 'Product'
    },
    quantity: { 
        type: Number, 
        default: 1 
    }
})

module.exports = mongoose.model('Orders', orderSchema);