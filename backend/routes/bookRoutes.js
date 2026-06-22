const router = require("express").Router();
const { getBooks, addBook, updateBook, deleteBook } = require("../controllers/bookController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getBooks);
router.post("/", protect, addBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;
