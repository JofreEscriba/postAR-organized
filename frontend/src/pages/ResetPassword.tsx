import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import styles from '../styles/auth.module.css';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  const handleResetPassword = async () => {
    if (!password || !confirm) return alert('Please fill in both fields.');
    if (password !== confirm) return alert('Passwords do not match.');

    setLoading(true);
    try {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setLoading(false);
        return alert('Session is missing. Please open the link from your email again.');
      }

      const { error } = await supabase.auth.updateUser({ password });

      setLoading(false);

      if (error) {
        alert('Error: ' + error.message);
      } else {
        alert('Password reset successful ✅');
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
      <h2 className={styles['welcome-title']}>Reset your <br /> password</h2>

      <div className={styles['login-box']}>
        <h1 className={styles['title']}>New Password</h1>

        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <div className={styles['buttons']}>
          <button
            className={`${styles['button']} ${styles['primary']}`}
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
