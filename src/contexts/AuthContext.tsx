"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/session";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await fetch("/api/auth/session", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const userData = await response.json();
                if (userData) {
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } else {
                // Para cualquier error HTTP, simplemente no hay usuario
                setUser(null);
            }
        } catch (error) {
            // Solo mostrar error si no es un problema de red común
            if (error instanceof TypeError && error.message.includes("fetch")) {
                console.warn(
                    "Network error fetching user session - this is normal if not logged in"
                );
            } else {
                console.error("Error fetching user session:", error);
            }
            setUser(null);
        }
    };

    useEffect(() => {
        const initializeUser = async () => {
            await fetchUser();
            setLoading(false);
        };

        initializeUser();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
