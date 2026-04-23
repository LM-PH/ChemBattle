const socket = io(); // Conecta al servidor de Socket.IO local

const Rooms = {
    startMatchmaking() {
        showScreen('matchmaking');
        document.getElementById('matchmaking-status').innerText = "Buscando oponente...";
        document.getElementById('room-controls').style.display = 'none';
        document.getElementById('waiting-area').style.display = 'block';
        document.getElementById('radar-anim').style.display = 'block';

        // Evia solicitud al servidor para buscar partida
        socket.emit('join_queue', { userId: myId, nickname: playerName });
    }
};

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

document.getElementById('btn-quick-play').onclick = () => Rooms.startMatchmaking();
// document.getElementById('btn-create-room').onclick = () => Rooms.createRoom(); // Opcional, lo podemos agregar despues
// document.getElementById('btn-join-room').onclick = () => { // Opcional };

document.getElementById('btn-play').onclick = () => {
    if (!myId) {
        alert("Debes iniciar sesión primero");
        return;
    }
    // Entramos directamente en matchmaking rápido
    Rooms.startMatchmaking();
};

window.socket = socket; // Para usarlo desde app.js al enviar respuesta
