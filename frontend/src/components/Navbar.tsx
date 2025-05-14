import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/navbar.module.css';
import { FaRegUser, FaRegCreditCard } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>Post AR</h1>
      <div className={styles.links}>
        <Link to="/cards" className={`${styles.link} ${location.pathname === '/cards' ? styles.active : ''}`}>
          <FaRegCreditCard /> Cards
        </Link>
        <Link to="/profile" className={`${styles.link} ${location.pathname === '/profile' ? styles.active : ''}`}>
          <FaRegUser /> Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;