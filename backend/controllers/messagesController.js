const connectToDatabase = require("../utils/db");

exports.getMessages = async (req, res) => {
    const { idChat, numUsuari } = req.query;

    if (!idChat) {
        return res.status(400).json({ error: 'idChat és requerit' });
    }

    try {
        const connection = await connectToDatabase();
        const userIdCondition = numUsuari == 1 ? "visibleUsr1" : "visibleUsr2";

        const [rows] = await connection.execute(
            `SELECT * FROM mensajes WHERE idChat = ? AND ${userIdCondition} = 1`,
            [idChat]
        );
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No s\'han trobat missatges per aquest idChat' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error carregant els missatges:', error.message);
        res.status(500).json({ error: 'Error carregant els missatges' });
    }
};

exports.createMessage = async (req, res) => {
    const { idChat, usuario, mensaje } = req.body;

    if (!idChat || !usuario || !mensaje) {
        return res.status(400).json({ error: 'idChat, usuario i mensaje són requerits' });
    }

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            'INSERT INTO mensajes (idChat, usuario, mensaje, fecha, visibleUsr1, visibleUsr2) VALUES (?, ?, ?, NOW(), 1, 1)',
            [idChat, usuario, mensaje]
        );
        await connection.end();

        res.status(201).json({
            id: result.insertId,
            idChat,
            usuario,
            mensaje,
            fecha: new Date(),
            visibleUsr1: 1,
            visibleUsr2: 1,
        });
    } catch (error) {
        console.error('Error enviant el missatge:', error.message);
        res.status(500).json({ error: 'Error enviant el missatge' });
    }
};

exports.deleteMessagesIfHidden = async (req, res) => {
    const { idChat } = req.query;

    if (!idChat) {
        return res.status(400).json({ error: 'idChat és requerit' });
    }

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            'DELETE FROM mensajes WHERE idChat = ? AND visibleUsr1 = 0 AND visibleUsr2 = 0',
            [idChat]
        );
        await connection.end();

        res.status(200).json({ message: `S'han eliminat ${result.affectedRows} missatges del xat amb idChat ${idChat}` });
    } catch (error) {
        console.error('Error eliminant els missatges:', error.message);
        res.status(500).json({ error: 'Error eliminant els missatges' });
    }
};

exports.deleteUserMessages = async (req, res) => {
    const { idChat, usuario } = req.query;

    if (!idChat || !usuario) {
        return res.status(400).json({ error: 'idChat i usuario són requerits' });
    }

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            'DELETE FROM mensajes WHERE idChat = ? AND usuario = ?',
            [idChat, usuario]
        );
        await connection.end();

        res.status(200).json({ message: `S'han eliminat ${result.affectedRows} missatges del xat amb idChat ${idChat}` });
    } catch (error) {
        console.error('Error eliminant els missatges:', error.message);
        res.status(500).json({ error: 'Error eliminant els missatges' });
    }
};

exports.hideUserMessages = async (req, res) => {
    const { idChat, usuario } = req.query;
    const update = usuario == 1 ? "visibleUsr1" : "visibleUsr2";

    if (!idChat || !usuario) {
        return res.status(400).json({ error: 'idChat i usuario són requerits' });
    }

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            `UPDATE mensajes SET ${update} = 0 WHERE idChat = ?`,
            [idChat]
        );
        await connection.end();

        res.status(200).json({ message: `S'han actualitzat ${result.affectedRows} missatges del xat amb idChat ${idChat}` });
    } catch (error) {
        console.error('Error actualitzant els missatges:', error.message);
        res.status(500).json({ error: 'Error actualitzant els missatges' });
    }
};
