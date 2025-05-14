import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import styles from "../styles/cardEdit.module.css";

// im adding a bit of commentairy so its easier to see what does what.
// i have almost no experience with backend and databases so change what you need to change
// chatgpt has been used for parts of the backend of this page


const CardEdit: React.FC = () => {
  const { id } = useParams(); // get card id from URL
  const navigate = useNavigate();

  const [card, setCard] = useState({
    title: "",
    date: "",
    message: "",
    imageUrl: "",
  }); // the card data is stored in useState (title, date, message, image)

  useEffect(() => {
    axios.get(`http://localhost:5000/cards/${id}`)
      .then((response) => {
        setCard(response.data); // update the state with fetched card data
      })
      .catch((error) => {
        console.error("Error fetching card:", error);
      });
  }, [id]);

// this function updates the state when the user types in an input field

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCard({ ...card, [e.target.name]: e.target.value }); // e.target.name dynamically updates title, date, or message in state
  };


  // prevents form from reloading (e.preventDefault())
  // sends a PUT request to update the card (/cards/:id)
  // if successful, an alert appears and the user is redirected to /
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/cards/${id}`, card);
      alert("Card updated successfully!");
      navigate("/"); // redirect to homepage
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // asks for confirmation before deleting (window.confirm)
  // sends a DELETE request to /cards/:id
  // if successful, alerts the user and redirects to /
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        await axios.delete(`http://localhost:5000/cards/${id}`);
        alert("Card deleted!");
        navigate("/"); // redirect after delete
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
            <img src={card.imageUrl} className={styles.exampleImage} alt="Card Example" />
          ) : (
            <h2 className="noUrl">No image available</h2>
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
        <button className={styles.cancelButton} onClick={() => navigate("/")}>Cancel</button>
        <button className={styles.submitButton} onClick={handleSubmit}>Save Changes</button>
      </div>
    </div>
  );
};

export default CardEdit;
