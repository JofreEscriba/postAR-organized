import multer from 'multer';
import supabase from '../supabaseClient.js';
import upload from '../middlewares/upload.js';

const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ storage }).single('file');

export const uploadProfileImage = async (req, res) => {
  const file = req.file;
  const fileName = req.body.fileName;

  console.log('Archivo recibido:', file);
  console.log('Nombre del archivo:', fileName);
  
  if (!file || !fileName) {
    return res.status(400).json({ error: 'Faltan archivo o nombre de archivo' });
  }

  const { data, error } = await supabase.storage
    .from('profile-images')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });
  console.log('Datos de subida:', data);
  console.log('Error de subida:', error);

  if (error) return res.status(500).json({ error: error.message });

  const { data: publicUrlData } = supabase
    .storage
    .from('profile-images')
    .getPublicUrl(fileName);

  res.json({ publicUrl: publicUrlData.publicUrl });
};

