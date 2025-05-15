import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import styles from "../styles/cardEdit.module.css";
import blueCard from "../assets/BlueCardExample.png";
import greenCard from "../assets/GreenCardExample.png";
import purpleCard from "../assets/PurpleCardExample.png";
import yellowCard from "../assets/YellowCardExample.png";
import redCard from "../assets/RedCardExample.png";

// im adding a bit of commentairy so its easier to see what does what.
// i have almost no experience with backend and databases so change what you need to change
// chatgpt has been used for parts of the backend of this page

const CardEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [card, setCard] = useState({
    title: "",
    date: "",
    message: "",
    imageUrl: "",
  });

  // Fonction pour déterminer le type de carte en fonction de l'ID
  const getCardType = (cardId: string | undefined) => {
    if (!cardId) return "blue";
    
    // On convertit l'ID en nombre pour le switch
    const idNum = parseInt(cardId);
    switch(idNum) {
      case 1:
        return "blue";
      case 2:
        return "green";
      case 3:
        return "purple";
      case 4:
        return "yellow";
      case 5:
        return "red";
      default:
        return "blue";
    }
  };

  // Fonction pour obtenir l'image de la carte en fonction du type
  const getCardImage = (cardType: string) => {
    switch(cardType) {
      case "blue":
        return blueCard;
      case "green":
        return greenCard;
      case "purple":
        return purpleCard;
      case "yellow":
        return yellowCard;
      case "red":
        return redCard;
      default:
        return blueCard;
    }
  };

  useEffect(() => {
    // Simulation des données de la carte en fonction de l'ID
    const cardTypes = {
      1: { title: "Main Balance", color: "blue" },
      2: { title: "Sunshine Memory", color: "green" },
      3: { title: "Gift Card", color: "purple" },
      4: { title: "Travel Card", color: "yellow" },
      5: { title: "Bonus Card", color: "red" }
    };

    const cardId = id ? parseInt(id) : 1;
    const cardData = cardTypes[cardId as keyof typeof cardTypes] || cardTypes[1];

    const mockCard = {
      title: cardData.title,
      date: "2024-03-27",
      message: "Card Message",
      imageUrl: "",
    };
    setCard(mockCard);
  }, [id]);

  // this function updates the state when the user types in an input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulation de la mise à jour
      console.log("Card updated:", card);
      alert("Card updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        // Simulation de la suppression
        console.log("Card deleted:", id);
        alert("Card deleted!");
        navigate("/dashboard");
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.titlePreview}>
        <h1>{card.title || "Card Title"}</h1>
      </div>
      <div className={styles.cardContainer}>
        <div className={styles.preview}>
          {card.imageUrl ? (
            <img src={card.imageUrl} className={styles.exampleImage} alt={card.title || "Card"} />
          ) : (
            <img src={getCardImage(getCardType(id))} className={styles.exampleImage} alt="Card" />
          )}
        </div>
        <div className={styles.form}>
          <h2>Card Title</h2>
          <input type="text" name="title" className={styles.inputField} value={card.title} onChange={handleInputChange} />
          <h2>Sent on</h2>
          <input type="date" name="date" className={styles.dateField} value={card.date} onChange={handleInputChange} />
          <h2>Message</h2>
          <input type="text" name="message" className={styles.inputField} value={card.message} onChange={handleInputChange} />
        </div>
      </div>
      <div className={styles.cardButtons}>
        <button className={styles.cancelButton} onClick={handleDelete}>DELETE CARD</button>
        <button className={styles.cancelButton} onClick={() => navigate("/dashboard")}>Cancel</button>
        <button className={styles.submitButton} onClick={handleSubmit}>Save Changes</button>
      </div>
    </div>
  );
};

export default CardEdit;
