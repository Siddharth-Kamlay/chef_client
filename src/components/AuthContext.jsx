import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        setToken(localStorage.getItem('token'));
    }, []);

    const isAuthenticated = !!token; 

    const login = async (email, password) => {
        try {
            const res = await axios.post('https://chef-server-kchf.onrender.com/api/login', { email, password });
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            return true;
        } catch (error) {
            console.error('Login failed:', error.response.data.msg);
            return false;
        }
    };

    const signup = async (username, email, password) => {
        try {
            const res = await axios.post('https://chef-server-kchf.onrender.com/api/signup', { username, email, password });
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            return true;
        } catch (error) {
            console.error('Signup failed:', error.response.data.msg);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ token, login, signup, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;