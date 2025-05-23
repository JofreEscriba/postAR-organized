import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import styles from '../styles/NewChat.module.css';

const NewChat: React.FC = () => {
    const myMail = localStorage.getItem("user_email") ?? "";
    const [email, setEmail] = useState<string>("");
    const navigate = useNavigate();

    async function checkIfUserExists(email: string): Promise<boolean> {
        try {
            const response = await fetch(`http://localhost:3001/api/users/email/${encodeURIComponent(email)}`);
            if (!response.ok) return false;

            const user = await response.json();
            return user != null && Object.keys(user).length > 0;
        } catch (err: any) {
            console.error("Error consultando usuario:", err.message);
            return false;
        }
    }

    async function createChat(yourEmail: string, friendEmail: string): Promise<boolean> {
        try {
            if (yourEmail === friendEmail) {
                alert("No puedes crear un chat contigo mismo.");
                return false;
            }

            const response = await fetch(
                `http://localhost:3001/api/chats?usuari1=${encodeURIComponent(yourEmail)}&usuari2=${encodeURIComponent(friendEmail)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) throw new Error(`Error creando el chat: ${response.status}`);

            const data = await response.json();
            alert("¡Chat creado con éxito!");
            return true;
        } catch (err: any) {
            console.error("Error creando el chat:", err.message);
            alert("No se pudo crear el chat. Por favor, inténtalo de nuevo.");
            return false;
        }
    }

    return (
  <div className={styles.container}>
    <Navbar />

    <div className={styles.titleWrapper}>
      <h1 className={styles.title}>Crear un nuevo chat</h1>
    </div>

    <main className={styles.main}>
      <div className={styles.formWrapper}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const userExists = await checkIfUserExists(email);
            if (userExists) {
                const success = await createChat(myMail, email);
                if (success) {
                    setEmail("");
                    navigate("/chats");
                }
            } else {
                alert("El usuario no existe.");
            }
        }}
          className={styles.form}
        >
          <label htmlFor="email" className={styles.label}>
            Correo del usuario:
          </label>
          <input
            id="email"
            type="email"
            placeholder="usuario@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <div className={styles.buttonsContainer}>
            <button type="submit" className={`${styles.button} ${styles.buttonAdd}`}>
              Añadir
            </button>
            <button
              type="button"
              onClick={() => navigate("/chats")}
              className={`${styles.button} ${styles.buttonCancel}`}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
);
};

export default NewChat;
