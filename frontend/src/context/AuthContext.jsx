import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decoding token to get username usage is optional, 
            // but we can assume user is logged in if token exists.
            // Ideally call an endpoint /me to get user details.
            setUser({ username: "User" }); // Placeholder
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log("Attempting login for:", email);
            const response = await api.post('/auth/login', { email, password });
            console.log("Login success:", response.data);
            localStorage.setItem('token', response.data);
            setUser({ email });
            return true;
        } catch (error) {
            console.error("Login failed detailed:", error);
            if (error.response) {
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error setting up request:", error.message);
            }
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const register = async (email, password) => {
        try {
            await api.post('/auth/register', { email, password });
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
