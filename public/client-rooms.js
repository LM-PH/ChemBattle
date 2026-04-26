const socket = io();

const Rooms = {
    showStep(stepId) {
        document.querySelectorAll('.mm-step').forEach(s => s.style.display = 'none');
        document.getElementById(`mm-${stepId}`).style.display = 'block';
    },

    openMenu() {
        showScreen('matchmaking');
        this.showStep('main-menu');
    },

    // Inicia proceso para sala pública
    preparePublic() {
        this.showStep('name-public');
    },

    create(isPublic) {
        const roomName = isPublic ? document.getElementById('public-room-name-input').value.trim() : "";
        
        document.getElementById('matchmaking-status').innerText = "Esperando al rival...";
        document.getElementById('wait-room-type').innerText = isPublic ? "BATALLA PÚBLICA" : "BATALLA PRIVADA";
        this.showStep('waiting-area');
        
        socket.emit('create_room', { 
            playerData: { userId: myId, nickname: playerName }, 
            isPublic: isPublic,
            roomName: roomName
        });
    },

    join(code) {
        if (!code) return alert("Ingresa un código");
        socket.emit('join_room', { 
            userId: myId, 
            nickname: playerName, 
            roomCode: code.toUpperCase().trim() 
        });
    },

    refreshLobby() {
        socket.emit('get_public_rooms');
    }
};

// --- LISTENERS DE SOCKET ---

socket.on('room_created', (data) => {
    document.getElementById('my-room-code').innerText = data.code;
});

socket.on('public_rooms_updated', (rooms) => {
    const list = document.getElementById('public-rooms-list');
    list.innerHTML = '';

    if (rooms.length === 0) {
        list.innerHTML = '<p class="empty-msg" style="opacity:0.5; padding:20px;">No hay salas públicas activas ahora.</p>';
        return;
    }

    rooms.forEach(room => {
        const div = document.createElement('div');
        div.className = 'room-item';
        div.style = 'display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.05); margin-bottom:8px; border-radius:10px; border:1px solid rgba(255,255,255,0.05);';
        
        // Estilo para el ranking (Medalla si es Top 3)
        let rankDisplay = `#${room.host.rank}`;
        let rankStyle = 'color:rgba(255,255,255,0.5);';
        if(room.host.rank === 1) { rankDisplay = '🥇 #1'; rankStyle = 'color:#ffd700; font-weight:bold;'; }
        else if(room.host.rank === 2) { rankDisplay = '🥈 #2'; rankStyle = 'color:#c0c0c0; font-weight:bold;'; }
        else if(room.host.rank === 3) { rankDisplay = '🥉 #3'; rankStyle = 'color:#cd7f32; font-weight:bold;'; }

        div.innerHTML = `
            <div style="text-align:left;">
                <span style="display:block; font-size:1rem; color:var(--neon-green); font-weight:bold; text-transform:uppercase; letter-spacing:1px;">${room.name}</span>
                <div style="display:grid; grid-template-columns: auto auto; gap:5px 15px; margin-top:4px;">
                    <span style="font-size:0.75rem; color:white; opacity:0.9;">Host: ${room.host.nickname}</span>
                    <span style="font-size:0.7rem; ${rankStyle} background:rgba(0,0,0,0.3); padding:2px 8px; border-radius:20px; width:fit-content;">${rankDisplay}</span>
                    <span style="font-size:0.65rem; color:rgba(255,255,255,0.7); grid-column: 1 / span 2;">Rango: ${room.host.levelEmoji} ${room.host.levelName}</span>
                </div>
            </div>
            <button onclick="Rooms.join('${room.code}')" class="btn-primary" style="padding:8px 20px; font-size:0.8rem; border-radius:5px; transform:none;">UNIRSE</button>
        `;
        list.appendChild(div);
    });
});

socket.on('error_message', (msg) => {
    alert(msg);
});

socket.on('match_found', (matchData) => {
    const p1 = matchData.players[0];
    const p2 = matchData.players[1];
    const isP1 = p1.userId === myId;
    const rivalName = isP1 ? p2.nickname : p1.nickname;
    
    window.setupMatchFromSocket(matchData.equationIdx, rivalName);
});

socket.on('match_finished', (resultData) => {
    if (window.showResults) {
        window.showResults({
            winner_id: resultData.winnerUserId,
            winner_name: resultData.winnerNickname,
            time: resultData.time
        });
    }
});

socket.on('opponent_disconnected', (data) => {
    if (window.showResults) {
        window.showResults({
            winner_id: myId,
            winner_name: playerName,
            time: "Abandono",
            isAbandonment: true,
            customMessage: data.message || "Tu oponente se desconectó. Has ganado."
        });
    } else {
        alert("Tu oponente se desconectó.");
        showScreen('landing');
    }
});

// --- ASIGNACIÓN DE BOTONES ---

document.getElementById('btn-show-create-options').onclick = () => Rooms.showStep('create-options');
document.getElementById('btn-show-join-private').onclick = () => Rooms.showStep('join-private');
document.getElementById('btn-show-public-lobby').onclick = () => {
    Rooms.showStep('public-lobby');
    Rooms.refreshLobby();
};

document.getElementById('btn-goto-name-public').onclick = () => Rooms.preparePublic();
document.getElementById('btn-confirm-create-public').onclick = () => Rooms.create(true);
document.getElementById('btn-create-private').onclick = () => Rooms.create(false);

document.getElementById('btn-join-room').onclick = () => Rooms.join(document.getElementById('join-code-input').value);
document.getElementById('btn-refresh-lobby').onclick = () => Rooms.refreshLobby();

document.querySelectorAll('.btn-back-mm').forEach(btn => {
    btn.onclick = () => Rooms.showStep('main-menu');
});

document.getElementById('btn-cancel-match').onclick = () => {
    socket.emit('leave_room');
    Rooms.openMenu();
};
document.getElementById('btn-back-to-landing').onclick = () => showScreen('landing');

document.getElementById('btn-play').onclick = () => {
    if (!myId) return alert("Debes iniciar sesión primero");
    Rooms.openMenu();
};

window.socket = socket;
window.Rooms = Rooms;
