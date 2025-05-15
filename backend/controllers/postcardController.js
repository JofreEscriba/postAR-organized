import supabase from '../supabaseClient.js';

// Obtener todas las postales
export const getAllPostcards = async (req, res) => {
  try {
    const { data, error } = await supabase.from('Postcard').select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo postales:", error.message);
    res.status(500).json({ error: 'Error obteniendo postales' });
  }
};

// Obtener una postal por ID
export const getPostcardById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('Postcard')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo postal:", error.message);
    res.status(500).json({ error: 'Error obteniendo postal' });
  }
};

// Crear una nueva postal
export const createPostcard = async (req, res) => {
  const { title, message, sender_id, receiver_id, image_url } = req.body;

  if (!title || !message || !sender_id || !receiver_id) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const { data, error } = await supabase
      .from('Postcard')
      .insert([{ title, message, sender_id, receiver_id, image_url }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creando postal:", error.message);
    res.status(500).json({ error: 'Error creando postal' });
  }
};

// Actualizar una postal
export const updatePostcard = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from('Postcard')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error actualizando postal:", error.message);
    res.status(500).json({ error: 'Error actualizando postal' });
  }
};

// Eliminar una postal
export const deletePostcard = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('Postcard')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: `Postal con ID ${id} eliminada` });
  } catch (error) {
    console.error("Error eliminando postal:", error.message);
    res.status(500).json({ error: 'Error eliminando postal' });
  }
};
