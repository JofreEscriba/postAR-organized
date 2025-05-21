import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            {/* Título arriba del todo */}
            <div className="w-full text-center mt-10 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Crear un nuevo chat</h1>
            </div>

            {/* Formulario */}
            <main className="flex-1 flex flex-col items-center justify-start px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const userExists = await checkIfUserExists(email);
                            if (userExists) {
                                const success = await createChat(myMail, email);
                                if (success) {
                                    setEmail("");
                                    navigate("/chat");
                                }
                            } else {
                                alert("El usuario no existe.");
                            }
                        }}
                        className="flex flex-col gap-6"
                    >
                        <label htmlFor="email" className="text-lg font-medium text-gray-700">
                            Correo del usuario:
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="usuario@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2">
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl text-lg font-semibold transition"
                            >
                                Añadir
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/chats")}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl text-lg font-semibold transition"
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
