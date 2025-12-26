import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await axios.get('/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                } catch (err) {
                    setError("Failed to fetch user data");
                    localStorage.removeItem("token");
                }
            }
            setIsLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const res = await axios.post('/api/auth/login', credentials);
            const { token, ...userData } = res.data;
            localStorage.setItem("token", token);
            setUser(userData);
            setError('');
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Login failed";
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const register = async (credentials) => {
        try {
            const res = await axios.post('/api/auth/register', credentials);
            const { token, ...userData } = res.data;
            localStorage.setItem("token", token);
            setUser(userData); // userData chứa: id, name, email
            setError('');
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Registration failed";
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setError('');
    };

    const value = {
        user,
        setUser,
        error,
        setError,
        isLoading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
