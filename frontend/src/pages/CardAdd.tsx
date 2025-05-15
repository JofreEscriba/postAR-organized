import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import styles from "../styles/cardAdd.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faVideo } from "@fortawesome/free-solid-svg-icons";

const CardAdd: React.FC = () => {
  const navigate = useNavigate();

  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    message: "",
  });

  useEffect(() => {
    setFormData({ title: "", date: "", message: "" });
    setMedia(null);
    setPreview(null);
    setIsVideo(false);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileURL = URL.createObjectURL(file);

      setMedia(file);
      setPreview(fileURL);
      setIsVideo(file.type.startsWith("video"));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Form data:", formData);
    console.log("Media:", media);

    if (!formData.title || !formData.date || !formData.message) {
      alert("Please fill out all text fields.");
      return;
    }

    if (!media) {
      alert("Please upload a photo or video.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("message", formData.message);
    formDataToSend.append("media", media);

    try {
      const response = await axios.post("http://localhost:5000/upload", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response.data);
      navigate("/post-created"); 

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
            isVideo ? (
              <video src={preview} className={styles.exampleImage} controls />
            ) : (
              <img src={preview} className={styles.exampleImage} alt="Preview" />
            )
          ) : (
            <img
              src="/Post-AR/walletCard3.png"
              className={styles.exampleImage}
              alt="Card Example"
            />
          )}

          <div className={styles.picAndVidButton}>
            <label className={styles.pictureButton}>
              <FontAwesomeIcon icon={faCamera} className="mr-2" /> Add a photo
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </label>
            <label className={styles.pictureButton}>
              <FontAwesomeIcon icon={faVideo} className="mr-2" /> Add a video
              <input type="file" accept="video/*" onChange={handleFileChange} style={{ display: "none" }} />
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
