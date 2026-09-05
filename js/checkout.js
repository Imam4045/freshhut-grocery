const API = 'api';

/* ── Discount / Promo State ────────────────────────────────────────────── */
const VALID_CODES = { 'FRESH10': { pct: 10, label: 'FRESH10' } };
let discountApplied = false;
let discountAmount  = 0;
let discountCode    = '';

function getUser() {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
}
function setupNav() {
    const user = getUser();
    const authLinks = document.getElementById('auth-links');
    if (!authLinks) return;
    if (user) {
        authLinks.innerHTML = `<a href="#" onclick="logout()">${user.name}</a><a href="#" onclick="logout()">Logout</a>`;
    } else {
        authLinks.innerHTML = `<a href="login.html">Login</a>`;
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
function escHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

/* ── Phone Edit Toggle ─────────────────────────────────────────────────── */
let phoneEditing = false;
function togglePhoneEdit() {
    const input = document.getElementById('co-phone');
    const btn   = document.getElementById('phone-edit-btn');
    if (!input || !btn) return;
    phoneEditing = !phoneEditing;
    if (phoneEditing) {
        input.readOnly = false;
        input.classList.remove('readonly-field');
        input.focus();
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"/></svg> Save`;
        btn.classList.add('save-mode');
    } else {
        input.readOnly = true;
        input.classList.add('readonly-field');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit`;
        btn.classList.remove('save-mode');
        showToast('Phone number updated', 'success');
    }
}

/* ── Payment Card Selection ────────────────────────────────────────────── */
function selectPayment(value) {
    document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
    const card = document.querySelector(`.payment-card[data-value="${value}"]`);
    if (card) card.classList.add('selected');
}

/* ── Load Checkout ─────────────────────────────────────────────────────── */
async function loadCheckout() {
    const user = getUser();
    if (!user) { window.location.href = 'login.html'; return; }

    const container = document.getElementById('checkout-container');

    try {
        const res  = await fetch(`${API}/cart.php?action=get`);
        const data = await res.json();

        if (data.status === 'login') { window.location.href = 'login.html'; return; }
        if (!data.items || !data.items.length) { window.location.href = 'cart.html'; return; }

        const subtotal    = parseFloat(data.total);
        const deliveryFee = subtotal >= 500 ? 0 : 60;
        const grandTotal  = subtotal + deliveryFee;
        const itemCount   = data.items.reduce((s, i) => s + parseInt(i.quantity), 0);

        // Reset discount state on each load
        discountApplied = false;
        discountAmount  = 0;
        discountCode    = '';
        window._coSubtotal  = subtotal;
        window._coDelivery  = deliveryFee;

        container.innerHTML = `
        <div class="co-grid">

            <!-- LEFT: Delivery Form -->
            <div>
                <!-- Contact & Delivery -->
                <div class="co-panel" style="margin-bottom:20px;">
                    <div class="co-panel-head">
                        <div class="co-panel-head-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <h3>Delivery Information</h3>
                    </div>
                    <div class="co-panel-body">

                        <div class="co-delivery-banner">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                            ${deliveryFee === 0
                                ? 'Free delivery applied on your order!'
                                : `Add <strong style="margin:0 4px;">&#2547;${(500 - subtotal).toFixed(0)}</strong> more to your cart for free delivery`
                            }
                        </div>

                        <!-- Name + Phone row -->
                        <div class="co-form-row">
                            <div class="co-field">
                                <label>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    Full Name
                                </label>
                                <input type="text" value="${escHtml(user.name)}" readonly class="readonly-field">
                                <span class="field-hint">Name from your account</span>
                            </div>
                            <div class="co-field">
                                <label>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.17 10.4 19.79 19.79 0 01.1 1.72 2 2 0 012.08 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                                    Phone Number
                                </label>
                                <div class="phone-row">
                                    <div class="co-field" style="margin-bottom:0;">
                                        <input type="tel" id="co-phone" value="${escHtml(user.phone || '')}" readonly class="readonly-field" placeholder="Enter phone number">
                                    </div>
                                    <button class="phone-edit-btn" id="phone-edit-btn" onclick="togglePhoneEdit()">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        Edit
                                    </button>
                                </div>
                                <span class="field-hint">You can update your number for this order</span>
                            </div>
                        </div>

                        <!-- Address -->
                        <div class="co-field">
                            <label>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                Delivery Address <span class="required">*</span>
                            </label>
                            <textarea id="del-address" placeholder="House/Flat no., Road no., Area, City...">${escHtml(user.address || '')}</textarea>
                        </div>


                    </div>
                </div>

                <!-- Payment Method -->
                <div class="co-panel">
                    <div class="co-panel-head">
                        <div class="co-panel-head-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                        </div>
                        <h3>Payment Method</h3>
                    </div>
                    <div class="co-panel-body">
                        <div class="payment-grid">
                            <label class="payment-card selected" data-value="Cash on Delivery" onclick="selectPayment('Cash on Delivery')">
                                <input type="radio" name="payment" value="Cash on Delivery" checked>
                                <div class="payment-card-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>
                                </div>
                                <div>
                                    <div class="payment-card-label">Cash on Delivery</div>
                                    <div class="payment-card-sub">Pay when received</div>
                                </div>
                            </label>
                            <label class="payment-card pay-bkash" data-value="bKash" onclick="selectPayment('bKash')">
                                <input type="radio" name="payment" value="bKash">
                                <div class="payment-card-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c2185b" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                                </div>
                                <div>
                                    <div class="payment-card-label">bKash</div>
                                    <div class="payment-card-sub">Mobile payment</div>
                                </div>
                            </label>
                            <label class="payment-card pay-nagad" data-value="Nagad" onclick="selectPayment('Nagad')">
                                <input type="radio" name="payment" value="Nagad">
                                <div class="payment-card-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e65100" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                                </div>
                                <div>
                                    <div class="payment-card-label">Nagad</div>
                                    <div class="payment-card-sub">Mobile payment</div>
                                </div>
                            </label>
                            <label class="payment-card pay-rocket" data-value="Rocket" onclick="selectPayment('Rocket')">
                                <input type="radio" name="payment" value="Rocket">
                                <div class="payment-card-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a1b9a" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                                </div>
                                <div>
                                    <div class="payment-card-label">Rocket</div>
                                    <div class="payment-card-sub">Mobile payment</div>
                                </div>
                            </label>
                        </div>

                        <hr class="co-divider">

                        <button id="place-btn" class="btn-place-order" onclick="placeOrder()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            Place Order
                        </button>
                        <a href="cart.html" class="btn-back-cart">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                            Back to Cart
                        </a>
                    </div>
                </div>
            </div>

            <!-- RIGHT: Order Summary -->
            <div>
                <div class="co-panel">
                    <div class="co-panel-head">
                        <div class="co-panel-head-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                        </div>
                        <h3>Order Summary <span style="font-size:13px;font-weight:400;color:#888;">(${itemCount} item${itemCount !== 1 ? 's' : ''})</span></h3>
                    </div>
                    <div class="co-panel-body">

                        <div>
                            ${data.items.map(item => {
                                const imgSrc = PROD_IMG.resolve(item, 'uploads/products/', 120, 120);
                                const imgFb  = PROD_IMG.byName(item.name, item.category, 120, 120);
                                return `
                                <div class="co-order-item">
                                    <div class="co-order-item-left">
                                        <img class="co-order-item-img" src="${imgSrc}" alt="${escHtml(item.name)}" onerror="this.src='${imgFb}'">
                                        <div>
                                            <div class="co-order-item-name">${escHtml(item.name)}</div>
                                            <div class="co-order-item-meta">${escHtml(item.category || 'Grocery')} &nbsp;&middot;&nbsp; Qty: ${item.quantity}</div>
                                        </div>
                                    </div>
                                    <div class="co-order-item-price">&#2547;${(item.price * item.quantity).toFixed(2)}</div>
                                </div>`;
                            }).join('')}
                        </div>

                        <hr class="co-divider">

                        <div class="co-summary-row">
                            <span>Subtotal</span>
                            <span>&#2547;${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="co-summary-row">
                            <span>Delivery Fee</span>
                            <span>${deliveryFee === 0 ? '<span style="color:#2e7d32;font-weight:700;">FREE</span>' : '&#2547;' + deliveryFee.toFixed(2)}</span>
                        </div>

                        <!-- Promo Code Box -->
                        <div class="co-promo-wrap">
                            <div class="co-promo-row">
                                <input type="text" id="promo-input" placeholder="Enter promo code"
                                    class="co-promo-input" maxlength="20" autocomplete="off"
                                    oninput="this.value=this.value.toUpperCase()"
                                    onkeydown="if(event.key==='Enter')applyDiscount()">
                                <button onclick="applyDiscount()" class="co-promo-btn" id="promo-btn">Apply</button>
                            </div>
                            <div id="promo-msg" class="co-promo-msg"></div>
                        </div>

                        <div class="co-summary-row" id="discount-row" style="display:none;">
                            <span id="discount-label">Discount</span>
                            <span style="color:#2e7d32;font-weight:700;" id="discount-amount-display"></span>
                        </div>

                        <div class="co-total-row">
                            <span class="label">Total</span>
                            <span class="amount" id="co-grand-total">&#2547;${grandTotal.toFixed(2)}</span>
                        </div>

                        <!-- Trust badges -->
                        <div class="co-trust">
                            <div class="co-trust-item">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                Secure Checkout
                            </div>
                            <div class="co-trust-item">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                24–48hr Delivery
                            </div>
                            <div class="co-trust-item">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                                Easy Returns
                            </div>
                            <div class="co-trust-item">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.17 10.4a19.79 19.79 0 01-3.07-8.68A2 2 0 012.08 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                                24/7 Support
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>`;
    } catch (e) {
        container.innerHTML = `<div style="padding:24px;color:#c62828;background:#fff;border-radius:12px;">Failed to load checkout. Please try again.</div>`;
    }
}

/* ── Apply Discount Code ───────────────────────────────────────────────── */
function applyDiscount() {
    const input  = document.getElementById('promo-input');
    const btn    = document.getElementById('promo-btn');
    const msg    = document.getElementById('promo-msg');
    const code   = (input?.value || '').trim().toUpperCase();

    if (!code) {
        if (msg) { msg.textContent = 'Please enter a promo code.'; msg.className = 'co-promo-msg error'; }
        return;
    }

    if (discountApplied) {
        if (msg) { msg.textContent = 'A promo code is already applied.'; msg.className = 'co-promo-msg error'; }
        return;
    }

    const promo = VALID_CODES[code];
    if (!promo) {
        if (msg) { msg.textContent = '✕ Invalid promo code. Please check and try again.'; msg.className = 'co-promo-msg error'; }
        if (input) { input.style.borderColor = '#e53935'; }
        return;
    }

    // Apply discount
    const sub      = window._coSubtotal || 0;
    const del      = window._coDelivery  || 0;
    discountAmount  = +(sub * promo.pct / 100).toFixed(2);
    discountApplied = true;
    discountCode    = code;
    const newTotal  = +(sub + del - discountAmount).toFixed(2);

    // Update DOM
    const discRow    = document.getElementById('discount-row');
    const discLabel  = document.getElementById('discount-label');
    const discAmt    = document.getElementById('discount-amount-display');
    const totalEl    = document.getElementById('co-grand-total');

    if (discRow)   discRow.style.display   = 'flex';
    if (discLabel) discLabel.textContent   = `Discount (${code} – ${promo.pct}% off)`;
    if (discAmt)   discAmt.textContent     = `-\u09F3${discountAmount.toFixed(2)}`;
    if (totalEl)   totalEl.innerHTML       = `&#2547;${newTotal.toFixed(2)}`;

    if (msg)   { msg.textContent = `\u2713 ${promo.pct}% discount applied successfully!`; msg.className = 'co-promo-msg success'; }
    if (input) { input.readOnly = true; input.style.borderColor = '#4caf50'; input.style.background = '#f1f8e9'; }
    if (btn)   { btn.textContent = 'Applied ✓'; btn.disabled = true; btn.style.background = '#4caf50'; btn.style.borderColor = '#4caf50'; }

    showToast(`Promo code ${code} applied — ${promo.pct}% off!`, 'success');
}

/* ── Place Order ───────────────────────────────────────────────────────── */
async function placeOrder() {
    const address  = document.getElementById('del-address')?.value.trim();
    const phone    = document.getElementById('co-phone')?.value.trim();
    const payment  = document.querySelector('.payment-card.selected')?.dataset.value
                     || document.querySelector('input[name="payment"]:checked')?.value
                     || 'Cash on Delivery';

    if (!address) { showToast('Please enter your delivery address', 'error'); return; }
    if (!phone)   { showToast('Please enter your phone number', 'error'); return; }

    const btn = document.getElementById('place-btn');
    btn.disabled = true;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-dasharray="30" stroke-dashoffset="10"/></svg> Placing your order...`;

    try {
        const res  = await fetch(`${API}/orders.php?action=place`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ address, payment, phone, discount_code: discountCode, discount_amount: discountAmount })
        });
        const data = await res.json();

        if (data.status === 'success') {
            showOrderSuccessOverlay(data.order_id);
        } else {
            showToast(data.message || 'Failed to place order', 'error');
            btn.disabled = false;
            btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Place Order`;
        }
    } catch {
        showToast('Connection error. Please try again.', 'error');
        btn.disabled = false;
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Place Order`;
    }
}

/* ── Init ──────────────────────────────────────────────────────────────── */
setupNav();
loadCheckout();

/* ── Order Success Overlay ─────────────────────────────────────────────── */
function showOrderSuccessOverlay(orderId) {
    const overlay = document.getElementById('order-success-overlay');
    if (!overlay) return;

    // Fill in the order ID
    const orderIdEl = overlay.querySelector('.oso-order-id-val');
    if (orderIdEl && orderId) orderIdEl.textContent = '#' + String(orderId).padStart(5, '0');

    // Show overlay
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';

    // Trigger checkmark animation
    setTimeout(() => overlay.querySelector('.oso-check-circle')?.classList.add('animated'), 80);

    // No auto-redirect — user navigates manually via the buttons below
}

function goToProfile() {
    window.location.href = 'user/profile.html?tab=orders';
}
