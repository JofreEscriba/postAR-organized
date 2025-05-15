import { useEffect, useState } from 'react';
import MobileNavbar from '../components/MobileNavbar';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/navbar.module.css';
import { FaRegUser, FaRocketchat } from 'react-icons/fa';
import { MdDashboard, MdCreditCard } from 'react-icons/md';

const Navbar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <MobileNavbar /> : (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>Post AR</Link>
      <div className={styles.links}>
        <Link to="/dashboard" className={`${styles.link} ${location.pathname === '/dashboard' ? styles.active : ''}`}>
          <MdDashboard /> Home
        </Link>
        <Link to="/MyCards" className={`${styles.link} ${location.pathname === '/MyCards' ? styles.active : ''}`}>
          <MdCreditCard /> Cards
        </Link>
        <Link to="/profile" className={`${styles.link} ${location.pathname === '/profile' ? styles.active : ''}`}>
          <FaRegUser /> Profile
        </Link>
        <Link to="/chats" className={`${styles.link} ${location.pathname === '/chats' ? styles.active : ''}`}>
          <FaRocketchat /> Chats
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
