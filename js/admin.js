const API = '../api';

/* ── Auth Guard ────────────────────────────────────────────────────────── */
// Runs on every admin page load — redirects non-admins straight to login.
function getUser() {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
}

const _user = getUser();
if (!_user || _user.role !== 'admin') {
    window.location.href = '../login.html';
}

/* ── Logout (used by all admin pages) ────────────────────────────────── */
function adminLogout() {
    fetch(`${API}/logout.php`).catch(() => {});
    localStorage.removeItem('user');
    window.location.href = '../login.html';
}
