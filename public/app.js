// --- CONFIGURATION ---
// Firebase backend removido, se utiliza Appwrite en appwrite-auth.js y appwrite-rooms.js

const EQUATIONS_BANK = [
    // --- EASY ---
    { reactants: ["H2", "O2"], products: ["H2O"] },
    { reactants: ["N2", "H2"], products: ["NH3"] },
    { reactants: ["Mg", "O2"], products: ["MgO"] },
    { reactants: ["Na", "Cl2"], products: ["NaCl"] },
    { reactants: ["K", "I2"], products: ["KI"] },
    { reactants: ["C", "O2"], products: ["CO"] },
    { reactants: ["S", "O2"], products: ["SO2"] },
    { reactants: ["Fe", "Cl2"], products: ["FeCl3"] },
    { reactants: ["Ca", "O2"], products: ["CaO"] },
    { reactants: ["P", "O2"], products: ["P2O5"] },
    { reactants: ["Li", "O2"], products: ["Li2O"] },
    { reactants: ["Be", "Cl2"], products: ["BeCl2"] },
    { reactants: ["B", "O2"], products: ["B2O3"] },
    { reactants: ["HgO"], products: ["Hg", "O2"] },
    { reactants: ["Ag2O"], products: ["Ag", "O2"] },
    { reactants: ["NO", "O2"], products: ["NO2"] },
    { reactants: ["CO", "O2"], products: ["CO2"] },
    { reactants: ["N2O3", "H2O"], products: ["HNO2"] },
    { reactants: ["P4", "O2"], products: ["P4O10"] },
    { reactants: ["Ba", "O2"], products: ["BaO"] },

    // --- MEDIUM ---
    { reactants: ["CH4", "O2"], products: ["CO2", "H2O"] },
    { reactants: ["Fe", "O2"], products: ["Fe2O3"] },
    { reactants: ["Al", "O2"], products: ["Al2O3"] },
    { reactants: ["Zn", "HCl"], products: ["ZnCl2", "H2"] },
    { reactants: ["KClO3"], products: ["KCl", "O2"] },
    { reactants: ["H2O2"], products: ["H2O", "O2"] },
    { reactants: ["Al", "Cl2"], products: ["AlCl3"] },
    { reactants: ["C3H8", "O2"], products: ["CO2", "H2O"] },
    { reactants: ["NaOH", "HCl"], products: ["NaCl", "H2O"] },
    { reactants: ["CaCO3"], products: ["CaO", "CO2"] },
    { reactants: ["NH4NO3"], products: ["N2O", "H2O"] },
    { reactants: ["SO2", "O2"], products: ["SO3"] },
    { reactants: ["Na", "H2O"], products: ["NaOH", "H2"] },
    { reactants: ["K", "H2O"], products: ["KOH", "H2"] },
    { reactants: ["Ca", "H2O"], products: ["Ca(OH)2", "H2"] },
    { reactants: ["C2H6", "O2"], products: ["CO2", "H2O"] },
    { reactants: ["C4H10", "O2"], products: ["CO2", "H2O"] },
    { reactants: ["Mg", "HCl"], products: ["MgCl2", "H2"] },
    { reactants: ["Fe", "H2SO4"], products: ["FeSO4", "H2"] },
    { reactants: ["Al", "H2SO4"], products: ["Al2(SO4)3", "H2"] },

    // --- ADVANCED ---
    { reactants: ["FeS2", "O2"], products: ["Fe2O3", "SO2"] },
    { reactants: ["NH3", "O2"], products: ["NO", "H2O"] },
    { reactants: ["C2H5OH", "O2"], products: ["CO2", "H2O"] },
    { reactants: ["KMnO4"], products: ["K2MnO4", "MnO2", "O2"] },
    { reactants: ["Pb(NO3)2"], products: ["PbO", "NO2", "O2"] },
    { reactants: ["Cu", "HNO3"], products: ["Cu(NO3)2", "NO", "H2O"] },
    { reactants: ["Al4C3", "H2O"], products: ["Al(OH)3", "CH4"] },
    { reactants: ["Ca3P2", "H2O"], products: ["Ca(OH)2", "PH3"] },
    { reactants: ["Fe2O3", "CO"], products: ["Fe", "CO2"] },
    { reactants: ["WO3", "H2"], products: ["W", "H2O"] },
    { reactants: ["Na2O", "H2O"], products: ["NaOH"] },
    { reactants: ["MgO", "H2O"], products: ["Mg(OH)2"] },
    { reactants: ["CO2", "H2O"], products: ["H2CO3"] },
    { reactants: ["SO3", "H2O"], products: ["H2SO4"] },
    { reactants: ["Na2CO3", "HCl"], products: ["NaCl", "H2O", "CO2"] },
    { reactants: ["NaHCO3"], products: ["Na2CO3", "H2O", "CO2"] },
    { reactants: ["H2SO4", "NaOH"], products: ["Na2SO4", "H2O"] },
    { reactants: ["Zn", "AgCl"], products: ["ZnCl2", "Ag"] },
    { reactants: ["BaCl2", "Na2SO4"], products: ["BaSO4", "NaCl"] },
    { reactants: ["AgNO3", "NaCl"], products: ["AgCl", "NaNO3"] }
];

