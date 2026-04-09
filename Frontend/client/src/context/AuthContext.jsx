import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize from local storage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);

        // Listen for auth:logout event from axiosInstance
        const handleLogoutEvent = () => {
            logout();
        };
        window.addEventListener('auth:logout', handleLogoutEvent);

        return () => {
            window.removeEventListener('auth:logout', handleLogoutEvent);
        };
    }, []);

    const login = async (userData) => {
        try {
            // Expecting { email, password } in userData
            const response = await axiosInstance.post('/auth/login', userData);
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(access_token);
            setUser(user);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const signup = async (userData) => {
        try {
            // userData should now include { username, email, password, gemini_api_key, key_nickname }
            const response = await axiosInstance.post('/auth/signup', userData);
            return response.data;
        } catch (error) {
            console.error("Signup failed", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
