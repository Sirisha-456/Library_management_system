import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Plus, Search, Edit2, Trash2, X, AlertCircle } from "lucide-react";

const BookCatalog = () => {
    const { user } = useContext(AuthContext);
    
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [selectedBookId, setSelectedBookId] = useState(null);

    // Form fields
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    const fetchBooks = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/books");
            if (response.ok) {
                const data = await response.json();
                setBooks(data);
            } else {
                setError("Failed to fetch books from server");
            }
        } catch {
            setError("Server connection error. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBooks();
    }, []);

    const handleOpenAddModal = () => {
        setModalMode("add");
        setTitle("");
        setAuthor("");
        setCategory("");
        setQuantity(1);
        setError("");
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (book) => {
        setModalMode("edit");
        setSelectedBookId(book._id);
        setTitle(book.title);
        setAuthor(book.author);
        setCategory(book.category || "");
        setQuantity(book.quantity || 0);
        setError("");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBookId(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!title || !author) {
            setError("Title and Author are required fields");
            return;
        }

        setSubmitting(true);
        
        const url = modalMode === "add" 
            ? "http://localhost:5000/api/books" 
            : `http://localhost:5000/api/books/${selectedBookId}`;
            
        const method = modalMode === "add" ? "POST" : "PUT";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({ title, author, category, quantity })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(`Book successfully ${modalMode === "add" ? "added" : "updated"}`);
                handleCloseModal();
                fetchBooks();
                
                // Clear success toast after 3s
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(data.message || "Failed to process book operation");
            }
        } catch {
            setError("Network connection failure");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBook = async (id, bookTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            const response = await fetch(`http://localhost:5000/api/books/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Book successfully deleted");
                fetchBooks();
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(data.message || "Failed to delete book");
            }
        } catch {
            setError("Network connection failure");
        }
    };

    // Filter books based on search term
    const filteredBooks = books.filter(book => 
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div className="catalog-header">
                <div>
                    <h2 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.5px" }}>Manage Library Catalog</h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
                        View, search, create, and update book documents in real time.
                    </p>
                </div>
            </div>

            {success && (
                <div className="alert alert-success">
                    <span>{success}</span>
                </div>
            )}

            {error && !isModalOpen && (
                <div className="alert alert-danger">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Actions Bar */}
            <div className="card" style={{ padding: "1.25rem", marginBottom: "2rem" }}>
                <div className="catalog-actions">
                    <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
                        <Search size={18} style={{ position: "absolute", left: "12px", color: "var(--text-muted)" }} />
                        <input
                            type="text"
                            placeholder="Search by title, author, or category..."
                            className="form-control search-bar"
                            style={{ paddingLeft: "2.5rem" }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn" onClick={handleOpenAddModal}>
                        <Plus size={18} />
                        <span>Add New Book</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
                    <div className="spinner"></div>
                </div>
            ) : filteredBooks.length === 0 ? (
                <div className="card empty-state">
                    <AlertCircle size={48} className="empty-state-icon" />
                    <h3>No books found</h3>
                    <p style={{ marginTop: "0.5rem" }}>
                        {searchTerm ? "Try searching for a different keyword." : "Your library catalog is empty. Add your first book!"}
                    </p>
                </div>
            ) : (
                <div className="books-grid">
                    {filteredBooks.map((book) => (
                        <div key={book._id} className="card book-card">
                            <div className="book-header">
                                {book.category && (
                                    <span className="book-category">{book.category}</span>
                                )}
                                <h3 className="book-title">{book.title}</h3>
                                <p className="book-author">by {book.author}</p>
                            </div>
                            
                            <div className="book-footer">
                                <div className="book-quantity">
                                    <span>Quantity:</span>
                                    <span className={`quantity-num ${book.quantity <= 0 ? "out-of-stock" : ""}`}>
                                        {book.quantity <= 0 ? "Out of Stock" : book.quantity}
                                    </span>
                                </div>

                                <div className="book-actions">
                                    <button 
                                        className="action-btn edit" 
                                        onClick={() => handleOpenEditModal(book)} 
                                        title="Edit Book Details"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        className="action-btn delete" 
                                        onClick={() => handleDeleteBook(book._id, book.title)} 
                                        title="Delete Book"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="card modal-content">
                        <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h3 style={{ fontSize: "1.4rem", fontWeight: "700", flex: 1 }}>
                                {modalMode === "add" ? "Add Book Entry" : "Modify Book details"}
                            </h3>
                            <button 
                                onClick={handleCloseModal} 
                                style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {error && (
                            <div className="alert alert-danger" style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="book-title">Book Title</label>
                                <input
                                    type="text"
                                    id="book-title"
                                    className="form-control"
                                    placeholder="Enter book title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="book-author">Author Name</label>
                                <input
                                    type="text"
                                    id="book-author"
                                    className="form-control"
                                    placeholder="Enter author's name"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="book-category">Genre / Category</label>
                                <input
                                    type="text"
                                    id="book-category"
                                    className="form-control"
                                    placeholder="e.g. Fiction, Science, Biography"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="book-quantity">Quantity Available</label>
                                <input
                                    type="number"
                                    id="book-quantity"
                                    className="form-control"
                                    min="0"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn" style={{ flex: 1 }} disabled={submitting}>
                                    <span>{submitting ? "Saving..." : "Save Changes"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookCatalog;
