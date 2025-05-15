import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import styles from '../styles/auth.module.css';
import googleIcon from '../assets/google.png';
import appleIcon from '../assets/apple.png';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  const handleClassicLogin = async () => {
    setLoading(true);
    const response = await fetch('http://localhost:3001/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      alert('Login failed: ' + result.error);
    } else {
      alert('Login successful!');
      navigate('/dashboard');
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    try {
      const res = await fetch(`http://localhost:3001/api/auth/oauth-url?provider=${provider}`);
      const { url } = await res.json();
  
      if (url) {
        window.location.href = url; // Redirige al login de Google
      } else {
        alert('Error getting OAuth URL.');
      }
    } catch (err) {
      console.error(err);
      alert('OAuth login failed.');
    }
  };

  return (
    <div className={styles['auth-container']}>
      <h2 className={styles['welcome-title']}>Welcome <br /> Back!</h2>

      <div className={styles['login-box']}>
        <h1 className={styles['title']}>Log in</h1>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <p className={styles['forgot-password']}>
          Did you forget your password? <a href="#">Click here</a>
        </p>

        <div className={styles['buttons']}>
          <button className={`${styles['button']} ${styles['secondary']}`} onClick={() => navigate('/')}>Back</button>
          <button
            className={`${styles['button']} ${styles['primary']}`}
            onClick={handleClassicLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in →'}
          </button>
        </div>

        <div className={styles['separator']}>
          <span className={styles['line']}></span>
          <span className={styles['or-text']}>or</span>
          <span className={styles['line']}></span>
        </div>

        <div className={styles['social-login']}>
          <button className={styles['social-button']} onClick={() => handleSocialLogin('google')}>
            <img src={googleIcon} alt="Google" />
          </button>
          <button className={styles['social-button']} onClick={() => alert('Apple login not implemented')}>
            <img src={appleIcon} alt="Apple" />
          </button>
        </div>

        <p className={styles['register-text']}>Not a member? <a href="/signup">Register now</a></p>
      </div>
    </div>
  );
};

export default Login;
