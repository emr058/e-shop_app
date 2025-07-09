import { createContext, useState, useContext ,useEffect} from "react";

const AuthContext = createContext();
export const AuthProvider = ({children}) => {
const [username, setUsername] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    try {
        const savedUser = localStorage.getItem("username");
        if(savedUser){
            const parsed = JSON.parse(savedUser);
            if(parsed && parsed.username) {
                setUsername(parsed.username);
            }
        }
    } catch (error) {
        console.error("Kullanıcı verilerini yüklerken hata:", error);
        // Hatalı veriyi temizle
        localStorage.removeItem("username");
    }
    setLoading(false);
}, []);

if(loading){
    return null;
}

const login = (usernameInput) => {
    try {
        localStorage.setItem("username", JSON.stringify({username: usernameInput}));
        setUsername(usernameInput);
    } catch (error) {
        console.error("Kullanıcı verilerini kaydederken hata:", error);
        alert("Giriş işleminde bir hata oluştu. Lütfen tekrar deneyin.");
    }
};

const logout = () => {
    try {
        alert("Çıkış yapıldı.");
        localStorage.removeItem("username");        
        setUsername(null);
    } catch (error) {
        console.error("Çıkış işleminde hata:", error);
        // Yine de state'i temizle
        setUsername(null);
    }
};

return <AuthContext.Provider value={{username, login, logout}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);