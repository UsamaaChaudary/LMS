const express = require('express');
const { addItem, deleteItem, getItems, getNewOrders , placeOrder } = require('../Controllers/canteenController');
const router = express.Router();


router.post('/add-item', addItem);
router.delete('/delete-item/:itemId', deleteItem);
router.get('/items', getItems);
router.get('/new-orders', getNewOrders);
router.post('/order', placeOrder);




module.exports = router;
