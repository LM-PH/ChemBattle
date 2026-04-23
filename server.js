require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// --- CONFIGURACIÓN BÁSICA DE EXPRESS ---
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Sirve nuestros archivos del front-end

// --- CONEXIÓN A MONGODB ---
// Primero intentará usar la variable en .env, si no, usa una DB local.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chembattle';
mongoose.connect(MONGO_URI)
    .then(() => console.log('🍃 MongoDB conectado correctamente'))
    .catch((err) => console.error('Error conectando a MongoDB:', err));

// --- MODELOS MONGODB BÁSICOS ---
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    nickname: String,
    grade: String,
    group: String,
    coins: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    powers: {
        freeze: { type: Number, default: 0 },
        confuse: { type: Number, default: 0 }
    }
});
const User = mongoose.model('User', userSchema);

// --- ENDPOINTS REST ---
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name, nickname, grade, group } = req.body;
        // NOTA: Para producción DEBES encriptar la contraseña (ej. bcrypt)
        const newUser = new User({ email, password, name, nickname, grade, group });
        await newUser.save();
        res.json({ success: true, message: "Usuario registrado con éxito", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Correo ya registrado o datos inválidos' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
});

app.post('/api/user/save', async (req, res) => {
    try {
        const { userId, coins, wins, powers } = req.body;
        await User.findByIdAndUpdate(userId, { coins, wins, powers });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.get('/api/ranking', async (req, res) => {
    try {
        const { sort } = req.query; // 'wins' or 'coins'
        const sortParam = sort === 'wins' ? { wins: -1 } : { coins: -1 };
        const users = await User.find().sort(sortParam).limit(50);
        res.json({ success: true, users });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// --- SOCKET.IO (JUEGO MULTIJUGADOR) ---
let matchmakingQueue = [];
let activeMatches = {};

io.on('connection', (socket) => {
    console.log('🔗 Cliente conectado:', socket.id);

    // Entrar al Matchmaking (Paso 1 del jugador)
    socket.on('join_queue', (playerData) => {
        console.log(`[Queue] ${playerData.nickname} se ha unido`);
        
        // Si hay alguien en la cola, emparejamos
        if (matchmakingQueue.length > 0) {
            const opponentId = matchmakingQueue.shift();
            const opponentSocket = io.sockets.sockets.get(opponentId);
            
            if (opponentSocket) {
                // Crear Match
                const roomCode = "room_" + Math.random().toString(36).substring(2, 8);
                activeMatches[roomCode] = {
                    players: [
                        { socketId: opponentId, nickname: opponentSocket.playerData.nickname, userId: opponentSocket.playerData.userId },
                        { socketId: socket.id, nickname: playerData.nickname, userId: playerData.userId }
                    ],
                    status: 'playing',
                    equationIdx: Math.floor(Math.random() * 20), // 20 ecuaciones de ejemplo
                    ready: 0
                };
                
                // Unir a ambos a la sala de Socket
                opponentSocket.join(roomCode);
                socket.join(roomCode);
                
                opponentSocket.currentRoom = roomCode;
                socket.currentRoom = roomCode;

                // Informar a ambos que el juego empieza
                io.to(roomCode).emit('match_found', activeMatches[roomCode]);
                console.log(`[Match] Sala creada: ${roomCode}`);
            }
        } else {
            // Entrar en cola
            socket.playerData = playerData; // Guardamos en el objeto temporalmente
            matchmakingQueue.push(socket.id);
        }
    });

    // Enviar resultado de la ecuación validada
    socket.on('submit_answer', (data) => {
        const room = socket.currentRoom;
        if (room && activeMatches[room]) {
            // El primero que la tiene correcta, gana y avisa al otro
            io.to(room).emit('match_finished', {
                winnerSocketId: socket.id,
                winnerUserId: data.userId,
                winnerNickname: data.nickname,
                time: data.time
            });
            delete activeMatches[room];
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado:', socket.id);
        // Quitar de cola si estaba
        matchmakingQueue = matchmakingQueue.filter(id => id !== socket.id);
        
        // Finalizar partida si estaba en una
        if (socket.currentRoom && activeMatches[socket.currentRoom]) {
            socket.to(socket.currentRoom).emit('opponent_disconnected');
            delete activeMatches[socket.currentRoom];
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor ChemBattle corriendo en http://localhost:${PORT}`);
});
