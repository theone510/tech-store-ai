"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("iraqtech_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("iraqtech_user", JSON.stringify(userData));
        setIsLoginModalOpen(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("iraqtech_user");
    };

    return (
        <UserContext.Provider value={{ user, login, logout, isLoginModalOpen, setIsLoginModalOpen }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