function getRandomEquation() {
    return EQUATIONS_BANK[Math.floor(Math.random() * EQUATIONS_BANK.length)];
}

// --- CHEMICAL LOGIC ENGINE ---
const ChemParser = {
    // Advanced parser supporting parenthesis (e.g., Ca(OH)2)
    parseFormula(formula) {
        const atomCounts = {};
        const stack = [atomCounts];
        const regex = /([A-Z][a-z]*)(\d*)|(\()|(\))(\d*)/g;
        let match;

        while ((match = regex.exec(formula)) !== null) {
            const [full, element, count, open, close, multiplier] = match;
            const current = stack[stack.length - 1];

            if (element) {
                const n = parseInt(count) || 1;
                current[element] = (current[element] || 0) + n;
            } else if (open) {
                const subGroup = {};
                stack.push(subGroup);
            } else if (close) {
                const subGroup = stack.pop();
                const m = parseInt(multiplier) || 1;
                const parent = stack[stack.length - 1];
                for (let el in subGroup) {
                    parent[el] = (parent[el] || 0) + (subGroup[el] * m);
                }
            }
        }
        return atomCounts;
    },

    // Calculates the total atoms for one side (reactants or products)
    calculateSide(compounds, coefficients) {
        const sideTotals = {};
        compounds.forEach((formula, i) => {
            const coeff = coefficients[i] || 1;
            const atoms = this.parseFormula(formula);
            for (let el in atoms) {
                sideTotals[el] = (sideTotals[el] || 0) + (atoms[el] * coeff);
            }
        });
        return sideTotals;
    },

    // Main validation function
    validateEquation(reactants, products, userCoeffs) {
        const reactantCoeffs = userCoeffs.slice(0, reactants.length);
        const productCoeffs = userCoeffs.slice(reactants.length);

        const leftSide = this.calculateSide(reactants, reactantCoeffs);
        const rightSide = this.calculateSide(products, productCoeffs);

        const allElements = new Set([...Object.keys(leftSide), ...Object.keys(rightSide)]);
        const detail = {};
        let isCorrect = true;

        allElements.forEach(el => {
            const l = leftSide[el] || 0;
            const r = rightSide[el] || 0;
            detail[el] = { left: l, right: r };
            if (l !== r) isCorrect = false;
        });

        return { isCorrect, detail };
    }
};

// --- APP STATE ---

let playerName = "";
let myId = Math.random().toString(36).substring(7);
let currentMatchId = null;
let currentEq = null;
let startTime = null;
let matchListener = null;

// --- UI ELEMENTS ---
const screens = {
    landing: document.getElementById('landing-screen'),
    matchmaking: document.getElementById('matchmaking-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen'),
    ranking: document.getElementById('ranking-screen'),
    store: document.getElementById('store-screen')
};

const showScreen = (id) => {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[id].classList.add('active');
    if (id === 'landing' || id === 'store') updateUIStats();
};

// --- USER DATA SYSTEM ---
let userData = {
    coins: 0,
    powers: { freeze: 0, confuse: 0 }
};

window.setPlayerFromAuth = (player) => {
    myId = player.userId;
    playerName = player.nickname;
    userData.coins = player.coins || 0;
    userData.wins = player.wins || 0;
    userData.powers = player.powers || { freeze: 0, confuse: 0 };
    
    // UI Transitions
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('landing-screen').classList.add('active');
    
    // Sync login name with game input
    const nameInput = document.getElementById('player-name');
    if (nameInput) {
        nameInput.value = playerName;
        nameInput.disabled = true;
        nameInput.style.opacity = "0.5";
    }

    // Update visuals
    updateUIStats();
};

