const mongoose = require('mongoose');

const canteenOrderSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    department: {
        type: String
    },
    semester: {
        type: Number
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CanteenItem', 
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    }
});

const Order = mongoose.model('Order', canteenOrderSchema);

module.exports = Order;
