import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                if (parsed && parsed.id) {
                    setUser(parsed);
                }
            }
        } catch (error) {
            console.error("Kullanıcı verilerini yüklerken hata:", error);
            localStorage.removeItem("user");
        }
        setLoading(false);
    }, []);

    if (loading) {
        return null;
    }

    const login = async (email, password) => {
        try {
            const userData = await api.login(email, password);
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            return { success: true, user: userData };
        } catch (error) {
            console.error("Giriş işleminde hata:", error);
            return { 
                success: false, 
                error: error.response?.data?.error || "Giriş işleminde bir hata oluştu." 
            };
        }
    };

    const register = async (userData) => {
        try {
            const newUser = await api.register(userData);
            localStorage.setItem("user", JSON.stringify(newUser));
            setUser(newUser);
            return { success: true };
        } catch (error) {
            console.error("Kayıt işleminde hata:", error);
            return { 
                success: false, 
                error: error.response?.data?.error || "Kayıt işleminde bir hata oluştu." 
            };
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem("user");
            setUser(null);
        } catch (error) {
            console.error("Çıkış işleminde hata:", error);
            setUser(null);
        }
    };

    const updateUser = (updatedData) => {
        try {
            const updatedUser = { ...user, ...updatedData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true };
        } catch (error) {
            console.error("Kullanıcı güncelleme hatası:", error);
            return { success: false, error: "Güncelleme işleminde bir hata oluştu." };
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                loading,
                login, 
                register, 
                logout,
                updateUser,
                isAuthenticated: !!user 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);