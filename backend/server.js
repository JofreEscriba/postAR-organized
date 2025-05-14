require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

// Rutas importadas
const chatRoutes = require("./routes/chatRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const userRoutes = require('./routes/userRoutes');
const postcardRoutes = require('./routes/postcardRoutes');

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


// Ruta raíz
app.get("/", (req, res) => {
  res.send("Servidor del backend corriendo correctamente 🚀");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escoltant al port ${PORT}`);
});
