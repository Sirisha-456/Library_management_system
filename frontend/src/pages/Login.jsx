import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogIn, Mail, Lock } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!email || !password) {
            setError("All fields are required");
            return;
        }

        setSubmitting(true);
        const result = await login(email, password);
        setSubmitting(false);

        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="form-card card">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Login to access your Aetheria Library account</p>

            {error && (
                <div className="alert alert-danger">
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="btn" style={{ width: "100%", marginTop: "1rem" }} disabled={submitting}>
                    <LogIn size={18} />
                    <span>{submitting ? "Signing in..." : "Sign In"}</span>
                </button>
            </form>

            <div className="form-footer">
                Don't have an account? 
                <Link to="/register" className="form-link">Register here</Link>
            </div>
        </div>
    );
};

export default Login;
