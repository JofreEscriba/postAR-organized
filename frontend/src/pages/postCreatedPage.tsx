import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/cardAdd.module.css";

const PostCreatedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1>Post Created Successfully!</h1>
        <p>Your post has been created and is now visible to others.</p>
        
        <div className={styles.buttonContainer}>
          <button 
            type="button" 
            className={styles.cancelButtonMobile} 
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <button 
            type="button" 
            className={styles.submitButton} 
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreatedPage;