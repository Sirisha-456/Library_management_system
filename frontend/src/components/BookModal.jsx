import { useState, useEffect } from "react";
import { X } from "lucide-react";

const BookModal = ({ isOpen, onClose, onSuccess, mode, book, token }) => {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "",
        quantity: 1
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Populate form data when modal opens or book changes
    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                title: book?.title || "",
                author: book?.author || "",
                category: book?.category || "",
                quantity: book?.quantity !== undefined ? book.quantity : 1
            });
            setError("");
        }
    }, [isOpen, book]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "quantity" ? parseInt(value) || 0 : value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.title || !formData.author) {
            setError("Title and Author are required fields");
            return;
        }

        setSubmitting(true);
        
        const url = mode === "add" 
            ? "http://localhost:5000/api/books" 
            : `http://localhost:5000/api/books/${book._id}`;
            
        const method = mode === "add" ? "POST" : "PUT";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                onSuccess(`Book successfully ${mode === "add" ? "added" : "updated"}`);
            } else {
                setError(data.message || "Failed to process book operation");
            }
        } catch {
            setError("Network connection failure");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="card modal-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: "700", flex: 1 }}>
                        {mode === "add" ? "Add Book Entry" : mode === "edit" ? "Modify Book details" : "Book Details"}
                    </h3>
                    <button 
                        onClick={onClose} 
                        style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger" style={{ padding: "0.6rem 1rem", fontSize: "0.85rem", marginBottom: "1rem" }}>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="book-title">Book Title</label>
                        <input
                            type="text"
                            id="book-title"
                            name="title"
                            className="form-control"
                            placeholder="Enter book title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            disabled={mode === "view"}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="book-author">Author Name</label>
                        <input
                            type="text"
                            id="book-author"
                            name="author"
                            className="form-control"
                            placeholder="Enter author's name"
                            value={formData.author}
                            onChange={handleChange}
                            required
                            disabled={mode === "view"}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="book-category">Genre / Category</label>
                        <input
                            type="text"
                            id="book-category"
                            name="category"
                            className="form-control"
                            placeholder="e.g. Fiction, Science, Biography"
                            value={formData.category}
                            onChange={handleChange}
                            disabled={mode === "view"}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="book-quantity">Quantity Available</label>
                        <input
                            type="number"
                            id="book-quantity"
                            name="quantity"
                            className="form-control"
                            min="0"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            disabled={mode === "view"}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
                            {mode === "view" ? "Close" : "Cancel"}
                        </button>
                        {mode !== "view" && (
                            <button type="submit" className="btn" style={{ flex: 1 }} disabled={submitting}>
                                <span>{submitting ? "Saving..." : "Save Changes"}</span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookModal;
