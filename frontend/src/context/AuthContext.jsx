import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("library_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing stored user info:", e);
                localStorage.removeItem("library_user");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("library_user", JSON.stringify(data));
                setUser(data);
                return { success: true };
            } else {
                return { success: false, message: data.message || "Invalid login credentials" };
            }
        } catch (error) {
            return { success: false, message: "Server connection failed" };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("library_user", JSON.stringify(data));
                setUser(data);
                return { success: true };
            } else {
                return { success: false, message: data.message || "Registration failed" };
            }
        } catch (error) {
            return { success: false, message: "Server connection failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("library_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
