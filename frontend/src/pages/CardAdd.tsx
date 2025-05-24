import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import styles from "../styles/cardAdd.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const CardAdd: React.FC = () => {
  const navigate = useNavigate();

  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    message: "",
    location: "",
    sender: "",      // <-- Añadido campo remitente
  });

  useEffect(() => {
    setFormData({ title: "", date: "", message: "", location: "", sender: "" });
    setMedia(null);
    setPreview(null);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileURL = URL.createObjectURL(file);
      setMedia(file);
      setPreview(fileURL);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.title || !formData.date || !formData.message || !formData.location || !formData.sender) {
      alert("Please fill out all fields.");
      return;
    }

    if (!media) {
      alert("Please upload a photo.");
      return;
    }

    try {
      // 1. Buscar el usuario destinatario por email (formData.sender)
      const responseSender = await axios.get(`http://localhost:3001/api/users/email/${formData.sender}`);
      if (!responseSender.data || !responseSender.data.id) {
        alert("The recipient email does not exist.");
        return;
      }
      const recipientId = responseSender.data.id;

      // 2. Buscar el usuario que envía la tarjeta (desde localStorage)
      const userMail = localStorage.getItem("user_email");
      const responseUser = await axios.get(`http://localhost:3001/api/users/email/${userMail}`);
      const senderId = responseUser.data.id;

      // 3. Crear FormData para enviar
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("sender_id", senderId);      // ID del remitente
      formDataToSend.append("recipient_id", recipientId); // ID del destinatario
      formDataToSend.append("media", media);

      // 4. Enviar la tarjeta postal
      const r = await axios.post("http://localhost:3001/api/postcards", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const createdPostId = r.data.id;
      navigate("/post-created", { state: { postcardId: createdPostId } });

    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        alert("Recipient email not found.");
      } else {
        console.error("Error uploading:", error);
        alert("Upload failed.");
      }
    }
  };


  return (
    <div className={styles.wrapper}>
      <div className={styles.navbar}>
        <Navbar />
      </div>

      <form className={styles.cardContainer} onSubmit={handleSubmit}>
        <div className={styles.preview}>
          {preview ? (
            <img src={preview} className={styles.exampleImage} alt="Preview" />
          ) : (
            <img src="/Post-AR/walletCard3.png" className={styles.exampleImage} alt="Card Example" />
          )}
          <div className={styles.picAndVidButton}>
            <label className={styles.pictureButton}>
              <FontAwesomeIcon icon={faCamera} className="mr-2" /> Add a photo
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </label>
          </div>
          <button type="button" className={styles.cancelButton} onClick={() => navigate(-1)}>Cancel</button>
        </div>

        <div className={styles.form}>
          <h2>Card Title</h2>
          <input
            type="text"
            name="title"
            className={styles.inputField}
            value={formData.title}
            onChange={handleInputChange}
          />

          <h2>Sent on</h2>
          <input
            type="date"
            name="date"
            className={styles.dateField}
            value={formData.date}
            onChange={handleInputChange}
          />

          <h2>Message</h2>
          <input
            type="text"
            name="message"
            className={styles.inputField}
            value={formData.message}
            onChange={handleInputChange}
          />

          <h2>Location</h2>
          <select
            name="location"
            className={styles.inputField}
            value={formData.location}
            onChange={handleInputChange}
          >
            <option value="">Select a location</option>
            <option value="https://tbzgewjnfcjviexmgnsq.supabase.co/storage/v1/object/public/test//KukulkanTemple_3DModel.fbx">Kukulkan Temple</option>
            <option value="https://tbzgewjnfcjviexmgnsq.supabase.co/storage/v1/object/public/test//GareDeMetz_3DModel.fbx">Gare De Metz</option>
            <option value="https://tbzgewjnfcjviexmgnsq.supabase.co/storage/v1/object/public/test//OudeKerkDelft_3DModel.fbx">Oude Kerk Delft</option>
            <option value="https://tbzgewjnfcjviexmgnsq.supabase.co/storage/v1/object/public/test//PisaTower_3DModel.fbx">Pisa Tower</option>
            <option value="https://tbzgewjnfcjviexmgnsq.supabase.co/storage/v1/object/public/test//SagradaFamilia_3DModel.fbx">Sagrada Familia</option>
            <option value="https://tbzgewjnfcjviexmgnsq.supabase.co/storage/v1/object/public/test//TajMahal_3DModel.fbx">Taj Mahal</option>
          </select>

          {/* Nuevo campo remitente */}
          <h2>Addressee</h2>
          <input
            type="text"
            name="sender"
            className={styles.inputField}
            value={formData.sender}
            onChange={handleInputChange}
            placeholder="To whom are you sending this card?"
          />

          <div className={styles.buttonContainer}>
            <button type="button" className={styles.cancelButtonMobile} onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className={styles.submitButton}>Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CardAdd;
