import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BookOpen, LogOut, User, LayoutDashboard, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <BookOpen size={24} className="logo-icon" />
                    <span className="logo-text">Aetheria Library</span>
                </Link>

                <div className="navbar-menu">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-item">
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </Link>
                            <Link to="/books" className="nav-item">
                                <BookOpen size={18} />
                                <span>Manage Books</span>
                            </Link>
                            <div className="nav-user-profile">
                                <User size={16} className="profile-icon" />
                                <span className="profile-name">{user.name}</span>
                                <button className="logout-btn" onClick={handleLogout} title="Logout">
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-item">
                                <LogIn size={18} />
                                <span>Login</span>
                            </Link>
                            <Link to="/register" className="nav-item">
                                <UserPlus size={18} />
                                <span>Register</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
