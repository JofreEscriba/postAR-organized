import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/editProfile.module.css';
import Navbar from '../components/Navbar';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const myMail = localStorage.getItem("user_email")!;
  const [userName, setUserName] = useState<string>("");
  const [userDescription, setUserDescription] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [userID, setUserID] = useState<BigInteger>();

  useEffect(() => {
    async function getUserData() {
      try {
        const res = await fetch(`http://localhost:3001/api/users/email/${myMail}`);
        if (!res.ok) throw new Error("Error cargando el perfil");

        const data = await res.json();
        setUserName(data.username || "");
        setUserDescription(data.description || "");
        setUserID(data.id || BigInt(0));
      } catch (err: any) {
        console.error(err.message);
      }
    }
    getUserData();
  }, [myMail]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`http://localhost:3001/api/users/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          description: userDescription,
        }),
      });

      if (!res.ok) throw new Error("Error actualizando perfil");
      alert("Perfil actualizado correctamente");
      navigate('/profile');
    } catch (err: any) {
      console.error(err.message);
      alert("No se pudo actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.profileWrapper}>
      <Navbar />
      <div className={styles.profileContainer}>
        <div className={styles.leftColumn}>
          <h2 className={styles.profileTitle}>Edit Profile</h2>
          <div className={styles.profileCard}>
            <label className={styles.label}>Username:</label>
            <input
              className={styles.input}
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            <label className={styles.label}>Description:</label>
            <textarea
              className={styles.textarea}
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
            />

            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <button className={styles.cancelButton} onClick={() => navigate('/profile')}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
