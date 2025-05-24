import supabase from '../supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

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
  const { title,date, message, sender_id, location, sender } = req.body;
  const file = req.file;


  if (!title || !date || !message || !sender_id  || !file || !location) {
    return res.status(400).json({ error: 'Faltan campos requeridos o media' });
  }

  try {
    // 1. Subir archivo a Supabase Storage
    const filename = `${uuidv4()}_${file.originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('test')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) throw uploadError;

    // 2. Obtener la URL pública
    const { data: publicUrlData } = supabase.storage
      .from('test')
      .getPublicUrl(filename);

    const image_url = publicUrlData.publicUrl;

    // 3. Insertar en la tabla
    const { data, error: insertError } = await supabase
      .from('Postcard')
      .insert([{ title:title, description:message, sender_id:sender_id, image:image_url, model:location, reciever_id:sender }])
      .select()
      .single();

    if (insertError) throw insertError;

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error creando postal:", error.message);
    return res.status(500).json({ error: 'Error creando postal' });
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

export const getAllPostcardsSent = async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const { data, error } = await supabase.from('Postcard').select('*').eq('sender_id', userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo postales:", error.message);
    res.status(500).json({ error: 'Error obteniendo postales' });
  }
};

export const getAllPostcardsReceived = async (req, res) => {
  const userId = req.params.userId;

  try {
    const { data, error } = await supabase.from('Postcard').select('*').eq('reciever_id', userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo postales:", error.message);
    res.status(500).json({ error: 'Error obteniendo postales' });
  }
};


