require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require('mysql2/promise');
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS para permitir peticiones desde frontend
app.use(cors());
app.use(express.json());

// Configurar Supabase con la Service Role Key
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Endpoint para obtener usuarios
app.get("/users", async (req, res) => {
    try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

async function connectToDatabase() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
}

app.get('/api/chats/all', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT * FROM chats'); // Canvia "chats" pel nom de la teva taula
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Error carregant dades:', error.message);
        res.status(500).json({ error: 'Error carregant dades' });
    }
});


// app.get('/api/chats', async (req, res) => {
//     const { usuari1 } = req.query;

//     if (!usuari1) {
//         return res.status(400).json({ error: 'Usuari1 és requerit' });
//     }

//     try {
//         const connection = await connectToDatabase();
//         const [rows] = await connection.execute(
//             'SELECT * FROM chats WHERE usuari1 = ? OR usuari2 = ?',
//             [usuari1, usuari1]
//         );
//         await connection.end();
//         res.json(rows);
//     } catch (error) {
//         console.error('Error carregant els xats:', error.message);
//         res.status(500).json({ error: 'Error carregant els xats' });
//     }
// });


// app.post('/api/chats', async (req, res) => {
    
//     const usuari1 = req.query.usuari1;
//     const usuari2 = req.query.usuari2;

//     if (!usuari1 || !usuari2) {
//         return res.status(400).json({ error: 'Usuari1 i Usuari2 són requerits' });
//     }

//     try {
//         const connection = await connectToDatabase();
//         const [result] = await connection.execute(
//             'INSERT INTO chats (usuari1, usuari2) VALUES (?, ?)',
//             [usuari1, usuari2]
//         );
//         await connection.end();
//         res.status(201).json({ id: result.insertId, usuari1, usuari2 });
//     } catch (error) {
//         console.error('Error creant el xat:', error.message);
//         res.status(500).json({ error: 'Error creant el xat' });
//     }
// }
// );


// app.get('/api/messages', async (req, res) => {
//     console.log("Rebent petició GET per missatges");
//     const { idChat } = req.query; // Canvia "chatID" per "idChat"
//     console.log("idChat rebut al backend:", idChat);
//     if (!idChat) {
//         return res.status(400).json({ error: 'idChat és requerit' });
//     }

//     try {
//         const connection = await connectToDatabase();
//         const [rows] = await connection.execute(
//             'SELECT * FROM mensajes WHERE idChat = ?', // Assegura't que "chatID" és el nom correcte a la base de dades
//             [idChat]
//         );
//         await connection.end();

//         if (rows.length === 0) {
//             return res.status(404).json({ error: 'No s\'han trobat missatges per aquest idChat' });
//         }

//         res.json(rows);
//     } catch (error) {
//         console.error('Error carregant els missatges:', error.message);
//         res.status(500).json({ error: 'Error carregant els missatges' });
//     }
// });

app.get('/api/chats/:idChat', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT * FROM chats WHERE idChat = ?',
            [req.params.idChat]
        ); // Canvia "chats" pel nom de la teva taula
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Error carregant dades:', error.message);
        res.status(500).json({ error: 'Error carregant dades' });
    }
});

app.get('/api/chats', async (req, res) => {
    const { usuari1 } = req.query;

    if (!usuari1) {
        return res.status(400).json({ error: 'Usuari1 és requerit' });
    }

    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute(
            'SELECT * FROM chats WHERE usuari1 = ? AND visibleUsr1 = 1 OR usuari2 = ? AND visibleUsr2 = 1',
            [usuari1, usuari1]
        );
        await connection.end();

        const chats = rows.map((chat) => ({
            ...chat,
            confirmUsuari2: Number(chat.confirmUsuari2), // Converteix a número
        }));

        res.json(rows);
    } catch (error) {
        console.error('Error carregant els xats:', error.message);
        res.status(500).json({ error: 'Error carregant els xats' });
    }
});

app.post('/api/chats', async (req, res) => {
    
    const usuari1 = req.query.usuari1;
    const usuari2 = req.query.usuari2;
    // const usuariActual = req.query.usuariActual;

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
        res.status(201).json({ id: result.insertId, usuari1, usuari2, confirmUsuari2: 0 ,visibleUsr1: 1, visibleUsr2: 1 });
    } catch (error) {
        console.error('Error creant el xat:', error.message);
        res.status(500).json({ error: 'Error creant el xat' });
    }
}
);

app.put('/api/chats/confirm/:idChat', async (req, res) => {
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

        res.status(200).json({ message: `El xat amb idChat ${idChat} ha estat actualitzat` });
    } catch (error) {
        console.error('Error actualitzant el xat:', error.message);
        res.status(500).json({ error: 'Error actualitzant el xat' });
    }
});

