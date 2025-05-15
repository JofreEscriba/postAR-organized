import React from 'react';
import styles from '../styles/auth.module.css';
import Input from '../components/Input';
import { CheckCircle } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  return (
    <div className={styles['auth-container']} style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className={styles['login-box']} style={{ padding: '30px', width: '500px', minHeight: '300px' }}>
        <h1 className={styles['title']}>Verify Your Email</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={40} color="white" />
          <Input type="email" placeholder="Enter your email" />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;