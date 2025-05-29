import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import styles from '../styles/auth.module.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  const handleResetPassword = async () => {
    if (!email) return alert('Please enter your email.');

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email:email }),
      });
      console.log(response);
      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        alert('Error: ' + result.error);
      } else {
        alert('If this email is registered, you will receive instructions shortly.');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className={styles['auth-container']}>
      <h2 className={styles['welcome-title']}>Forgot your <br /> password?</h2>

      <div className={styles['login-box']}>
        <h1 className={styles['title']}>Password Recovery</h1>

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className={styles['buttons']}>
          <button className={`${styles['button']} ${styles['secondary']}`} onClick={() => navigate('/')}>
            Back
          </button>
          <button
            className={`${styles['button']} ${styles['primary']}`}
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
