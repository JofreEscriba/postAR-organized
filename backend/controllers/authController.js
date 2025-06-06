// controllers/authController.js
import dotenv from 'dotenv';
import supabase from '../supabaseClient.js';

dotenv.config();


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Login exitoso ✅', session: data });
};

export const signupUser = async (req, res) => {
 const { email, password } = req.body;

 const { data, error } = await supabase.auth.signUp({
   email,
   password,
   options: {
      emailRedirectTo: 'http://localhost:5173/Post-AR/login',
    },
 });

 if (error) {
   return res.status(400).json({ error: error.message });
 }

 return res.status(201).json({ message: 'Usuario registrado exitosamente ✅', user: data.user });
};


//Login desde Google
export const getOAuthUrl = async (req, res) => {
  const { provider } = req.query;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'http://localhost:5173/dashboard' // o tu URL real
      }
    });

    if (error) return res.status(400).json({ error: error.message });

    res.json({ url: data.url });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log('Email para reset:', email);
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:5173/Post-AR/reset-password',
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Password reset email sent ✅', data });
};
