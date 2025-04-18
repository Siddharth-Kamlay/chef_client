import { useState, useContext } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            alert('Login successful!');
            navigate('/');
        } else {
            alert('Login failed.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className={styles.inputField} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className={styles.inputField} 
            />
            <button type="submit" className={styles.button}>Login</button>
        </form>
    );
};

export default Login;
