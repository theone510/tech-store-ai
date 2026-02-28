"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("iraqtech_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        const adminToken = localStorage.getItem("admin_token");
        if (adminToken) {
            setIsAdmin(true);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("iraqtech_user", JSON.stringify(userData));
        setIsLoginModalOpen(false);
    };

    const loginAsAdmin = (token) => {
        setIsAdmin(true);
        localStorage.setItem("admin_token", token);
        setIsLoginModalOpen(false);
    };

    const logout = () => {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem("iraqtech_user");
        localStorage.removeItem("admin_token");
    };

    return (
        <UserContext.Provider value={{ user, isAdmin, login, loginAsAdmin, logout, isLoginModalOpen, setIsLoginModalOpen }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
