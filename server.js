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
    school: String,
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
        const { email, password, name, nickname, grade, group, school } = req.body;
        // NOTA: Para producción DEBES encriptar la contraseña (ej. bcrypt)
        const newUser = new User({ email, password, name, nickname, grade, group, school });
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
        
        // --- ACCESO ADMINISTRADOR ---
        if (email === 'zlagustin10@gmail.com' && password === 'AdminChem2026!') {
            return res.json({ 
                success: true, 
                user: { 
                    _id: 'admin_id', 
                    email: 'zlagustin10@gmail.com', 
                    name: 'Administrador', 
                    isAdmin: true 
                } 
            });
        }

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

// --- ENDPOINTS ADMINISTRATIVOS ---
app.get('/api/admin/users', async (req, res) => {
    try {
        // Ordenar por Escuela, Grado y Grupo como prioridad
        const users = await User.find().sort({ school: 1, grade: 1, group: 1, name: 1 });
        res.json({ success: true, users });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.delete('/api/admin/user/:userId', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.json({ success: true, message: "Usuario eliminado" });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.delete('/api/admin/users/bulk', async (req, res) => {
    try {
        const { school, grade, group } = req.query;
        const filter = {};
        if (school) filter.school = school;
        if (grade) filter.grade = grade;
        if (group) filter.group = group;

        if (Object.keys(filter).length === 0) {
            return res.status(400).json({ success: false, error: "Debe especificar al menos un filtro para borrado masivo." });
        }

        const result = await User.deleteMany(filter);
        res.json({ success: true, message: `${result.deletedCount} usuarios eliminados.` });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.get('/api/user/:userId', async (req, res) => {
    try {
        if (req.params.userId === 'admin_id') {
            return res.json({ 
                success: true, 
                user: { 
                    _id: 'admin_id', 
                    email: 'zlagustin10@gmail.com', 
                    name: 'Administrador', 
                    isAdmin: true 
                } 
            });
        }
        const user = await User.findById(req.params.userId);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
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

// --- LÓGICA DE NIVELES ---
function getLevel(wins) {
    if (wins >= 200) return { name: "Gran Alquimista", emoji: "🧙", color: "#ff00ff" };
    if (wins >= 150) return { name: "Maestro de Síntesis", emoji: "🧫", color: "#ff8800" };
    if (wins >= 100) return { name: "Analista Químico", emoji: "🔬", color: "#00d2ff" };
    if (wins >= 50) return { name: "Técnico en Reacciones", emoji: "⚗️", color: "#00ff88" };
    return { name: "Ayudante de Laboratorio", emoji: "🥼", color: "#ffffff" };
}

app.get('/api/ranking', async (req, res) => {
    try {
        const { sort } = req.query;
        const sortParam = sort === 'wins' ? { wins: -1 } : { coins: -1 };
        const users = await User.find().sort(sortParam).limit(50);
        
        // Añadir info de nivel a cada usuario
        const usersWithLevels = users.map(u => {
            const level = getLevel(u.wins);
            return {
                ...u._doc,
                levelName: level.name,
                levelEmoji: level.emoji,
                levelColor: level.color
            };
        });

        res.json({ success: true, users: usersWithLevels });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// --- SOCKET.IO (JUEGO MULTIJUGADOR) ---
let matchmakingQueue = [];
let activeMatches = {};
let privateRooms = {}; 
let publicRooms = {}; // Almacena las salas públicas para el listado

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

    // Crear sala (Pública o Privada)
    socket.on('create_room', async (data) => {
        const { playerData, isPublic, roomName } = data;
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Calcular Ranking del Host
        let rank = "N/A";
        try {
            const hostData = await User.findById(playerData.userId);
            if (hostData) {
                const betterPlayers = await User.countDocuments({ wins: { $gt: hostData.wins } });
                rank = betterPlayers + 1;
                const level = getLevel(hostData.wins);
                playerData.levelName = level.name;
                playerData.levelEmoji = level.emoji;
            }
        } catch (err) {
            console.error("Error calculando rank para sala:", err);
        }

        const roomInfo = {
            code: code,
            name: roomName || `Sala de ${playerData.nickname}`,
            host: { 
                socketId: socket.id, 
                nickname: playerData.nickname, 
                userId: playerData.userId,
                rank: rank,
                levelName: playerData.levelName,
                levelEmoji: playerData.levelEmoji
            },
            status: 'waiting',
            isPublic: isPublic,
            createdAt: Date.now()
        };

        if (isPublic) {
            publicRooms[code] = roomInfo;
            console.log(`[Public] Sala creada: ${code} por ${playerData.nickname}`);
            io.emit('public_rooms_updated', Object.values(publicRooms)); // Avisar a todos
        } else {
            privateRooms[code] = roomInfo;
            console.log(`[Private] Sala creada: ${code} por ${playerData.nickname}`);
        }
        
        socket.join(code);
        socket.currentCreatedRoom = code; // Guardamos que este socket es el host de esta sala
        socket.emit('room_created', { code, isPublic });
    });

    // Obtener lista de salas públicas
    socket.on('get_public_rooms', () => {
        socket.emit('public_rooms_updated', Object.values(publicRooms));
    });

    // Unirse a sala (por código o desde lista pública)
    socket.on('join_room', (data) => {
        const { roomCode, userId, nickname } = data;
        let room = publicRooms[roomCode] || privateRooms[roomCode];

        if (room && room.status === 'waiting') {
            console.log(`[Match] ${nickname} se unió a la sala ${roomCode}`);
            const host = room.host;
            const matchId = "match_" + roomCode;

            activeMatches[matchId] = {
                players: [
                    { socketId: host.socketId, nickname: host.nickname, userId: host.userId },
                    { socketId: socket.id, nickname: nickname, userId: userId }
                ],
                status: 'playing',
                equationIdx: Math.floor(Math.random() * 50),
                ready: 0
            };

            const hostSocket = io.sockets.sockets.get(host.socketId);
            if (hostSocket) {
                hostSocket.join(matchId);
                socket.join(matchId);
                hostSocket.currentRoom = matchId;
                socket.currentRoom = matchId;
                
                hostSocket.currentCreatedRoom = null; // Ya no está esperando, está jugando

                io.to(matchId).emit('match_found', activeMatches[matchId]);
                
                // Limpiar de las listas de espera
                delete publicRooms[roomCode];
                delete privateRooms[roomCode];
                io.emit('public_rooms_updated', Object.values(publicRooms)); // Actualizar lista para todos
            }
        } else {
            socket.emit('error_message', "La sala ya no existe o está llena.");
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

    // Salir de una sala (Cancelar espera)
    socket.on('leave_room', () => {
        if (socket.currentCreatedRoom) {
            const code = socket.currentCreatedRoom;
            console.log(`[Cleanup] Borrando sala ${code}`);
            delete publicRooms[code];
            delete privateRooms[code];
            socket.leave(code);
            socket.currentCreatedRoom = null;
            io.emit('public_rooms_updated', Object.values(publicRooms));
        }
    });

    socket.on('disconnect', async () => {
        console.log('❌ Cliente desconectado:', socket.id);
        
        // --- LIMPIEZA DE SALAS EN ESPERA ---
        if (socket.currentCreatedRoom) {
            const code = socket.currentCreatedRoom;
            delete publicRooms[code];
            delete privateRooms[code];
            io.emit('public_rooms_updated', Object.values(publicRooms));
        }

        // Quitar de cola si estaba
        matchmakingQueue = matchmakingQueue.filter(id => id !== socket.id);
        
        // --- PENALIZACIÓN POR ABANDONO ---
        if (socket.currentRoom && activeMatches[socket.currentRoom]) {
            const match = activeMatches[socket.currentRoom];
            const leaver = match.players.find(p => p.socketId === socket.id);
            const winner = match.players.find(p => p.socketId !== socket.id);

            if (leaver && winner) {
                console.log(`⚠️ Abandono detectado: ${leaver.nickname} vs ${winner.nickname}`);
                
                try {
                    // 1. Castigar al que se fue (-3 monedas)
                    await User.findByIdAndUpdate(leaver.userId, { $inc: { coins: -3 } });
                    // Asegurar que no sea negativo (aunque $inc lo permite, es mejor cuidarlo)
                    const checks = await User.findById(leaver.userId);
                    if (checks.coins < 0) await User.findByIdAndUpdate(leaver.userId, { coins: 0 });

                    // 2. Premiar al que se quedó (+10 monedas, +1 victoria)
                    await User.findByIdAndUpdate(winner.userId, { $inc: { coins: 10, wins: 1 } });

                    // 3. Avisar al que se quedó
                    io.to(winner.socketId).emit('opponent_disconnected', {
                        message: "¡Victoria! Tu oponente ha huido del laboratorio.",
                        rewardCoins: 10,
                        rewardWins: 1
                    });
                } catch (err) {
                    console.error("Error procesando penalización por abandono:", err);
                }
            }
            delete activeMatches[socket.currentRoom];
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor ChemBattle corriendo en http://localhost:${PORT}`);
});