async function initUser() {
    console.log("🎮 Iniciando motor del juego...");
    // Intentar recuperar sesión del usuario si existe
    if (window.Auth && typeof window.Auth.checkSession === 'function') {
        console.log("🔐 Verificando sesión activa...");
        window.Auth.checkSession();
    } else {
        console.warn("⚠️ Módulo de autenticación no detectado aún.");
    }
}

initUser();

function updateUIStats() {
    const coinEls = [document.getElementById('user-coins'), document.getElementById('store-coins')];
    coinEls.forEach(el => { if(el) el.innerText = "🪙 " + userData.coins });
    
    const fCount = document.getElementById('inventory-freeze');
    const cCount = document.getElementById('inventory-confuse');
    if (fCount) fCount.innerText = `Tienes: ${userData.powers.freeze}`;
    if (cCount) cCount.innerText = `Tienes: ${userData.powers.confuse}`;
}

async function saveUser() {
    try {
        await fetch('/api/user/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: myId,
                coins: userData.coins,
                wins: userData.wins,
                powers: userData.powers
            })
        });
    } catch (e) {
        console.error("Error guardando usuario:", e);
    }
}

async function buyPower(type) {
    if (userData.coins >= 50) {
        userData.coins -= 50;
        userData.powers[type]++;
        await saveUser();
        updateUIStats();
    } else {
        alert("¡No tienes suficientes monedas! Gana más duelos.");
    }
}

document.getElementById('btn-show-store').onclick = () => showScreen('store');
document.getElementById('btn-back-store').onclick = () => showScreen('landing');
document.getElementById('buy-freeze').onclick = () => buyPower('freeze');
document.getElementById('buy-confuse').onclick = () => buyPower('confuse');
document.getElementById('btn-practice').onclick = () => startPractice();
document.getElementById('btn-ranking').onclick = () => loadRanking();
document.getElementById('btn-back-rank').onclick = () => showScreen('landing');
document.getElementById('btn-apply-rank').onclick = () => loadRanking();

async function loadRanking() {
    showScreen('ranking');
    const sortBy = document.getElementById('rank-sort').value; // 'wins' or 'coins'
    
    try {
        const res = await fetch(`/api/ranking?sort=${sortBy}`);
        const data = await res.json();
        const body = document.getElementById('ranking-body');
        body.innerHTML = "";

        if (data.success) {
            data.users.forEach((doc, i) => {
                const tr = document.createElement('tr');
                const posClass = i < 3 ? `pos-${i+1}` : "";
                tr.innerHTML = `
                    <td class="${posClass}">${i + 1}</td>
                    <td>${doc.nickname}</td>
                    <td>${sortBy === 'wins' ? doc.wins + ' 🏆' : doc.coins + ' 🪙'}</td>
                `;
                body.appendChild(tr);
            });
        }
    } catch (e) {
        console.error("Error al cargar ranking:", e);
    }
}
let isPracticeMode = false;
let aiData = { time: 999, isCorrect: false };

function startPractice() {
    isPracticeMode = true;
    playerName = "Científico";
    showScreen('game');
    
    currentEq = getRandomEquation();
    renderEquation(currentEq);
    
    document.getElementById('rival-name').innerText = "Bot-Einstein";
    
    // Simulate AI
    const aiTime = 5 + Math.random() * 10;
    const aiSuccess = Math.random() < 0.7;
    
    setTimeout(() => {
        if (!isPracticeMode) return;
        aiData = { time: aiTime.toFixed(1), isCorrect: aiSuccess };
        if (aiSuccess && aiTime < parseFloat(responseTime)) {
            // AI won before player
            stopGame();
            showResults({ 
                winner_id: "AI", 
                winner_name: "Bot-Einstein", 
                time: aiTime.toFixed(1) 
            });
        }
    }, aiTime * 1000);
}

function stopGame() {
    if (precisionTimerInterval) clearInterval(precisionTimerInterval);
}

// Matchmaking Firebase Removido.
// Appwrite maneja esto desde appwrite-rooms.js

let responseTime = 0;
let precisionTimerInterval = null;

