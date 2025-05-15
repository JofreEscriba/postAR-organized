import supabase from '../supabaseClient.js';

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
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
export const getUserById = async (req, res) => {
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

export const getUserByMail = async (req, res) => {
  const { email } = req.params;
  

  try {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('email_address', email)
      .single();

    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo usuario:", error.message);
    res.status(500).json({ error: 'Error obteniendo usuario' });
  }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  const { name, email, userId } = req.body;

  if (!name || !email || !userId) {
    return res.status(400).json({ error: 'Nombre, email y userId son requeridos' });
  }

  try {
    const { data, error } = await supabase
      .from('User')
      .insert([{ username: name, email_address: email, auth_id: userId }])
      .select()
      .single();

    if (error) {
      console.error("Error inserting user:", error);
      throw error;
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error creando usuario:", error.message || error);
    return res.status(500).json({ error: 'Error creando usuario' });
  }
};


// Actualizar un usuario
export const updateUser = async (req, res) => {
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
export const deleteUser = async (req, res) => {
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
