const API = 'api';

/* ── Category SVG Icons (professional colored icons) ─── */
const CAT_SVG_MAP = {
    vegetables: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="24" height="24"><circle cx="18" cy="18" r="18" fill="#e8f5e9"/><path fill="#388e3c" d="M18 28v-9m0 0C18 19 13 16 10 12c4-1 8 1 8 7zm0 0C18 19 23 16 26 12c-4-1-8 1-8 7z"/><path fill="#66bb6a" d="M18 15c0-3-2-5-2-5s3 1 3 5z"/></svg>`,
    fruits:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="24" height="24"><circle cx="18" cy="18" r="18" fill="#fce4ec"/><ellipse cx="18" cy="21" rx="7" ry="8" fill="#e53935"/><path fill="#43a047" d="M18 13c0 0 1-4 5-4-1 3-3 4-5 4z"/><ellipse cx="15.5" cy="19" rx="2" ry="3" fill="#ef9a9a" opacity=".5"/></svg>`,
    dairy:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="24" height="24"><circle cx="18" cy="18" r="18" fill="#e3f2fd"/><rect x="12" y="13" width="12" height="14" rx="2" fill="#1e88e5"/><rect x="12" y="13" width="12" height="5" rx="1" fill="#1565c0"/><path fill="#fff" d="M15 21h6v1.5h-6z" opacity=".5"/></svg>`,
    bakery:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="24" height="24"><circle cx="18" cy="18" r="18" fill="#fff3e0"/><path fill="#f57c00" d="M10 20c0-5 3.5-8 8-8s8 3 8 8v1a2 2 0 01-2 2H12a2 2 0 01-2-2v-1z"/><rect x="10" y="23" width="16" height="3" rx="1" fill="#ef6c00"/></svg>`,
    beverages:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="24" height="24"><circle cx="18" cy="18" r="18" fill="#e0f7fa"/><path fill="#00897b" d="M13 12h10l-1 13a2 2 0 01-2 2h-4a2 2 0 01-2-2L13 12z"/><rect x="13" y="12" width="10" height="3.5" rx="1" fill="#00695c"/><circle cx="23" cy="18" r="2.5" fill="none" stroke="#00897b" stroke-width="1.5"/></svg>`,
    snacks:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="24" height="24"><circle cx="18" cy="18" r="18" fill="#fff8e1"/><circle cx="18" cy="18" r="8" fill="#f9a825"/><circle cx="14.5" cy="16" r="1.8" fill="#f57f17"/><circle cx="21.5" cy="16" r="1.8" fill="#f57f17"/><circle cx="18" cy="21" r="1.8" fill="#f57f17"/></svg>`,
    meat:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="24" height="24"><circle cx="18" cy="18" r="18" fill="#fce4ec"/><ellipse cx="18" cy="21" rx="9" ry="6" fill="#e53935"/><ellipse cx="18" cy="20" rx="6" ry="4" fill="#ef9a9a"/><rect x="15.5" y="10" width="3" height="7" rx="1.5" fill="#bdbdbd"/></svg>`,
    seafood:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="24" height="24"><circle cx="18" cy="18" r="18" fill="#e3f2fd"/><path fill="#1976d2" d="M8 18c3-5 6-7 10-7s7 2 10 7c-3 5-6 7-10 7s-7-2-10-7z"/><circle cx="18" cy="18" r="3" fill="#fff" opacity=".7"/><path fill="#1565c0" d="M26 14l3-3-1 5z"/></svg>`,
    household:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="24" height="24"><circle cx="18" cy="18" r="18" fill="#ede7f6"/><path fill="#5e35b1" d="M9 20l9-9 9 9v8a1 1 0 01-1 1H10a1 1 0 01-1-1v-8z"/><rect x="15" y="22" width="6" height="7" rx="1" fill="#ede7f6"/></svg>`,
    grocery:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="24" height="24"><circle cx="18" cy="18" r="18" fill="#e8f5e9"/><path fill="#388e3c" d="M11 14h14l-1.5 9a2 2 0 01-2 1.5h-7a2 2 0 01-2-1.5L11 14z"/><path fill="#2e7d32" d="M9 11h18l-1 3H10L9 11z"/></svg>`,
    breakfast:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="24" height="24"><circle cx="18" cy="18" r="18" fill="#fff3e0"/><circle cx="18" cy="19" r="7" fill="#ffd54f"/><circle cx="18" cy="19" r="4.5" fill="#ffb300"/></svg>`
};
function getCatSvgIcon(name) {
    if (!name) return CAT_SVG_MAP.grocery;
    const n = name.toLowerCase();
    if (n.includes('vegetable')) return CAT_SVG_MAP.vegetables;
    if (n.includes('fruit'))     return CAT_SVG_MAP.fruits;
    if (n.includes('dairy') || n.includes('egg') || n.includes('milk')) return CAT_SVG_MAP.dairy;
    if (n.includes('bread') || n.includes('baker') || n.includes('bak')) return CAT_SVG_MAP.bakery;
    if (n.includes('beverage') || n.includes('drink') || n.includes('juice')) return CAT_SVG_MAP.beverages;
    if (n.includes('snack') || n.includes('biscuit') || n.includes('chip')) return CAT_SVG_MAP.snacks;
    if (n.includes('meat'))      return CAT_SVG_MAP.meat;
    if (n.includes('seafood') || n.includes('fish')) return CAT_SVG_MAP.seafood;
    if (n.includes('household') || n.includes('home') || n.includes('need')) return CAT_SVG_MAP.household;
    if (n.includes('breakfast')) return CAT_SVG_MAP.breakfast;
    if (n.includes('grocery') || n.includes('staple')) return CAT_SVG_MAP.grocery;
    return CAT_SVG_MAP.grocery;
}

/* ── Helpers ─────────────────────────────────────────── */
function getUser() {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
}
function escHtml(str) {
    const d = document.createElement('div');
    d.textContent = String(str || '');
    return d.innerHTML;
}
function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className   = `toast ${type} show`;
    setTimeout(() => { t.className = 'toast'; }, 3000);
}

/* ── Navbar Auth ─────────────────────────────────────── */
function _resetNavToLoggedOut() {
    var label = document.getElementById('account-label');
    var link  = document.getElementById('header-account-link');
    var dd    = document.getElementById('account-dropdown');
    if (label) label.textContent = 'Account';
    if (link)  { link.href = '#'; link.onclick = function(e){ e.preventDefault(); toggleAccountDropdown(e); }; }
    if (dd) dd.innerHTML =
        '<a href="login.html" class="account-dropdown-item">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Login</a>' +
        '<a href="register.html" class="account-dropdown-item">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>Register</a>';
}

function setupNav() {
    // Update the account dropdown based on login state
    try {
        var user = getUser();
        if (!user) return;
        var dest  = user.role === 'admin' ? 'admin/index.html' : 'user/profile.html';
        var label = document.getElementById('account-label');
        var link  = document.getElementById('header-account-link');
        var dd    = document.getElementById('account-dropdown');
        if (label) label.textContent = user.name.split(' ')[0];
        if (link)  { link.href = dest; link.onclick = null; }
        if (dd) dd.innerHTML =
            '<a href="' + dest + '" class="account-dropdown-item">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>My Profile</a>' +
            '<a href="tracking.html" class="account-dropdown-item">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>My Orders</a>' +
            '<a href="#" onclick="logout()" class="account-dropdown-item" style="color:#c62828;">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Logout</a>';

        // ── Verify the session is still valid on the server ──────────────
        // localStorage may have stale data after a PHP session expires.
        // If the server says not logged in, clear localStorage and reset the header.
        fetch(`${API}/auth_check.php`)
            .then(function(r){ return r.json(); })
            .then(function(data){
                if (data.status !== 'success') {
                    localStorage.removeItem('user');
                    _resetNavToLoggedOut();
                }
            })
            .catch(function(){});  // network error — leave UI as-is
    } catch(e) {}
}
async function logout() {
    await fetch(`${API}/logout.php`).catch(() => {});
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

/* ── Cart Count ──────────────────────────────────────── */
async function updateCartCount() {
    const user = getUser();
    const el   = document.getElementById('cart-count');
    if (!user || !el) return;
    try {
        const res  = await fetch(`${API}/cart.php?action=count`);
        const data = await res.json();
        el.textContent = data.count || 0;
    } catch { el.textContent = 0; }
}

/* ── Hero Slider ─────────────────────────────────────── */
function initSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.s-dot');
    if (!slides.length) return;
    let cur = 0;
    window.goSlide = function(n) {
        slides[cur].classList.remove('active');
        if (dots[cur]) dots[cur].classList.remove('active');
        cur = (n + slides.length) % slides.length;
        slides[cur].classList.add('active');
        if (dots[cur]) dots[cur].classList.add('active');
    };
    window.mvSlide = function(d) { goSlide(cur + d); };
    setInterval(() => mvSlide(1), 5500);
}

const CAT_IMAGES = {
    vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&h=100&fit=crop',
    fruits:     'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=100&h=100&fit=crop',
    dairy:      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&h=100&fit=crop',
    bakery:     'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop',
    beverages:          'uploads/products/Bevarage.jpeg',
    'health & organic': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop',
    health:             'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop',
    snacks:     'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=100&h=100&fit=crop',
    meat:       'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100&h=100&fit=crop',
    meats:      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100&h=100&fit=crop',
};
const DEFAULT_CAT_IMG = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop';
function getCatImage(name) {
    return CAT_IMAGES[name.toLowerCase()] || DEFAULT_CAT_IMG;
}

/* ── Product Image — delegates to shared product-img.js ─── */
function resolveProductImg(p, w, h) {
    return PROD_IMG.resolve(p, 'uploads/products/', w || 600, h || 450);
}
// Legacy alias still used inside main.js template strings
function getProductFallbackImg(cat) { return PROD_IMG.catFallback(cat); }

/* ── Load Categories ─────────────────────────────────── */
async function loadCategories() {
    const filterEl = document.getElementById('cat-filter');
    const scrollEl = document.getElementById('cat-scroll');
    if (!filterEl && !scrollEl) return;
    try {
        const res  = await fetch(`${API}/products.php?action=categories`);
        const data = await res.json();
        const cats = data.categories || [];
        if (filterEl) {
            const isSidebar = filterEl.classList.contains('sidebar-cat-list');
            if (isSidebar) {
                cats.forEach(cat => {
                    const label = document.createElement('label');
                    label.className = 'cat-check-label';
                    label.innerHTML =
                        `<input type="checkbox" class="cat-checkbox" data-id="${cat.id}" data-name="${escHtml(cat.name)}">` +
                        `<span class="cat-label-text">${escHtml(cat.name)}</span>` +
                        `<span class="cat-label-count">(${cat.product_count || 0})</span>`;
                    label.querySelector('.cat-checkbox').addEventListener('change', function() {
                        if (typeof window.onCatFilterChange === 'function') window.onCatFilterChange();
                    });
                    filterEl.appendChild(label);
                });
            } else {
                cats.forEach(cat => {
                    const btn = document.createElement('button');
                    btn.className = 'cat-btn';
                    btn.dataset.id = cat.id;
                    btn.textContent = cat.name;
                    btn.onclick = () => filterCat(cat.id, btn);
                    filterEl.appendChild(btn);
                });
            }
        }


        if (scrollEl) {
            cats.forEach(cat => {
                const div = document.createElement('div');
                div.className = 'cat-item';
                div.dataset.id = cat.id;
                div.onclick = () => filterCat(cat.id, div);
                div.innerHTML = `<div class="cat-img-wrap"><img src="${getCatImage(cat.name)}" alt="${escHtml(cat.name)}" onerror="this.src='${DEFAULT_CAT_IMG}'"></div><div class="cat-n">${escHtml(cat.name)}</div><div class="cat-count">${cat.product_count || 0} products</div>`;
                scrollEl.appendChild(div);
            });
            // Update All Items count
            const total = cats.reduce((sum, c) => sum + (parseInt(c.product_count) || 0), 0);
            const allCount = document.getElementById('all-items-count');
            if (allCount) allCount.textContent = total + ' products';
        }
    } catch(e) { console.error('Failed to load categories', e); }
}

/* ── Products ────────────────────────────────────────── */
let currentCat = '0', currentSearch = '';
const BADGES = ['New','Hot','Fresh','Sale'];

async function loadProducts(catId = '0', search = '', limit = '') {
    const container = document.getElementById('products-container');
    if (!container) return;
    container.innerHTML = '<div class="fm-spinner"><div class="fm-spinner-ring"></div><span>Loading fresh products...</span></div>';
    try {
        let url = `${API}/products.php?action=list&cat=${catId}&search=${encodeURIComponent(search)}`;
        if (limit) url += `&limit=${limit}`;
        const res  = await fetch(url);
        const data = await res.json();
        renderProducts(data.products || []);
    } catch {
        container.innerHTML = '<div class="alert alert-danger">Failed to load products. Make sure the server is running.</div>';
    }
}

/* ── Featured Products (home page only — independent of search) ── */
async function loadFeaturedProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    container.innerHTML = '<div class="fm-spinner"><div class="fm-spinner-ring"></div><span>Loading fresh products...</span></div>';
    try {
        const res  = await fetch(`${API}/products.php?action=list&cat=0&search=`);
        const data = await res.json();
        renderFeaturedGrid(data.products || []);
    } catch {
        container.innerHTML = '<div class="alert alert-danger">Failed to load products. Make sure the server is running.</div>';
    }
}

/* ── Dedicated featured grid renderer (home page only) ─────── */
function renderFeaturedGrid(products) {
    const container = document.getElementById('products-container');
    if (!container) return;

    // Show up to 10 featured products
    const display = products.slice(0, 10);

    if (!display.length) {
        container.innerHTML = '<div class="empty-state"><p>No products available.</p></div>';
        return;
    }

    container.innerHTML = '<div class="featured-grid">' +
        display.map(function(p) {
            const fallback = getProductFallbackImg(p.category);
            const imgSrc   = resolveProductImg(p);
            const inStock  = p.stock > 0;
            const price    = parseFloat(p.price);
            return '<div class="featured-card">' +
                '<a href="product-detail.html?id=' + p.id + '" class="featured-card-link">' +
                    '<div class="featured-img-wrap">' +
                        '<img src="' + imgSrc + '" alt="' + escHtml(p.name) + '" loading="lazy" onerror="this.src=\'' + fallback + '\'">' +
                        (!inStock ? '<span class="featured-soldout">Sold Out</span>' : '') +
                    '</div>' +
                    '<div class="featured-card-body">' +
                        '<h3 class="featured-name">' + escHtml(p.name) + '</h3>' +
                        '<div class="featured-price-row">' +
                            '<span class="featured-price">&#2547;' + price.toFixed(2) + '</span>' +
                        '</div>' +
                    '</div>' +
                '</a>' +
                '<div class="featured-card-footer">' +
                    (inStock
                        ? '<button class="featured-atc-btn" onclick="event.preventDefault();addToCart(\'' + p.id + '\', this)"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>Add To Cart</button>'
                        : '<button class="featured-atc-btn featured-atc-disabled" disabled>Sold Out</button>') +
                '</div>' +
            '</div>';
        }).join('') +
    '</div>';
}

function renderProducts(products) {
    const container = document.getElementById('products-container');
    if (!products.length) {
        container.innerHTML = '<div class="empty-state"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>No products found.</p><a href="index.html" class="btn btn-green">Browse All</a></div>';
        return;
    }
    const isHomePage = !!document.getElementById('cat-scroll');
    container.innerHTML = '<div class="' + (isHomePage ? 'featured-grid' : 'product-grid') + '">' +
        products.map((p) => {
            const fallback = getProductFallbackImg(p.category);
            const imgSrc   = resolveProductImg(p);
            const inStock  = p.stock > 0;
            if (isHomePage) {
                const price = parseFloat(p.price);
                return `<div class="featured-card">
                    <a href="product-detail.html?id=${p.id}" class="featured-card-link">
                        <div class="featured-img-wrap">
                            <img src="${imgSrc}" alt="${escHtml(p.name)}" loading="lazy" onerror="this.src='${fallback}'">
                            ${!inStock ? '<span class="featured-soldout">Sold Out</span>' : ''}
                        </div>
                        <div class="featured-card-body">
                            <h3 class="featured-name">${escHtml(p.name)}</h3>
                            <div class="featured-price-row">
                                <span class="featured-price">&#2547;${price.toFixed(2)}</span>
                            </div>
                        </div>
                    </a>
                    <div class="featured-card-footer">
                        ${inStock
                            ? `<button class="featured-atc-btn" onclick="event.preventDefault();addToCart('${p.id}', this)"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>Add To Cart</button>`
                            : `<button class="featured-atc-btn featured-atc-disabled" disabled>Sold Out</button>`}
                    </div>
                </div>`;
            }
            return `<div class="product-card">
                <a href="product-detail.html?id=${p.id}" class="product-card-link">
                    <div class="product-img-wrap product-zoom">
                        <img src="${imgSrc}" alt="${escHtml(p.name)}" loading="lazy" onerror="this.src='${fallback}'">
                        ${!inStock ? '<span class="product-badge-soldout">Sold Out</span>' : ''}
                        <div class="card-hover-overlay">
                            <span class="cho-view">View Details</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="product-cat">${escHtml(p.category || 'Grocery')}</div>
                        <h3>${escHtml(p.name)}</h3>
                        <div class="product-footer">
                            <span class="price">&#2547;${parseFloat(p.price).toFixed(2)}</span>
                            <span class="stock-chip ${inStock ? 'sc-in' : 'sc-out'}">${inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                    </div>
                </a>
                <div class="card-actions">
                    ${inStock
                        ? `<button class="add-to-cart-btn card-cta" onclick="event.preventDefault();addToCart('${p.id}', this)"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>Add to Cart</button>`
                        : `<button class="add-to-cart-btn card-cta card-cta-disabled" disabled>Sold Out</button>`}
                </div>
            </div>`;
        }).join('') + '</div>';
}

function filterCat(id, el) {
    // If NOT on the products page (no cat-filter sidebar), redirect to products.html with category
    if (!document.getElementById('cat-filter')) {
        const catName = el.querySelector('.cat-n')?.textContent?.trim() || el.textContent?.trim();
        if (id === '0' || !catName) {
            window.location.href = 'products.html';
        } else {
            window.location.href = 'products.html?category=' + encodeURIComponent(catName);
        }
        return;
    }
    currentCat = id;
    document.querySelectorAll('.cat-btn,.cat-item,.sidebar-cat-btn').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    const title = document.getElementById('products-title');
    if (title) { const n = el.querySelector('.cat-n')?.textContent || el.textContent; title.textContent = id === '0' ? 'Featured Products' : n; }
    loadProducts(id, currentSearch);
}

function doSearch() {
    const input = document.getElementById('hero-search') || document.getElementById('nav-search-input') || document.getElementById('srch');
    const query = (input?.value || '').trim();
    if (!query) return;

    // On the home page (has cat-scroll), redirect to products page with search query
    const isHomePage = !!document.getElementById('cat-scroll');
    if (isHomePage) {
        window.location.href = 'products.html?search=' + encodeURIComponent(query);
        return;
    }

    // On the products page, filter in-place
    currentSearch = query;
    loadProducts(currentCat, currentSearch);
}

/* ── Add to Cart ──────────────────────────────────────── */
async function addToCart(productId, btn, silent) {
    const user = getUser();
    if (!user) { sessionStorage.setItem('redirect_after_login', window.location.href); window.location.href = 'login.html'; return; }
    let orig = '';
    if (btn) { orig = btn.innerHTML; btn.innerHTML = 'Adding...'; btn.disabled = true; }
    try {
        const res  = await fetch(`${API}/cart.php`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({action:'add',product_id:productId}) });
        const data = await res.json();
        if (data.status === 'login') { window.location.href = 'login.html'; return; }
        if (data.status === 'success') {
            if (!silent) showToast('Added to cart!');
            updateCartCount();
            if (btn) {
                btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Added';
                btn.classList.add('btn-added');
                setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('btn-added'); btn.disabled = false; }, 1800);
                return;
            }
        } else if (!silent) showToast(data.message || 'Error adding to cart', 'error');
    } catch { if (!silent) showToast('Connection error', 'error'); }
    if (btn) { btn.innerHTML = orig; btn.disabled = false; }
}

/* ── Enter key search ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    ['hero-search','nav-search-input','srch'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    });
    initSlider();
});

/* ── Init ─────────────────────────────────────────────── */
setupNav();
loadCategories();
// Home page uses dedicated featured loader (20 items, not affected by search)
// Other pages use the standard loadProducts
if (document.getElementById('cat-scroll')) {
    loadFeaturedProducts();
} else {
    loadProducts();
}
updateCartCount();
