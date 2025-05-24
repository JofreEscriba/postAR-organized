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
  const [userID, setUserID] = useState<number>();
  const [cardsSent, setcardsSent] = useState<number>(0);
  const [cardsRecived, setcardsRecived] = useState<number>(0);

  async function getUserData() {
    try {
      const res = await fetch(`http://localhost:3001/api/users/email/${myMail}`);
      if (!res.ok) throw new Error("Error cargando el perfil");
  
      const data = await res.json();
      setUserName(data.username || "Usuario desconocido");
      setUserDescription(data.description || "Añade una descripción!");
      setUserID(data.id);
  
    } catch (err: any) {
      console.error(err.message);
    }
  }
  

  async function getCardsSent() {
    try {
      const res = await fetch(`http://localhost:3001/api/postcards/sent/${userID}`);
      if (!res.ok) throw new Error("Error cargando el contador1");
  
      const data = await res.json(); // <-- Solo se hace UNA VEZ

      setcardsSent(data.length || 0);
  
    } catch (err: any) {
      console.error(err.message);
    }
  }

  async function getCardsRecived() {
    try {
      const res = await fetch(`http://localhost:3001/api/postcards/received/${userID}`);
      console.log(res);
      if (!res.ok) throw new Error("Error cargando el contador2");
  
      const data = await res.json();
      setcardsRecived(data.length || 0);
  
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

  useEffect(() => {
    if (userID !== undefined) {
      getCardsSent();
      getCardsRecived();
    }
  }, [userID]);
  
  
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
            <div className={styles.statBox}><span>{cardsSent}</span> Cards sent</div>
            <div className={styles.statBox}><span>{cardsRecived}</span> Cards received</div>
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
