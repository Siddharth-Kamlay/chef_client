import { useState, useContext } from 'react';
import AuthContext from './AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signup(username, email, password);
        if (success){
            alert('Signup successful!');
            navigate('/');
        } 
        else alert('Signup failed.');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                className={styles.inputField}
            />
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
            <button type="submit" className={styles.button}>Sign Up</button>
            <p>Already a user? <Link to="/login">Sign In</Link></p>
        </form>
    );
};

export default SignUp;