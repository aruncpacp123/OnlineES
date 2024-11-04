// src/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(sessionStorage.getItem("user"));
        if (savedUser) setUser(savedUser);
    }, []);

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}
