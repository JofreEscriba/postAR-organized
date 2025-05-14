import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import styles from "../styles/cardAdd.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faVideo } from "@fortawesome/free-solid-svg-icons";


// im adding a bit of commentairy so its easier to see what does what.
// i have almost no experience with backend and databases so change what you need to change
// chatgpt has been used for parts of the backend of this page


const CardAdd: React.FC = () => {
  const [media, setMedia] = useState<File | null>(null); // stores the uploaded file
  const [preview, setPreview] = useState<string | null>(null); // stores preview URL
  const [isVideo, setIsVideo] = useState<boolean>(false); // checks if its a vid
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    message: "",
  });

    // stores the file in media
    // generates a preview url with the URL.createObjectURL()
    
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileURL = URL.createObjectURL(file);

      setMedia(file);
      setPreview(fileURL);
      setIsVideo(file.type.startsWith("video")); // checks if the file is a video
    }
  };
  
  // updates the formData state whenever there is a input being given

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };


    
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // prevents the page from reloading and deleting all the input data

    if (!formData.title || !formData.date || !formData.message || !media) {
      alert("Please fill out all fields and upload a file."); // <-- gives this message if not everything is filled
      return;
    }
      //creates a FormData object for backend
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("message", formData.message);
    formDataToSend.append("media", media);

    try {//                               v sends the request here v
      const response = await axios.post("http://localhost:5000/upload", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Upload successful!");
      console.log(response.data);
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
              src="src/assets/BlueCardExample.png"
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
          <button type="button" className={styles.cancelButton} onClick={() => setPreview(null)}>
            Cancel
          </button>
        </div>
        <div className={styles.form}>
          <h2>Card Title</h2>
          <input type="text" name="title" className={styles.inputField} value={formData.title} onChange={handleInputChange} />
          <h2>Sent on</h2>
          <input type="date" name="date" className={styles.dateField} value={formData.date} onChange={handleInputChange} />
          <h2>Message</h2>
          <input type="text" name="message" className={styles.inputField} value={formData.message} onChange={handleInputChange} />
          <button type="submit" className={styles.submitButton}>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CardAdd;
