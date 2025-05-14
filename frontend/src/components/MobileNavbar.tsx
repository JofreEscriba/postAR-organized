import React, { useState } from 'react';
import { FaHome, FaUser, FaPlus, FaTimes, FaImage, FaQrcode, FaSync, FaRegCreditCard, FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from '../styles/mobileNavbar.module.css';

const MobileNavbar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {isExpanded && <div className={styles.overlay} onClick={() => setIsExpanded(false)}></div>}

      <div className={styles.mobileNavbar}>
        <button className={styles.navButton}><FaHome /></button>
        <button className={styles.navButton}><FaRegCreditCard /></button>

        <div className={styles.centralButtonWrapper}>
          <button className={styles.centralButton} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <FaTimes /> : <FaPlus />}
          </button>
          {isExpanded && (
            <div className={styles.expandedButtons}>
              <button className={styles.expandedButton}><FaImage /></button>
              <button className={styles.expandedButton}><FaQrcode /></button>
              <button className={styles.expandedButton}><FaPlay /></button> {/* Nouveau bouton Play */}
            </div>
          )}
        </div>

        <button className={styles.navButton}><FaSync /></button>
        <Link to="/profile" className={styles.navButton}><FaUser /></Link>
      </div>
    </>
  );
};

export default MobileNavbar;
