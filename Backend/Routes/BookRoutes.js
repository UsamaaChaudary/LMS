const express = require('express');
const { addBook , getAllBooks , deleteBook } = require('../Controllers/bookController');
const router = express.Router();

router.post('/add-book', addBook);
router.get('/available-books', getAllBooks);
router.delete('/delete-books/:id', deleteBook);

module.exports = router;
