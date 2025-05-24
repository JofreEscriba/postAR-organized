import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/postCreated.module.css"; // Importación del CSS module

type Postcard = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  location: string;
  image?: string;
  model: string;
};

const PostCreatedPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 👈 Hook para navegación
  const { postcardId } = location.state || {};
  const [postcard, setPostcard] = useState<Postcard | null>(null);

  useEffect(() => {
    if (!postcardId) return;
    async function fetchPostcard() {
      try {
        const res = await axios.get(`http://localhost:3001/api/postcards/${postcardId}`);
        setPostcard(res.data);
      } catch (error) {
        console.error("Error fetching postcard:", error);
      }
    }
    fetchPostcard();
  }, [postcardId]);

  if (!postcard) return <div>Loading...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>Post Created Successfully!</h1>
        <p className={styles.description}>Title: {postcard.title}</p>
        <p className={styles.description}>Message: {postcard.description}</p>
        <p className={styles.description}>Date: {postcard.created_at}</p>
        {postcard.image && (
          <img
            src={postcard.image}
            alt={postcard.title}
            className={styles.postcardImage}
          />
        )}

        {/* Botón de volver al Dashboard */}
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.submitButton}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreatedPage;
