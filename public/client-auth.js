const Auth = {
    checkSession() {
        const storedUser = localStorage.getItem('_cb_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (window.setPlayerFromAuth) {
                window.setPlayerFromAuth({
                    userId: user._id,
                    nickname: user.nickname,
                    coins: user.coins,
                    wins: user.wins,
                    powers: user.powers || { freeze: 0, confuse: 0 }
                });
            }
        } else {
            console.log("No active session");
        }
    },

    async register(data) {
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: data.email,
                    password: data.pass,
                    name: data.name,
                    nickname: data.nickname,
                    grade: data.grade,
                    group: data.group
                })
            });
            const json = await res.json();
            if (json.success) {
                localStorage.setItem('_cb_user', JSON.stringify(json.user));
                window.location.reload();
            } else {
                alert("Error en registro: " + json.error);
            }
        } catch (e) {
            alert("Error en registro: " + e.message);
        }
    },

    async login(email, password) {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const json = await res.json();
            if (json.success) {
                localStorage.setItem('_cb_user', JSON.stringify(json.user));
                window.location.reload();
            } else {
                alert("Error en login: " + json.error);
            }
        } catch (e) {
            alert("Error en login: " + e.message);
        }
    },

    logout() {
        localStorage.removeItem('_cb_user');
        window.location.reload();
    }
};

// Toggle forms
document.getElementById('go-to-register').onclick = () => {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'flex';
};

document.getElementById('go-to-login').onclick = () => {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'flex';
};

// Event Listeners
document.getElementById('btn-register-submit').onclick = () => {
    const data = {
        name: document.getElementById('reg-name').value,
        nickname: document.getElementById('reg-nickname').value,
        grade: document.getElementById('reg-grade').value,
        group: document.getElementById('reg-group').value,
        email: document.getElementById('reg-email').value,
        pass: document.getElementById('reg-pass').value
    };
    Auth.register(data);
};

document.getElementById('btn-login').onclick = () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    Auth.login(email, pass);
};

document.getElementById('btn-logout').onclick = () => Auth.logout();

// Auth.checkSession(); removido para evitar colisión con app.js
