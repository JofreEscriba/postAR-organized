import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

// Rutas importadas
import chatRoutes from './routes/chatRoutes.js';
import messagesRoutes from './routes/messagesRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postcardRoutes from './routes/postcardRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();  // Llama a config() para cargar las variables de entorno

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase (si lo necesitas en otros módulos)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Rutas
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messagesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/postcards', postcardRoutes);
app.use('/api/auth', authRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Servidor del backend corriendo correctamente 🚀");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
