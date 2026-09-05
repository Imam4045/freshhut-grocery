const API = 'api';

/* ── Login ─────────────────────────────────────────────────────────────── */
async function doLogin() {
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember-me')?.checked || false;
    const msg      = document.getElementById('msg');

    if (!email || !password) {
        msg.innerHTML = `<div class="alert alert-danger">Please enter your email and password.</div>`;
        return;
    }

    const btn = document.querySelector('button');
    btn.textContent = 'Logging in...';
    btn.disabled    = true;

    try {
        const res  = await fetch(`${API}/login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, remember })
        });
        const data = await res.json();

        if (data.status === 'success') {
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role === 'admin') {
                window.location.href = 'admin/index.html';
            } else {
                // Redirect to previous page if available
                const redirect = sessionStorage.getItem('redirect_after_login') || 'index.html';
                sessionStorage.removeItem('redirect_after_login');
                window.location.href = redirect;
            }
        } else {
            msg.innerHTML = `<div class="alert alert-danger">❌ ${data.message}</div>`;
            btn.textContent = 'Login';
            btn.disabled    = false;
        }
    } catch (e) {
        msg.innerHTML = `<div class="alert alert-danger">❌ Connection error. Is the server running?</div>`;
        btn.textContent = 'Login';
        btn.disabled    = false;
    }
}

/* ── Register ──────────────────────────────────────────────────────────── */
async function doRegister() {
    const name     = document.getElementById('name').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const phone    = document.getElementById('phone').value.trim();
    const address  = document.getElementById('address').value.trim();
    const msg      = document.getElementById('msg');

    if (!name || !email || !password) {
        msg.innerHTML = `<div class="alert alert-danger">Name, email and password are required.</div>`;
        return;
    }
    if (password.length < 6) {
        msg.innerHTML = `<div class="alert alert-danger">Password must be at least 6 characters.</div>`;
        return;
    }

    const btn = document.querySelector('button');
    btn.textContent = 'Creating account...';
    btn.disabled    = true;

    try {
        const res  = await fetch(`${API}/register.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone, address })
        });
        const data = await res.json();

        if (data.status === 'success') {
            msg.innerHTML = `<div class="alert alert-success">✅ Account created! <a href="login.html">Login now →</a></div>`;
            btn.textContent = 'Create Account';
            btn.disabled    = false;
        } else {
            msg.innerHTML = `<div class="alert alert-danger">❌ ${data.message}</div>`;
            btn.textContent = 'Create Account';
            btn.disabled    = false;
        }
    } catch (e) {
        msg.innerHTML = `<div class="alert alert-danger">❌ Connection error. Is the server running?</div>`;
        btn.textContent = 'Create Account';
        btn.disabled    = false;
    }
}

/* ── Allow Enter key ───────────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        if (document.getElementById('name')) doRegister();
        else doLogin();
    }
});
