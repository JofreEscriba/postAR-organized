import React, { useEffect, useState } from 'react';
import ChatList from "../components/ChatList";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import styles from '../styles/MyChats.module.css';

// Clase Chat
class Chat {
  idChat: number;
  usuari1: string;
  usuari2: string;
  confirmUsuari2: number;
  visibleUsr1: number;
  visibleUsr2: number;

  constructor(
    idChat: number,
    usuari1: string,
    usuari2: string,
    confirmUsuari2: number,
    visibleUsr1: number,
    visibleUsr2: number
  ) {
    this.idChat = idChat;
    this.usuari1 = usuari1;
    this.usuari2 = usuari2;
    this.confirmUsuari2 = confirmUsuari2;
    this.visibleUsr1 = visibleUsr1;
    this.visibleUsr2 = visibleUsr2;
  }

  static fromJSON(obj: any): Chat {
    return new Chat(
      obj.idChat,
      obj.usuari1,
      obj.usuari2,
      obj.confirmUsuari2,
      obj.visibleUsr1,
      obj.visibleUsr2
    );
  }
}

// Componente MyChats
const MyChats: React.FC = () => {
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const myMail = localStorage.getItem("user_email") ?? "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/chats/user?usuari1=${encodeURIComponent(myMail)}`);
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        const chats = data.map((chat: any) => Chat.fromJSON(chat));
        setFilteredChats(chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [myMail]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.titleRow}>
        <h2>Els teus xats actuals</h2>
        <button
          className={styles.addButton}
          onClick={() => navigate("/new-chat")}
          aria-label="Crear nuevo chat"
          title="Crear nuevo chat"
        >
          +
        </button>
      </div>

      <ChatList filteredChats={filteredChats} myMail={myMail} />
    </div>
  );
};

export default MyChats;
