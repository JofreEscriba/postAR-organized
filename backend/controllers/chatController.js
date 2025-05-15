import mysql from 'mysql2/promise';

export async function connectToDatabase() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

export async function getAllChats(req, res) {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM chats');
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error carregant dades:', error.message);
    res.status(500).json({ error: 'Error carregant dades' });
  }
}

export async function getChatById(req, res) {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM chats WHERE idChat = ?', [req.params.idChat]);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error carregant dades:', error.message);
    res.status(500).json({ error: 'Error carregant dades' });
  }
}

export async function getChatsByUser(req, res) {
  const { usuari1 } = req.query;

  if (!usuari1) {
    return res.status(400).json({ error: 'Usuari1 és requerit' });
  }

  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(
      'SELECT * FROM chats WHERE (usuari1 = ? AND visibleUsr1 = 1) OR (usuari2 = ? AND visibleUsr2 = 1)',
      [usuari1, usuari1]
    );
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error carregant els xats:', error.message);
    res.status(500).json({ error: 'Error carregant els xats' });
  }
}

export async function createChat(req, res) {
  const { usuari1, usuari2 } = req.query;

  if (!usuari1 || !usuari2) {
    return res.status(400).json({ error: 'Usuari1 i Usuari2 són requerits' });
  }

  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(
      'INSERT INTO chats (usuari1, usuari2, confirmUsuari2, visibleUsr1, visibleUsr2) VALUES (?, ?, ?, ?, ?)',
      [usuari1, usuari2, 0, 1, 1]
    );
    await connection.end();
    res.status(201).json({
      id: result.insertId,
      usuari1,
      usuari2,
      confirmUsuari2: 0,
      visibleUsr1: 1,
      visibleUsr2: 1
    });
  } catch (error) {
    console.error('Error creant el xat:', error.message);
    res.status(500).json({ error: 'Error creant el xat' });
  }
}

export async function confirmChat(req, res) {
  const { idChat } = req.params;
  const { confirmUsuari2 } = req.body;

  if (!idChat || confirmUsuari2 === undefined) {
    return res.status(400).json({ error: 'idChat i confirmUsuari2 són requerits' });
  }

  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(
      'UPDATE chats SET confirmUsuari2 = ? WHERE idChat = ?',
      [confirmUsuari2, idChat]
    );
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No s\'ha trobat cap xat amb aquest idChat' });
    }

    res.status(200).json({ message: `Xat ${idChat} actualitzat` });
  } catch (error) {
    console.error('Error actualitzant el xat:', error.message);
    res.status(500).json({ error: 'Error actualitzant el xat' });
  }
}

export async function setChatInvisible(req, res) {
  const { idChat } = req.params;
  const { visibleUsr1 } = req.body;
  const update = visibleUsr1 === 1 ? "visibleUsr1" : "visibleUsr2";

  if (!idChat) {
    return res.status(400).json({ error: 'idChat és requerit' });
  }

  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(
      `UPDATE chats SET ${update} = 0 WHERE idChat = ?`,
      [idChat]
    );
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No s\'ha trobat cap xat amb aquest idChat' });
    }

    res.status(200).json({ message: `Xat ${idChat} actualitzat correctament` });
  } catch (error) {
    console.error('Error actualitzant el xat:', error.message);
    res.status(500).json({ error: 'Error actualitzant el xat' });
  }
}

export async function deleteChat(req, res) {
  const { idChat } = req.params;

  if (!idChat) {
    return res.status(400).json({ error: 'idChat és requerit' });
  }

  try {
    const connection = await connectToDatabase();
    await connection.execute('DELETE FROM mensajes WHERE idChat = ?', [idChat]);
    const [result] = await connection.execute('DELETE FROM chats WHERE idChat = ?', [idChat]);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No s\'ha trobat cap xat amb aquest idChat' });
    }

    res.status(200).json({ message: `Xat ${idChat} eliminat` });
  } catch (error) {
    console.error('Error eliminant el xat:', error.message);
    res.status(500).json({ error: 'Error eliminant el xat' });
  }
}
