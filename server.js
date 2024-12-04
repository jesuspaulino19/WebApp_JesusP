const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');

const app = express();
const PORT = 777;

// Crear o abrir la base de datos SQLite
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');
        // Crear tabla de usuarios si no existe
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`);
    }
});

// Middleware
app.use(express.static(path.join(__dirname, '/')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'clave-secreta',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));

// Middleware para proteger rutas
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('index.html'); // Redirige al login si no hay sesión activa
    }
    next();
}

// Rutas
app.get('/', (req, res) => {
    // Si el usuario está autenticado, redirige al juego.
    if (req.session.user) {
        return res.redirect('game.html');
    }
    // Si no, muestra el login.
    res.sendFile(path.join(__dirname, '', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '', 'register.html'));
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.send('Error en la base de datos');
        }

        if (row) {
            return res.redirect('/register?error=Usuario ya registrado');
        }

        // Si el usuario no existe, registrarlo
        const hashedPassword = bcrypt.hashSync(password, 10);
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
            if (err) {
                return res.send('Error al registrar el usuario');
            }
            res.redirect('/'); // Redirige al login después de registrar
        });
    });
});

app.post('/index', (req, res) => {
    const { username, password } = req.body;

    // Verificar si el usuario es el admin predeterminado
    if (username === 'admin' && password === '20230819') {
        req.session.user = { username: 'admin' };
        return res.redirect('/game');
    }

    // Si no es el admin, verificar en la base de datos
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.send('Error en la base de datos');
        }

        if (row && bcrypt.compareSync(password, row.password)) {
            req.session.user = { username: row.username };
            return res.redirect('/game');
        }

        // Si las credenciales son incorrectas
        res.redirect('/?error=Credenciales incorrectas');
    });
});

// Ruta protegida para el juego
app.get('/game', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '', 'game.html'));
});

// Cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
