import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import styles from '../styles/auth.module.css';
import googleIcon from '../assets/google.png';
import appleIcon from '../assets/apple.png';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  const handleSocialSignup = (provider: 'google' | 'apple') => {
    alert(`Inscription avec ${provider} en cours...`);
    setTimeout(() => {
      alert(`Inscription avec ${provider} réussie !`);
      navigate('/login');
    }, 1000);
  };

  const handleClassicSignup = async () => {
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      const userId = result.user?.id || null;

      if (!userId) {
        throw new Error('User ID not found in response');
      }

      const response2 = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, userId })
      });

      if (!response2.ok) {
        throw new Error(result.error || 'The username or email already exists');
      }

      alert('Sign up successful! Please confirm your email and log in.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles['auth-container']}>
      <h2 className={styles['welcome-title']}>Welcome <br /> to Cardify!</h2>

      <div className={styles['login-box']}>
        <h1 className={styles['title']}>Sign up</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <div className={styles['buttons']}>
          <button className={`${styles['button']} ${styles['secondary']}`} onClick={() => navigate('/')}>Back</button>
          <button className={`${styles['button']} ${styles['primary']}`} onClick={handleClassicSignup}>Sign up →</button>
        </div>

        <div className={styles['separator']}>
          <span className={styles['line']}></span>
          <span className={styles['or-text']}>or</span>
          <span className={styles['line']}></span>
        </div>

        <div className={styles['social-login']}>
          <button className={styles['social-button']} onClick={() => handleSocialSignup('google')}>
            <img src={googleIcon} alt="Google" />
          </button>
          <button className={styles['social-button']} onClick={() => handleSocialSignup('apple')}>
            <img src={appleIcon} alt="Apple" />
          </button>
        </div>

        <p className={styles['register-text']}>Already a member? <a href="login">Log in</a></p>
      </div>
    </div>
  );
};

export default Signup;
