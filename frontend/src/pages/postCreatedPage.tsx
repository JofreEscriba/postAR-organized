import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/postCreated.module.css";
import { QRCodeCanvas } from "qrcode.react";

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
  const navigate = useNavigate();
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

  // 🔗 URL a la página del visor 3D (ajusta dominio si necesario)
  const viewerUrl = `http://localhost:5173/Post-AR/model-viewer/${postcard.id}`;

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

        {/* Código QR para abrir visor 3D */}
        {postcard.model && (
          <div className={styles.qrContainer}>
            <h3>Scan to view 3D model</h3>
            <QRCodeCanvas value={viewerUrl} size={180} />
            {/* Mostrar la URL justo debajo del QR */}
            <p className={styles.qrUrl}>
              <a href={viewerUrl} target="_blank" rel="noopener noreferrer">
                {viewerUrl}
              </a>
            </p>
          </div>
        )}

        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.submitButton}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
          <button
            type="button"
            className={styles.printButton}
            onClick={() => window.print()}
          >
            Print Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreatedPage;
