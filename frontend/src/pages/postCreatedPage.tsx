import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/cardAdd.module.css";

const PostCreatedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Recibes el post creado desde el estado del navigate
  const post = location.state?.post;

  if (!post) {
    return (
      <div className={styles.wrapper}>
        <p>No post data available.</p>
        <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1>Post Created Successfully!</h1>
        <p>Your post titled <strong>{post.title}</strong> has been created and is now visible to others.</p>
        <p><strong>Date:</strong> {post.date}</p>
        <p><strong>Message:</strong> {post.message}</p>
        <p><strong>Location:</strong> {post.location}</p>

        <div className={styles.buttonContainer}>
          <button onClick={() => navigate(-1)} className={styles.cancelButtonMobile}>
            Go Back
          </button>
          <button onClick={() => navigate("/dashboard")} className={styles.submitButton}>
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreatedPage;
