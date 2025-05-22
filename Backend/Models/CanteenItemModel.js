const mongoose = require('mongoose');

const canteenItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amountAvailable: { type: Number, required: true },
    price: { type: Number, required: true },
    companyName: { type: String, required: true },
    preparationTime: { type: String, required: true },
});

module.exports = mongoose.model('CanteenItem', canteenItemSchema);