function renderEquation(eq) {
    const display = document.getElementById('equation-display');
    const inputsContainer = document.getElementById('coefficient-inputs');
    let eqHtml = "";
    
    eq.reactants.forEach((c, i) => {
        eqHtml += `<span class="unit"><span class="box-idx" data-idx="${i}">?</span>${c.replace(/(\d+)/g, '<sub>$1</sub>')}</span>`;
        if (i < eq.reactants.length - 1) eqHtml += " + ";
    });
    eqHtml += " → ";
    eq.products.forEach((c, i) => {
        const idx = eq.reactants.length + i;
        eqHtml += `<span class="unit"><span class="box-idx" data-idx="${idx}">?</span>${c.replace(/(\d+)/g, '<sub>$1</sub>')}</span>`;
        if (i < eq.products.length - 1) eqHtml += " + ";
    });
    display.innerHTML = eqHtml;
    inputsContainer.innerHTML = "";
    const total = eq.reactants.length + eq.products.length;
    for (let i = 0; i < total; i++) {
        const input = document.createElement('input');
        input.type = "number";
        input.className = "coeff-input";
        input.oninput = (e) => {
            const box = document.querySelector(`.box-idx[data-idx="${i}"]`);
            if (box) box.innerText = e.target.value || "?";
        };
        inputsContainer.appendChild(input);
    }

    // Start precision timer
    startTime = Date.now();
    precisionTimerInterval = setInterval(() => {
        responseTime = ((Date.now() - startTime) / 1000).toFixed(1);
        const timerEl = document.getElementById('timer-text');
        if (timerEl) timerEl.innerText = responseTime + "s";
    }, 100);
}

function startTimer() {
    // This is the global match 60s countdown (optional, kept for compatibility)
    let sek = 60;
    const timer = setInterval(() => {
        sek--;
        if (sek <= 0 || currentMatchId === null) clearInterval(timer);
    }, 1000);
}

window.setupMatchFromSocket = (eqIdx, rivalName) => {
    currentEq = EQUATIONS_BANK[eqIdx];
    
    showScreen('game');
    renderEquation(currentEq);
    
    document.getElementById('rival-name').innerText = rivalName;
};

async function submitAnswer() {
    const userCoeffs = Array.from(document.querySelectorAll('.coeff-input')).map(n => parseInt(n.value) || 1);
    const result = ChemParser.validateEquation(currentEq.reactants, currentEq.products, userCoeffs);
    const equationBox = document.querySelector('.equation-box');

    const timeFinal = parseFloat(responseTime);

    if (!result.isCorrect) {
        equationBox.classList.add('shake', 'incorrect');
        setTimeout(() => equationBox.classList.remove('shake', 'incorrect'), 600);
        return;
    }

    stopGame();
    equationBox.classList.add('correct');
    
    if (isPracticeMode) {
        let winnerId = myId;
        if (aiData.isCorrect && parseFloat(aiData.time) < timeFinal) winnerId = "AI";
        showResults({
            winner_id: winnerId,
            winner_name: winnerId === myId ? playerName : "Bot-Einstein",
            time: winnerId === myId ? timeFinal : aiData.time
        });
        return;
    }

    // --- ACTUALIZAR MATCH VIA SOCKET ---
    if (window.socket) {
        window.socket.emit('submit_answer', {
            userId: myId,
            nickname: playerName,
            time: timeFinal
        });
    }
}

function showResults(data) {
    if (precisionTimerInterval) clearInterval(precisionTimerInterval);
    showScreen('result');
    const isWinner = data.winner_id === myId;
    const title = document.getElementById('result-title');
    title.innerText = isWinner ? "¡VICTORIA!" : "OPONENTE GANÓ";
    title.style.color = isWinner ? "var(--neon-green)" : "var(--error-red)";
    document.getElementById('result-my-time').innerText = "Tiempo: " + data.time + "s";
    
    // --- SISTEMA DE MONEDAS Y WINS (APPWRITE) ---
    const updateData = {};
    if (isWinner) {
        userData.coins += 10;
        userData.wins = (userData.wins || 0) + 1;
        updateData.wins = userData.wins;
    } else {
        userData.coins = Math.max(0, userData.coins - 3);
    }
    updateData.coins = userData.coins;
    
    updateUIStats();
    
    // Sync con API Local
    if (myId && !isPracticeMode) {
        saveUser();
    }

    // Limpieza al terminar la partida finalizada en Appwrite
    // TODO: Manejar eliminación de la partida de matchmaking_queue en backend o funciones si se requiere
}

// btn-play se adjunta en appwrite-rooms.js
document.getElementById('btn-submit').onclick = submitAnswer;
document.getElementById('btn-restart').onclick = () => location.reload();

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered!', reg))
            .catch(err => console.log('SW Registration Failed:', err));
    });
}
