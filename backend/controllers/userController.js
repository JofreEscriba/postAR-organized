const { createClient } = require("@supabase/supabase-js");

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from('User').select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error.message);
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo usuario:", error.message);
    res.status(500).json({ error: 'Error obteniendo usuario' });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }

  try {
    const { data, error } = await supabase
      .from('User')
      .insert([{ nombre, email }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creando usuario:", error.message);
    res.status(500).json({ error: 'Error creando usuario' });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from('User')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error actualizando usuario:", error.message);
    res.status(500).json({ error: 'Error actualizando usuario' });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('User')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: `Usuario con ID ${id} eliminado` });
  } catch (error) {
    console.error("Error eliminando usuario:", error.message);
    res.status(500).json({ error: 'Error eliminando usuario' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
