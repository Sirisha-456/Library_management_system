const Book = require("../models/Book");

// @desc Get all books
// @route GET /api/books
// @access Public
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.json(books);
    } catch (error) {
        console.error("Get books error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Add a new book
// @route POST /api/books
// @access Private
exports.addBook = async (req, res) => {
    try {
        const { title, author, category, quantity } = req.body;

        if (!title || !author) {
            return res.status(400).json({ message: "Please provide title and author" });
        }

        const book = new Book({
            title,
            author,
            category: category || "Uncategorized",
            quantity: quantity !== undefined ? Number(quantity) : 1
        });

        await book.save();
        res.status(201).json(book);
    } catch (error) {
        console.error("Add book error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Update a book
// @route PUT /api/books/:id
// @access Private
exports.updateBook = async (req, res) => {
    try {
        const { title, author, category, quantity } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.category = category || book.category;
        book.quantity = quantity !== undefined ? Number(quantity) : book.quantity;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        console.error("Update book error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Delete a book
// @route DELETE /api/books/:id
// @access Private
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted" });
    } catch (error) {
        console.error("Delete book error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};