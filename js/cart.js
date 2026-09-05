const API = 'api';

/* ── Helpers ───────────────────────────────────────────────────────────── */
function getUser() {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
}
function setupNav() {
    const user = getUser();
    const authLinks = document.getElementById('auth-links');
    if (!authLinks) return;
    if (user) {
        authLinks.innerHTML = `<a href="#" onclick="logout()">👋 ${user.name}</a><a href="#" onclick="logout()">Logout</a>`;
    } else {
        authLinks.innerHTML = `<a href="login.html">Login</a><a href="register.html">Register</a>`;
    }
}
async function logout() {
    await fetch(`${API}/logout.php`).catch(() => {});
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast ${type} show`;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}
async function updateCartCount() {
    const el = document.getElementById('cart-count');
    if (!el) return;
    try {
        const res = await fetch(`${API}/cart.php?action=count`);
        const data = await res.json();
        el.textContent = data.count || 0;
    } catch { el.textContent = 0; }
}
function escHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

/* ── Load Cart ─────────────────────────────────────────────────────────── */
async function loadCart() {
    const user = getUser();
    if (!user) { window.location.href = 'login.html'; return; }
    const container = document.getElementById('cart-container');
    const subtitle  = document.getElementById('cart-count-label');
    try {
        const res  = await fetch(`${API}/cart.php?action=get`);
        const data = await res.json();
        if (data.status === 'login') { window.location.href = 'login.html'; return; }
        if (!data.items || !data.items.length) {
            if (subtitle) subtitle.textContent = '';
            container.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="1.6">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                        </svg>
                    </div>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added anything yet.<br>Browse our fresh products and start shopping!</p>
                    <a href="products.html" class="btn-shop-now">Browse Products &rarr;</a>
                </div>`;
            return;
        }
        const itemCount  = data.items.reduce((s, i) => s + parseInt(i.quantity), 0);
        if (subtitle) subtitle.textContent = `You have ${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`;
        const subtotal   = parseFloat(data.total);
        const deliveryFee = subtotal >= 500 ? 0 : 60;
        const grandTotal  = subtotal + deliveryFee;
        const deliveryMsg = deliveryFee === 0
            ? `<strong style="margin-left:4px;">Free Delivery applied!</strong>`
            : `Add <strong style="margin:0 4px;">&#2547;${(500 - subtotal).toFixed(0)}</strong> more for free delivery`;

        container.innerHTML = `
            <div class="cart-layout">
                <div>
                    <div class="cart-items-panel">
                        <div class="cart-panel-header">
                            <span>Product</span>
                            <span>Unit Price</span>
                            <span>Quantity</span>
                            <span>Subtotal</span>
                            <span></span>
                        </div>
                        <div id="cart-body">
                            ${data.items.map(item => renderCartRow(item)).join('')}
                        </div>
                    </div>
                </div>
                <div>
                    <div class="cart-summary-panel">
                        <div class="summary-title">Order Summary</div>
                        <div class="free-delivery-banner">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#33691e" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                            ${deliveryMsg}
                        </div>
                        <div class="summary-row">
                            <span>Subtotal (${itemCount} item${itemCount !== 1 ? 's' : ''})</span>
                            <span>&#2547;${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Delivery Fee</span>
                            <span>${deliveryFee === 0 ? '<span style="color:#2e7d32;font-weight:700;">FREE</span>' : '&#2547;' + deliveryFee.toFixed(2)}</span>
                        </div>
                        <hr class="summary-divider">
                        <div class="summary-total-row">
                            <span class="label">Total</span>
                            <span class="amount" id="grand-total">&#2547;${grandTotal.toFixed(2)}</span>
                        </div>
                        <a href="checkout.html" class="btn-checkout">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                            Proceed to Checkout
                        </a>
                        <a href="products.html" class="btn-continue">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                            Continue Shopping
                        </a>
                        <div class="summary-secure">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            Secure &amp; encrypted checkout
                        </div>
                    </div>
                </div>
            </div>`;
    } catch (e) {
        container.innerHTML = `<div style="padding:24px;color:#c62828;background:#fff;border-radius:12px;">Failed to load cart. Please try again.</div>`;
    }
}

function renderCartRow(item) {
    const imgSrc = PROD_IMG.resolve(item, 'uploads/products/', 200, 200);
    const imgFb  = PROD_IMG.byName(item.name, item.category, 200, 200);
    return `
    <div class="cart-item-row" id="row-${item.product_id}">
        <div class="cart-item-info">
            <img class="cart-item-img" src="${imgSrc}" alt="${escHtml(item.name)}" onerror="this.src='${imgFb}'">
            <div>
                <div class="cart-item-name">${escHtml(item.name)}</div>
                <div class="cart-item-cat">${escHtml(item.category || 'Grocery')}</div>
            </div>
        </div>
        <div class="cart-item-price">&#2547;${parseFloat(item.price).toFixed(2)}</div>
        <div>
            <div class="cart-qty">
                <button onclick="changeQty('${item.product_id}', ${item.quantity - 1})">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span class="cart-qty-num" id="qty-${item.product_id}">${item.quantity}</span>
                <button onclick="changeQty('${item.product_id}', ${item.quantity + 1}, ${item.stock})">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
            </div>
        </div>
        <div class="cart-item-subtotal" id="sub-${item.product_id}">&#2547;${(item.price * item.quantity).toFixed(2)}</div>
        <div>
            <button class="cart-remove-btn" onclick="showRemoveModal('${item.product_id}')" title="Remove item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
    </div>`;
}

async function changeQty(productId, newQty, maxStock = 999) {
    if (newQty > maxStock) { showToast(`Only ${maxStock} in stock`, 'error'); return; }
    try {
        await fetch(`${API}/cart.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update', product_id: productId, quantity: newQty })
        });
        loadCart();
        updateCartCount();
    } catch { showToast('Failed to update quantity', 'error'); }
}

/* ── Remove Confirm Modal ──────────────────────────────────────────────── */
function showRemoveModal(productId) {
    const modal = document.getElementById('remove-modal');
    if (!modal) { removeItem(productId); return; }
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';

    const confirmBtn = document.getElementById('rm-confirm-btn');
    const cancelBtn  = document.getElementById('rm-cancel-btn');

    const closeModal = () => {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
    };

    // Remove old listeners by cloning
    const newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
    const newCancel = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

    document.getElementById('rm-confirm-btn').addEventListener('click', () => {
        closeModal();
        removeItem(productId);
    });
    document.getElementById('rm-cancel-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); }, { once: true });
}

async function removeItem(productId) {
    try {
        await fetch(`${API}/cart.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'remove', product_id: productId })
        });
        showToast('Item removed from cart', 'error');
        loadCart();
        updateCartCount();
    } catch { showToast('Failed to remove item', 'error'); }
}

setupNav();
loadCart();
updateCartCount();
