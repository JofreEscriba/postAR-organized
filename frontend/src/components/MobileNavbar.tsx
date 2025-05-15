import { useState } from 'react';
import { FaHome, FaUser, FaPlus, FaTimes, FaSync } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from '../styles/mobileNavbar.module.css';
import { MdQrCode, MdCreditCard } from 'react-icons/md';

const MobileNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {isExpanded && <div className={styles.overlay} onClick={() => setIsExpanded(false)}></div>}

      <div className={styles.mobileNavbar}>
        <Link to="/dashboard" className={styles.navButton}><FaHome /></Link>
        <Link to="/MyCards" className={styles.navButton}><MdCreditCard /></Link>

        <div className={styles.centralButtonWrapper}>
          <button className={styles.centralButton} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <FaTimes /> : <FaPlus />}
          </button>
          {isExpanded && (
            <div className={styles.expandedButtons}>
              {}
              <Link to="/cardAdd" className={styles.expandedButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4c.55 0 1 .45 1 1v6h6c.55 0 1 .45 1 1s-.45 1-1 1h-6v6c0 .55-.45 1-1 1s-1-.45-1-1v-6H5c-.55 0-1-.45-1-1s.45-1 1-1h6V5c0-.55.45-1 1-1z"/>
                </svg>
              </Link>
              {}
              <button className={styles.expandedButton} style={{ color: '#6a5acd' }}><MdQrCode /></button>
            </div>
          )}
        </div>

        <button className={styles.navButton} onClick={() => window.location.reload()}>
  <FaSync />
</button>
        <Link to="/profile" className={styles.navButton}><FaUser /></Link>
      </div>
    </>
  );
};

export default MobileNavbar;
