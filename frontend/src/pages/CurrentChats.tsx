import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from '../styles/MyChats.module.css';

interface Message {
    id: string;
    idChat: string;
    usuario: string;
    mensaje: string;
}

interface ChatData {
    usuari1: string;
    usuari2: string;
    visibleUsr1: number;
    visibleUsr2: number;
}

const CurrentChats: React.FC = () => {
    const { idChat } = useParams<{ idChat: string }>();
    const navigate = useNavigate();
    const myMail = localStorage.getItem("user_email")!;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [otherUser, setOtherUser] = useState<string>("");
    const [numUsuariChat, setNumUsuariChat] = useState<number>(1);
    const [showOptions, setShowOptions] = useState(false);
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);

    // Validar acceso y cargar mensajes
    useEffect(() => {
        async function fetchChatAndMessages() {
            try {
                const chatRes = await fetch(`http://localhost:3001/api/chats/${idChat}`);
                if (!chatRes.ok) throw new Error("Error cargando el chat");

                const [chat]: ChatData[] = await chatRes.json();
                const notVisible =
                    (chat.usuari1 === myMail && chat.visibleUsr1 === 0) ||
                    (chat.usuari2 === myMail && chat.visibleUsr2 === 0) ||
                    (chat.usuari1 !== myMail && chat.usuari2 !== myMail);

                if (notVisible) {
                    setError("No puedes acceder a este chat.");
                    return;
                }

                const isUser1 = chat.usuari1 === myMail;
                setOtherUser(isUser1 ? chat.usuari2 : chat.usuari1);
                setNumUsuariChat(isUser1 ? 1 : 2);

                const msgRes = await fetch(`http://localhost:3001/api/messages?idChat=${idChat}&numUsuari=${isUser1 ? 1 : 2}`);
                if (!msgRes.ok) {
                    if (msgRes.status === 404) {
                        setMessages([]);
                        return;
                    }
                    throw new Error("Error cargando los mensajes");
                }

                const msgs: Message[] = await msgRes.json();
                setMessages(msgs);
            } catch (err: any) {
                console.error("Error:", err.message);
                setError("No se pudo cargar el chat.");
            }
        }

        fetchChatAndMessages();
    }, [idChat, myMail]);

    // Enviar un nuevo mensaje
    async function sendMessage() {
        if (!newMessage.trim()) return;
    
        try {
            const res = await fetch(`http://localhost:3001/api/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idChat, usuario: myMail, mensaje: newMessage }),
            });
    
            if (!res.ok) throw new Error("Error enviando el mensaje");
    
            const msg: Message = await res.json();
            setMessages((prev) => [...prev, msg]);
            setNewMessage("");
        } catch (err: any) {
            console.error(err.message);
            setError("No se pudo enviar el mensaje.");
        }
    }
    

    // Eliminar todos los mensajes
    async function deleteAllMessages() {
        try {
            const res = await fetch(`http://localhost:3001/api/messages/hidden?idChat=${idChat}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Error borrando los mensajes");
            setMessages([]);
        } catch (err: any) {
            console.error(err.message);
        }
    }
    
    // Ocultar todos los mensajes del usuario actual
    async function hideAllMessages() {
        try {
            const res = await fetch(`http://localhost:3001/api/messages/hide`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idChat, usuario: numUsuariChat }),
            });
            if (!res.ok) throw new Error("Error ocultando los mensajes");
            setMessages([]);
        } catch (err: any) {
            console.error(err.message);
        }
        deleteAllMessages();
    }
    

    // Borrar solo mis mensajes (y ocultarlos para el otro usuario)
    async function deleteMyMessages() {
        try {
            const res = await fetch(`http://localhost:3001/api/messages/user`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idChat, usuario: myMail }),
            });
            if (!res.ok) throw new Error("Error borrando tus mensajes");
    
            setMessages((prev) => prev.filter((msg) => msg.usuario !== myMail));
            alert("Tus mensajes han sido borrados y ocultados para la otra persona.");
        } catch (err: any) {
            console.error(err.message);
        }
        deleteAllMessages();
    }
    

    // Eliminar o marcar chat como invisible
    async function deleteChat() {
        try {
            // Obtener info del chat
            const chatRes = await fetch(`http://localhost:3001/api/chats/${idChat}`);
            if (!chatRes.ok) throw new Error("Error obteniendo el chat");
            const chat: ChatData = await chatRes.json();
    
            const alreadyHidden = chat.visibleUsr1 === 0 || chat.visibleUsr2 === 0;
    
            if (alreadyHidden) {
                // Eliminar chat
                const del = await fetch(`http://localhost:3001/api/chats/${idChat}`, { method: "DELETE" });
                if (!del.ok) throw new Error("Error eliminando el chat");
                alert("¡Chat eliminado con éxito!");
            } else {
                // Marcar como invisible
                const body = chat.usuari1 === myMail ? { visibleUsr1: 0 } : { visibleUsr2: 0 };
                const update = await fetch(`http://localhost:3001/api/chats/invisible/${idChat}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (!update.ok) throw new Error("Error actualizando visibilidad");
                alert("¡Chat ocultado correctamente!");
            }
    
            navigate(-1);
        } catch (err: any) {
            console.error("Error gestionando el chat:", err.message);
        }
    }
    

    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Header fixat a la part superior */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f8f9fa",
                    padding: "10px",
                    zIndex: 1000,
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                        onClick={() => navigate(-1)} // Torna a la pàgina anterior
                        style={{
                            marginRight: "10px",
                            fontSize: "24px",
                            backgroundColor: "transparent",
                            color: "#007bff",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        ←
                    </button>
                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>{otherUser}</span>
                </div>
                <div style={{ position: "relative" }}>
                    <button
                        onClick={() => setShowOptions(!showOptions)} // Mostra o amaga el menú d'opcions
                        style={{
                            fontSize: "18px",
                            backgroundColor: "transparent",
                            color: "#007bff",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        ⋮ {/* Icona de tres punts verticals */}
                    </button>
                    {showOptions && (
                        <div
                            style={{
                                position: "absolute",
                                top: "30px",
                                right: 0,
                                backgroundColor: "#fff",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                                zIndex: 1000,
                            }}
                        >
                            <button
                                onClick={() => {
                                    setShowDeleteOptions(!showDeleteOptions)
                                }}
                                style={{
                                    display: "block",
                                    width: "100%",
                                    padding: "10px",
                                    backgroundColor: "transparent",
                                    border: "none",
                                    textAlign: "left",
                                    cursor: "pointer",
                                }}
                            >
                                Esborra tots els missatges
                            </button>
                            {showDeleteOptions && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "50px",
                                    right: "10px",
                                    backgroundColor: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                                    zIndex: 1000,
                                    padding: "10px",
                                }}
                            >
                                <button
                                    onClick={() => {
                                        const confirmDelete = window.confirm(
                                            "Estàs segur que vols esborrar només els teus missatges? L'altra persona tampoc els podrà veure."
                                        );
                                        if (confirmDelete) {
                                            deleteMyMessages(); // Crida la funció per esborrar els missatges
                                            setShowDeleteOptions(false); // Amaga el menú
                                        }
                                    }}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "10px",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        textAlign: "left",
                                        cursor: "pointer",
                                    }}
                                >
                                    Esborra només els teus missatges
                                </button>
                                <button
                                    onClick={() => {
                                        const confirmDelete = window.confirm(
                                            "Estàs segur que vols esborrar tots els missatges? L'altra persona encara els podrà veure."
                                        );
                                        if (confirmDelete) {
                                            hideAllMessages(); // Crida la funció per esborrar tots els missatges
                                            setShowDeleteOptions(false); // Amaga el menú
                                        }
                                    }}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "10px",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        textAlign: "left",
                                        cursor: "pointer",
                                    }}
                                >
                                    Esborra tots els missatges
                                </button>
                                <button
                                    onClick={() => setShowDeleteOptions(false)} // Amaga el menú
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "10px",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        textAlign: "left",
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel·la
                                </button>
                            </div>
                        )}
                            <button
                                onClick={() => {
                                    const confirmDelete = window.confirm(
                                        "Estàs segur que vols eliminar aquest xat? No podràs tornar a entrar-hi després d'eliminar-lo."
                                    );
                                    if (confirmDelete) {
                                        deleteChat(); // Crida la funció per eliminar el xat
                                    }
                                }}
                                style={{
                                    display: "block",
                                    width: "100%",
                                    padding: "10px",
                                    backgroundColor: "transparent",
                                    border: "none",
                                    textAlign: "left",
                                    cursor: "pointer",
                                }}
                            >
                                Elimina el xat
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Contingut del xat */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "10px",
                    backgroundColor: "#fff",
                    maxWidth: "800px",
                }}
            >
                {messages.length === 0 ? (
                    <p>No hi ha missatges en aquest xat.</p>
                ) : (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {messages.map((message) => (
                            <li
                                key={message.id}
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        message.usuario === myMail ? "flex-end" : "flex-start",
                                    marginBottom: "10px",
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: "70%",
                                        padding: "10px",
                                        borderRadius: "10px",
                                        backgroundColor:
                                            message.usuario === myMail ? "#007bff" : "#f0f0f0",
                                        color: message.usuario === myMail ? "#fff" : "#000",
                                        textAlign: "left",
                                    }}
                                >
                                    {message.mensaje}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer fixat a la part inferior */}
            <div
                style={{
                    position: "sticky",
                    bottom: 0,
                    backgroundColor: "#f8f9fa",
                    padding: "10px",
                    borderTop: "1px solid #ddd",
                    width: "500px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                        type="text"
                        placeholder="Escriu un missatge"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        style={{
                            flex: 1,
                            padding: "10px",
                            fontSize: "16px",
                            marginRight: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CurrentChats;
