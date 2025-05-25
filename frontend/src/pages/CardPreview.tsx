import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import { QRCodeCanvas } from "qrcode.react";
import styles from "../styles/cardPreview.module.css";

type Postcard = {
  id: number;
  title: string;
  sender_id: number;
  receiver_id: number;
  image: string;
  created_at: string;
  description: string;
  model: string;
};

type User = {
  id: number;
  username: string;
  email: string;
};

const CardPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<Postcard | null>(null);
  const [sender, setSender] = useState<User | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchCardData() {
      try {
        const cardRes = await fetch(`http://localhost:3001/api/postcards/${id}`);
        if (!cardRes.ok) throw new Error("Error cargando la postal");

        const cardData = await cardRes.json();
        setCard(cardData);

        const senderRes = await fetch(`http://localhost:3001/api/users/${cardData.sender_id}`);
        if (!senderRes.ok) throw new Error("Error cargando el remitente");

        const senderData = await senderRes.json();
        setSender(senderData);
      } catch (err) {
        console.error("Error:", err);
      }
    }

    fetchCardData();
  }, [id]);

  if (!card) return <p className={styles.loading}>Cargando postal...</p>;

  const viewerUrl = `http://localhost:5173/Post-AR/model-viewer/${card.id}`;

  return (
    <div className={styles.previewWrapper}>
      {/* Navbars */}
      <div className={styles.desktopOnly}>
        <Navbar />
      </div>
      <div className={styles.mobileOnly}>
        <MobileNavbar />
      </div>

      <div className={styles.previewContainer}>
        {/* Imagen de la postal */}
        <div
          className={styles.cardImage}
          style={{
            backgroundImage: `url("${card.image}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Info de la postal */}
        <div className={styles.cardInfo}>
          <h1>{card.title}</h1>
          <p><strong>Descripción:</strong> {card.description}</p>
          <p><strong>Fecha:</strong> {new Date(card.created_at).toLocaleDateString()}</p>
          <p><strong>Enviada por:</strong> {sender?.username || "Desconocido"}</p>

          {/* QR Code */}
          {card.model && (
            <div className={styles.qrContainer}>
              <h3>Escanea para ver el modelo 3D</h3>
              <QRCodeCanvas value={viewerUrl} size={180} />
              <p className={styles.qrUrl}>
                <a href={viewerUrl} target="_blank" rel="noopener noreferrer">
                  {viewerUrl}
                </a>
              </p>
            </div>
          )}

          {/* Botones */}
          <div className={styles.buttonGroup}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              Volver
            </button>
            <button className={styles.printButton} onClick={() => window.print()}>
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
