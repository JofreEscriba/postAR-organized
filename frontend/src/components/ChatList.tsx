import React from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/MyChats.module.css';

// Tipado para un chat
interface Chat {
  idChat: number;
  usuari1: string;
  usuari2: string;
  confirmUsuari2: number;
  visibleUsr1: number;
  visibleUsr2: number;
}

interface ChatListProps {
  filteredChats: Chat[];
  myMail: string;
}

const ChatList: React.FC<ChatListProps> = ({ filteredChats, myMail }) => {
  const navigate = useNavigate();

  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {filteredChats.map((chat) => {
        const otherUser = chat.usuari1 === myMail ? chat.usuari2 : chat.usuari1;
        const chatID = chat.idChat;
        const confirmat = chat.confirmUsuari2;

        const confirmChat = async () => {
          try {
            const response = await fetch(`http://localhost:3001/api/chats/confirm/${chatID}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ confirmUsuari2: 1 }),
            });
            if (!response.ok) throw new Error("Error confirmant el xat");
            alert("Xat confirmat amb èxit!");
            window.location.reload();
          } catch (error: any) {
            console.error("Error confirmant el xat:", error.message);
          }
        };

        const rejectChat = async () => {
          try {
            const response = await fetch(`http://localhost:3001/api/chats/confirm/${chatID}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ confirmUsuari2: 2 }),
            });
            if (!response.ok) throw new Error("Error rebutjant el xat");
            alert("Xat rebutjat!");
            window.location.reload();
          } catch (error: any) {
            console.error("Error rebutjant el xat:", error.message);
          }
        };

        const deleteChat = async () => {
          try {
            if (chat.visibleUsr1 === 0 || chat.visibleUsr2 === 0) {
              const deleteResponse = await fetch(`http://localhost:3001/api/chats/${chatID}`, {
                method: "DELETE",
              });
              if (!deleteResponse.ok) throw new Error("Error eliminant el xat");
              alert("Xat eliminat amb èxit!");
            } else {
              const updatedField = chat.usuari1 === myMail ? { visibleUsr1: 0 } : { visibleUsr2: 0 };
              const updateResponse = await fetch(`http://localhost:3001/api/chats/invisible/${chatID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedField),
              });
              if (!updateResponse.ok) throw new Error("Error actualitzant visibilitat");
              alert("Visibilitat del xat actualitzada!");
            }

            window.location.reload();
          } catch (error: any) {
            console.error("Error gestionant el xat:", error.message);
          }
        };

        const forceDeleteChat = async () => {
          try {
            
              const deleteResponse = await fetch(`http://localhost:3001/api/chats/${chatID}`, {
                method: "DELETE",
              });
              if (!deleteResponse.ok) throw new Error("Error cancelant el xat");
              alert("Xat cancelat");
            

            window.location.reload();
          } catch (error: any) {
            console.error("Error gestionant el xat:", error.message);
          }
        };

        return (
          <li
            key={chatID}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              style={{
                width: "70%",
                padding: "10px",
                fontSize: "16px",
                backgroundColor: confirmat === 2 ? "#e0e0e0" : "#f0f0f0",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: confirmat === 2 ? "not-allowed" : "pointer",
                textAlign: "left",
              }}
              onClick={() => navigate(`/current-chats/${chatID}`)}
              disabled={confirmat === 2}
            >
              {otherUser}
            </button>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {confirmat === 0 && chat.usuari1 === otherUser && (
                <>
                  <button
                    style={{
                      padding: "8px 12px",
                      fontSize: "14px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={rejectChat}
                  >
                    Rebutjar xat
                  </button>
                  <button
                    style={{
                      padding: "8px 12px",
                      fontSize: "14px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={confirmChat}
                  >
                    Confirmar xat
                  </button>
                </>
              )}

              {confirmat === 0 && chat.usuari1 !== otherUser && (
                <>
                  <span className={styles.pendingLabel}>Pendent de confirmació</span>

                  <button
                    style={{
                      padding: "8px 12px",
                      fontSize: "14px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={forceDeleteChat}
                  >
                    Cancelar Sol·licitud
                  </button>
                </>
              )}

              {confirmat === 1 && (
                <button
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={deleteChat}
                >
                  Eliminar xat
                </button>
              )}

              {confirmat === 2 && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "14px", color: "#dc3545", fontWeight: "bold" }}>
                    Xat rebutjat
                  </span>
                  <button
                    style={{
                      padding: "8px 12px",
                      fontSize: "14px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={deleteChat}
                  >
                    Eliminar xat
                  </button>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ChatList;
