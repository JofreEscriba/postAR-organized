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
  });

  useEffect(() => {
    setFormData({ title: "", date: "", message: "", location: "" });
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

    if (!formData.title || !formData.date || !formData.message || !formData.location) {
      alert("Please fill out all fields.");
      return;
    }

    if (!media) {
      alert("Please upload a photo.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("message", formData.message);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("media", media);

    try {
      const userMail = localStorage.getItem("user_email");
      const responseUser = await axios.get(`http://localhost:3001/api/users/email/${userMail}`);
      const sender_id = responseUser.data.id;
      formDataToSend.append("sender_id", sender_id);

      await axios.post("http://localhost:3001/api/postcards", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Upload failed.");
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
          <input type="text" name="title" className={styles.inputField} value={formData.title} onChange={handleInputChange} />

          <h2>Sent on</h2>
          <input type="date" name="date" className={styles.dateField} value={formData.date} onChange={handleInputChange} />

          <h2>Message</h2>
          <input type="text" name="message" className={styles.inputField} value={formData.message} onChange={handleInputChange} />

          <h2>Location</h2>
          <select
            name="location"
            className={styles.inputField}
            value={formData.location}
            onChange={handleInputChange}
          >
            <option value="">Select a location</option>
            <option value="Kukulkan Temple">Kukulkan Temple</option>
            <option value="Gare De Metz">Gare De Metz</option>
            <option value="Oude Kerk Delft">Oude Kerk Delft</option>
            <option value="Pisa Tower">Pisa Tower</option>
            <option value="Sagrada Familia">Sagrada Familia</option>
            <option value="Taj Mahal">Taj Mahal</option>
          </select>

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
