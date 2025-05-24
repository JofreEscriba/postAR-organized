import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/profile.module.css';
import Navbar from '../components/Navbar';
import { FaEdit, FaCheckCircle } from 'react-icons/fa';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const myMail = localStorage.getItem("user_email")!;
  const [userName, setUserName] = useState<string>("");
  const [userDescription, setUserDescription] = useState<string>("");

  async function getUserData() {
    try {
      const res = await fetch(`http://localhost:3001/api/users/email/${myMail}`);
      if (!res.ok) throw new Error("Error cargando el perfil");
  
      const data = await res.json(); // <-- Solo se hace UNA VEZ
      console.log(data); // Muestra el perfil completo (puedes inspeccionar esto)
  
      setUserName(data.username || "Usuario desconocido");
      setUserDescription(data.description || "Añade una descripción!"); 
    } catch (err: any) {
      console.error(err.message);
    }
  }

  async function handleLogout() {
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
    localStorage.removeItem("access_token");
    navigate("/");
  }

  getUserData();
  return (
    <div className={styles.profileWrapper}>
      <Navbar />
      
      <div className={styles.profileContainer}>
        <div className={styles.leftColumn}>
          <h2 className={styles.profileTitle}>My profile</h2>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.imageContainer}>
                <img src="/Post-AR/profile.png" alt="Profile" className={styles.profilePic} />
                <FaCheckCircle className={styles.verifiedIcon} />
              </div>
              <div className={styles.userInfo}>
                <h3>{userName}</h3>
                <p className={styles.email}>{myMail}</p>
              </div>
            </div>
            <p className={styles.description}>
              {userDescription}              
            </p>
          </div>
          <div className={styles.stats}>
            <div className={styles.statBox}><span>6</span> Cards sent</div>
            <div className={styles.statBox}><span>4</span> Cards received</div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <button className={styles.editProfile} onClick={()=>navigate('/edit-profile')} ><FaEdit /> Edit your profile</button>
          <div className={styles.options}>
            <button>About App</button>
            <button>Contact us</button>
            <button className={styles.logout} onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
