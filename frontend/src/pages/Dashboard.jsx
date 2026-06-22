import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BookOpen, Tag, AlertTriangle, ArrowRight } from "lucide-react";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/books");
                if (response.ok) {
                    const data = await response.json();
                    setBooks(data);
                }
            } catch (error) {
                console.error("Error fetching dashboard statistics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Derived statistics
    const totalBooksCount = books.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
    const uniqueTitles = books.length;
    const categoriesCount = new Set(books.map(b => b.category?.trim().toLowerCase()).filter(Boolean)).size;
    const outOfStock = books.filter(b => !b.quantity || b.quantity <= 0).length;

    return (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div className="hero" style={{ alignItems: "flex-start", textAlign: "left", margin: "1rem 0 3rem 0" }}>
                <h1>Welcome, {user?.name || "Librarian"}!</h1>
                <p>Manage, catalog, and scale your library inventory seamlessly with Aetheria Library System.</p>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    {/* Metrics Dashboard */}
                    <div className="stats-grid">
                        <div className="card stat-card">
                            <div className="stat-icon">
                                <BookOpen size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Total Copies</span>
                                <span className="stat-value">{totalBooksCount}</span>
                            </div>
                        </div>

                        <div className="card stat-card">
                            <div className="stat-icon green">
                                <BookOpen size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Unique Books</span>
                                <span className="stat-value">{uniqueTitles}</span>
                            </div>
                        </div>

                        <div className="card stat-card">
                            <div className="stat-icon">
                                <Tag size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Categories</span>
                                <span className="stat-value">{categoriesCount || 1}</span>
                            </div>
                        </div>

                        <div className="card stat-card">
                            <div className="stat-icon orange">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Out of Stock</span>
                                <span className="stat-value">{outOfStock}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Panel */}
                    <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
                        <div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.5rem" }}>Explore and Manage the Library Catalog</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                                Add new arrivals, edit quantities, assign categories, or remove books.
                            </p>
                        </div>
                        <Link to="/books" className="btn">
                            <span>Go to Book Catalog</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