app.get('/api/messages/', async (req, res) => {
    console.log("Rebent petició GET per missatges");
    const { idChat, numUsuari } = req.query;
    console.log("idChat rebut al backend:", idChat);
    console.log("numUsuari rebut al backend:", numUsuari);

    if (!idChat) {
        return res.status(400).json({ error: 'idChat és requerit' });
    }

    try {
        const connection = await connectToDatabase();
        userIdCondition = numUsuari == 1 ? "visibleUsr1" : "visibleUsr2";
        
        const [rows] = await connection.execute(
            'SELECT * FROM mensajes WHERE idChat = ? AND ' + userIdCondition + ' = 1',
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
});

app.post('/api/messages', async (req, res) => {
    const { idChat, usuario, mensaje } = req.body;

    console.log("Dades rebudes al backend:", { idChat, usuario, mensaje });

    if (!idChat || !usuario || !mensaje) {
        return res.status(400).json({ error: 'idChat, usuario i mensaje són requerits' });
    }

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            'INSERT INTO mensajes (idChat, usuario, mensaje, fecha, visibleUsr1, visibleUsr2) VALUES (?, ?, ?, NOW(),?,?)',
            [idChat, usuario, mensaje,1 ,1] 
        );
        console.log("Missatge inserit:", result);
        await connection.end();
        res.status(201).json({ id: result.insertId, idChat, usuario, mensaje, fecha: Date.now(), visibleUsr1: 1, visibleUsr2: 1 });
    } catch (error) {
        console.error('Error enviant el missatge:', error.message);
        res.status(500).json({ error: 'Error enviant el missatge' });
    }
});

app.put('/api/chats/visible/:idChat', async (req, res) => {
    const { idChat } = req.params;
    const { visibleUsr1 } = req.body; // Llegeix els valors del cos de la petició
    console.log("Dades rebudes al backend:", { idChat, reqBody: req.body });
    const update = visibleUsr1 === 1 ? "visibleUsr1" : "visibleUsr2"; // Inverteix el valor

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

        res.status(200).json({ message: `El xat amb idChat ${idChat} ha estat actualitzat correctament` });
    } catch (error) {
        console.error('Error actualitzant el xat:', error.message);
        res.status(500).json({ error: 'Error actualitzant el xat' });
    }
});


app.delete('/api/chats/:idChat', async (req, res) => {
    const { idChat } = req.params;

    console.log("Rebent petició DELETE per eliminar el xat:", idChat);

    if (!idChat) {
        return res.status(400).json({ error: 'idChat és requerit' });
    }

    try {
        const connection = await connectToDatabase();

        // Opcional: Elimina els missatges associats al xat
        await connection.execute('DELETE FROM mensajes WHERE idChat = ?', [idChat]);

        // Elimina el xat
        const [result] = await connection.execute(
            'DELETE FROM chats WHERE idChat = ?',
            [idChat]
        );
        console.log("Xat eliminat:", result.affectedRows);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No s\'ha trobat cap xat amb aquest idChat' });
        }

        res.status(200).json({ message: `El xat amb idChat ${idChat} ha estat eliminat` });
    } catch (error) {
        console.error('Error eliminant el xat:', error.message);
        res.status(500).json({ error: 'Error eliminant el xat' });
    }
});

app.delete('/api/messages', async (req, res) => {
    const { idChat } = req.query;

    console.log("Rebent petició DELETE per eliminar missatges del xat:", idChat);

    if (!idChat) {
        return res.status(400).json({ error: 'idChat és requerit' });
    }

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            'DELETE FROM mensajes WHERE idChat = ? AND  visibleUsr1 = 0 AND visibleUsr2 = 0',
            [idChat]
        );
        console.log("Missatges eliminats:", result.affectedRows);
        await connection.end();

        res.status(200).json({ message: `S'han eliminat ${result.affectedRows} missatges del xat amb idChat ${idChat}` });        
    } catch (error) {
        console.error('Error eliminant els missatges:', error.message);
        res.status(500).json({ error: 'Error eliminant els missatges' });
    }
});

app.delete('/api/messages/myMessages', async (req, res) => {
    const { idChat, usuario } = req.query;

    console.log("Rebent petició DELETE per eliminar missatges del xat:", idChat);

    if (!idChat) {
        return res.status(400).json({ error: 'idChat és requerit' });
    }

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            'DELETE FROM mensajes WHERE idChat = ? AND usuario = ?',
            [idChat, usuario]
        );
        console.log("Missatges eliminats:", result.affectedRows);
        await connection.end();

        res.status(200).json({ message: `S'han eliminat ${result.affectedRows} missatges del xat amb idChat ${idChat}` });
    } catch (error) {
        console.error('Error eliminant els missatges:', error.message);
        res.status(500).json({ error: 'Error eliminant els missatges' });
    }
});

app.put('/api/messages/myMessages', async (req, res) => {
    const { idChat, usuario } = req.query;
    const update = usuario == 1 ? "visibleUsr1" : "visibleUsr2";
    console.log("Rebent petició PUT per amagar missatges del xat:", idChat);
    console.log("Dades rebudes al backend:", { idChat, usuario });

    if (!idChat || !usuario) {
        return res.status(400).json({ error: 'idChat i usuario són requerits' });
    }

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            `UPDATE mensajes SET ${update} = 0 WHERE idChat = ?`,
            [idChat]
        );
        console.log("Missatges actualitzats:", result.affectedRows);
        await connection.end();

        res.status(200).json({ message: `S'han actualitzat ${result.affectedRows} missatges del xat amb idChat ${idChat}` });
    } catch (error) {
        console.error('Error actualitzant els missatges:', error.message);
        res.status(500).json({ error: 'Error actualitzant els missatges' });
    }
});

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`Servidor en execució al port ${PORT}`);
// });
