const socket = io(); // Conecta al servidor de Socket.IO local

const Rooms = {
    // Solo muestra el menú de selección (Rápida, Crear, Unirse)
    openMenu() {
        showScreen('matchmaking');
        document.getElementById('room-controls').style.display = 'flex';
        document.getElementById('waiting-area').style.display = 'none';
        document.getElementById('radar-anim').style.display = 'none';
    },

    startMatchmaking() {
        document.getElementById('matchmaking-status').innerText = "Buscando oponente...";
        document.getElementById('room-controls').style.display = 'none';
        document.getElementById('waiting-area').style.display = 'block';
        document.getElementById('radar-anim').style.display = 'block';
        document.getElementById('my-room-code').innerText = "---";

        // Envía solicitud al servidor para buscar partida rápida
        socket.emit('join_queue', { userId: myId, nickname: playerName });
    },

    createRoom() {
        document.getElementById('matchmaking-status').innerText = "Esperando al rival...";
        document.getElementById('room-controls').style.display = 'none';
        document.getElementById('waiting-area').style.display = 'block';
        document.getElementById('radar-anim').style.display = 'block';
        
        socket.emit('create_private_room', { userId: myId, nickname: playerName });
    },

    joinRoom() {
        const code = document.getElementById('join-code-input').value.toUpperCase().trim();
        if (!code) return alert("Ingresa un código");
        
        socket.emit('join_private_room', { 
            userId: myId, 
            nickname: playerName, 
            roomCode: code 
        });
    }
};
// Al crear sala privada, el servidor nos manda el código
socket.on('room_created', (code) => {
    document.getElementById('my-room-code').innerText = code;
});

socket.on('error_message', (msg) => {
    alert(msg);
});

// Listener para cuando el servidor encuentra partida
socket.on('match_found', (matchData) => {
    // data.players; data.status; data.equationIdx 
    
    // Identificar rol
    const p1 = matchData.players[0];
    const p2 = matchData.players[1];
    const isP1 = p1.userId === myId;
    
    const rivalName = isP1 ? p2.nickname : p1.nickname;
    
    // Pasar a app.js la carga de la partida
    window.setupMatchFromSocket(matchData.equationIdx, rivalName);
});

// Listener cuando alguien gana la partida
socket.on('match_finished', (resultData) => {
    if (window.showResults) {
        window.showResults({
            winner_id: resultData.winnerUserId,
            winner_name: resultData.winnerNickname,
            time: resultData.time
        });
    }
});

// Cuando el rival se desconecta
socket.on('opponent_disconnected', () => {
    alert("Tu oponente se desconectó. Has ganado por abandono.");
    window.showResults({
        winner_id: myId,
        winner_name: playerName,
        time: 0
    });
});


document.getElementById('btn-create-room').onclick = () => Rooms.createRoom();
document.getElementById('btn-join-room').onclick = () => Rooms.joinRoom();
document.getElementById('btn-cancel-match').onclick = () => showScreen('landing');

document.getElementById('btn-play').onclick = () => {
    if (!myId) return alert("Debes iniciar sesión primero");
    Rooms.openMenu();
};

window.socket = socket; // Para usarlo desde app.js al enviar respuesta
