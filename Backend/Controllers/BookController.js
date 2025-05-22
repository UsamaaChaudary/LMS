const Book = require("../Models/BookModel");


const addBook = async (req, res) => {
  const { name, author, edition, language, availability } = req.body;

  if (!name || !author || !edition || !language || !availability) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newBook = new Book({ name, author, edition, language, availability });
    await newBook.save();
    res.status(201).json({ message: "Book added successfully!", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error });
  }
};



const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};



const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book" });
  }
};



module.exports = { addBook, getAllBooks, deleteBook };
