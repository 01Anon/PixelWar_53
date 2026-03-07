/* ═══════════════════════════════════════════════════════════════
   SubSync — Application Logic
   Subscription Expense Management Platform
   ═══════════════════════════════════════════════════════════════ */

// ── Sample Data ──
const BRANDS = {
    netflix:  { name: 'Netflix',  color: '#E50914', icon: 'N', category: 'entertainment' },
    spotify:  { name: 'Spotify',  color: '#1DB954', icon: 'S', category: 'music' },
    youtube:  { name: 'YouTube Premium', color: '#FF0000', icon: 'Y', category: 'entertainment' },
    adobe:    { name: 'Adobe CC', color: '#FF0000', icon: 'A', category: 'productivity' },
    figma:    { name: 'Figma',    color: '#A259FF', icon: 'F', category: 'productivity' },
    github:   { name: 'GitHub Pro', color: '#8B5CF6', icon: 'G', category: 'productivity' },
    icloud:   { name: 'iCloud+',  color: '#3B82F6', icon: 'i', category: 'cloud' },
    custom:   { name: '',         color: '#00FFAB', icon: '+', category: 'other' },
};

const CATEGORY_COLORS = {
    entertainment: '#E50914',
    productivity:  '#A259FF',
    cloud:         '#3B82F6',
    music:         '#1DB954',
    news:          '#FF9F43',
    fitness:       '#00FFAB',
    other:         '#8892A0',
};

const CATEGORY_LABELS = {
    entertainment: '🎬 Entertainment',
    productivity:  '⚡ Productivity',
    cloud:         '☁️ Cloud & Storage',
    music:         '🎵 Music',
    news:          '📰 News & Media',
    fitness:       '💪 Fitness',
    other:         '📦 Other',
};

// Default subscriptions
let subscriptions = [
    { id: 1, name: 'Netflix',         brand: 'netflix',  cost: 15.99, cycle: 'monthly', category: 'entertainment', nextDate: '2026-03-10', color: '#E50914', icon: 'N', notify: true },
    { id: 2, name: 'Spotify',         brand: 'spotify',  cost: 9.99,  cycle: 'monthly', category: 'music',         nextDate: '2026-03-12', color: '#1DB954', icon: 'S', notify: true },
    { id: 3, name: 'YouTube Premium', brand: 'youtube',  cost: 13.99, cycle: 'monthly', category: 'entertainment', nextDate: '2026-03-08', color: '#FF0000', icon: 'Y', notify: true },
    { id: 4, name: 'Adobe CC',        brand: 'adobe',    cost: 54.99, cycle: 'monthly', category: 'productivity',  nextDate: '2026-03-15', color: '#FF0000', icon: 'A', notify: true },
    { id: 5, name: 'Figma',           brand: 'figma',    cost: 12.00, cycle: 'monthly', category: 'productivity',  nextDate: '2026-03-20', color: '#A259FF', icon: 'F', notify: true },
    { id: 6, name: 'GitHub Pro',      brand: 'github',   cost: 4.00,  cycle: 'monthly', category: 'productivity',  nextDate: '2026-03-22', color: '#8B5CF6', icon: 'G', notify: false },
    { id: 7, name: 'iCloud+ 200GB',   brand: 'icloud',   cost: 2.99,  cycle: 'monthly', category: 'cloud',         nextDate: '2026-03-25', color: '#3B82F6', icon: 'i', notify: true },
    { id: 8, name: 'ChatGPT Plus',    brand: 'custom',   cost: 20.00, cycle: 'monthly', category: 'productivity',  nextDate: '2026-03-18', color: '#10A37F', icon: 'C', notify: true },
    { id: 9, name: 'Apple Music',     brand: 'custom',   cost: 10.99, cycle: 'monthly', category: 'music',         nextDate: '2026-03-28', color: '#FC3C44', icon: 'A', notify: false },
    { id:10, name: 'Notion',          brand: 'custom',   cost: 8.00,  cycle: 'monthly', category: 'productivity',  nextDate: '2026-03-14', color: '#000000', icon: 'N', notify: true },
    { id:11, name: 'Disney+',         brand: 'custom',   cost: 7.99,  cycle: 'monthly', category: 'entertainment', nextDate: '2026-03-30', color: '#113CCF', icon: 'D', notify: true },
    { id:12, name: 'AWS',             brand: 'custom',   cost: 124.04,cycle: 'monthly', category: 'cloud',         nextDate: '2026-04-01', color: '#FF9900', icon: 'A', notify: true },
];

let nextId = 13;

// ──────────────────────────────────────────────
// VIEW ROUTER
// ──────────────────────────────────────────────
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
        // Clone sidebar into views that need it
        if (viewId !== 'view-auth') {
            cloneSidebars(viewId);
        }
        // Update nav active state
        document.querySelectorAll('.sidebar__link').forEach(link => {
            link.classList.toggle('active', link.dataset.target === viewId);
        });
        // Render view content
        switch (viewId) {
            case 'view-dashboard': renderDashboard(); break;
            case 'view-add':      renderManage(); break;
            case 'view-reminders': renderReminders(); break;
            case 'view-summary':  renderSummary(); break;
        }
    }
}

function cloneSidebars(activeViewId) {
    const originalSidebar = document.querySelector('#view-dashboard .sidebar');
    document.querySelectorAll('.sidebar[data-clone]').forEach(placeholder => {
        const clone = originalSidebar.cloneNode(true);
        clone.removeAttribute('id');
        clone.setAttribute('data-clone', 'sidebar');
        // Update active states in clone
        clone.querySelectorAll('.sidebar__link').forEach(link => {
            link.classList.toggle('active', link.dataset.target === activeViewId);
        });
        placeholder.replaceWith(clone);
        // Re-bind click events on cloned sidebar
        clone.querySelectorAll('.sidebar__link').forEach(bindNavLink);
        const logoutBtn = clone.querySelector('#logoutBtn') || clone.querySelector('.sidebar__user .btn-icon');
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    });
}

function bindNavLink(link) {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showView(link.dataset.target);
    });
}

// ──────────────────────────────────────────────
// AUTH
// ──────────────────────────────────────────────
const authTabs = document.getElementById('authTabs');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const indicator = document.querySelector('.auth-tab__indicator');

authTabs?.addEventListener('click', (e) => {
    const tab = e.target.closest('.auth-tab');
    if (!tab) return;
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    if (tab.dataset.tab === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        indicator.style.transform = 'translateX(0)';
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        indicator.style.transform = 'translateX(100%)';
    }
});

loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showView('view-dashboard');
});
signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showView('view-dashboard');
});
document.getElementById('biometricBtn')?.addEventListener('click', () => {
    showView('view-dashboard');
});

function handleLogout() {
    showView('view-auth');
}

// ──────────────────────────────────────────────
// DASHBOARD
// ──────────────────────────────────────────────
function renderDashboard() {
    const totalSpend = subscriptions.reduce((s, sub) => s + sub.cost, 0);
    document.getElementById('totalSpend').textContent = '$' + totalSpend.toFixed(2);
    document.getElementById('activeSubs').textContent = subscriptions.length;

    // Upcoming this week
    const now = new Date('2026-03-07');
    const weekLater = new Date(now);
    weekLater.setDate(weekLater.getDate() + 7);
    const upcoming = subscriptions.filter(s => {
        const d = new Date(s.nextDate);
        return d >= now && d <= weekLater;
    });
    document.getElementById('upcomingPayments').textContent = upcoming.length;

    // Center value
    document.querySelector('.chart-center__value').textContent = '$' + totalSpend.toFixed(2);

    drawDonutChart();
    renderDashSubList();
}

function renderDashSubList() {
    const container = document.getElementById('dashSubList');
    container.innerHTML = subscriptions.map(sub => `
        <div class="sub-item">
            <div class="sub-icon" style="background:${sub.color}20;color:${sub.color}">${sub.icon}</div>
            <div class="sub-info">
                <span class="sub-name">${sub.name}</span>
                <span class="sub-category">${CATEGORY_LABELS[sub.category] || sub.category}</span>
            </div>
            <div>
                <span class="sub-price">$${sub.cost.toFixed(2)}</span>
                <span class="sub-cycle">/${sub.cycle}</span>
            </div>
        </div>
    `).join('');
}

// ──────────────────────────────────────────────
// DONUT CHART (Canvas)
// ──────────────────────────────────────────────
function drawDonutChart() {
    const canvas = document.getElementById('donutChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 240;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    // Group by category
    const groups = {};
    subscriptions.forEach(sub => {
        if (!groups[sub.category]) groups[sub.category] = 0;
        groups[sub.category] += sub.cost;
    });

    const total = Object.values(groups).reduce((a, b) => a + b, 0);
    const entries = Object.entries(groups).sort((a, b) => b[1] - a[1]);
    const cx = size / 2, cy = size / 2, outerR = 105, innerR = 70;

    let startAngle = -Math.PI / 2;
    ctx.clearRect(0, 0, size, size);

    entries.forEach(([cat, value]) => {
        const sweep = (value / total) * Math.PI * 2;
        const endAngle = startAngle + sweep;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, startAngle, endAngle);
        ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = CATEGORY_COLORS[cat] || '#8892A0';
        ctx.fill();
        startAngle = endAngle;
    });

    // Legend
    const legend = document.getElementById('donutLegend');
    legend.innerHTML = entries.map(([cat, value]) => `
        <div class="legend-item">
            <span class="legend-dot" style="background:${CATEGORY_COLORS[cat] || '#8892A0'}"></span>
            ${CATEGORY_LABELS[cat] || cat} — $${value.toFixed(2)}
        </div>
    `).join('');
}

// ──────────────────────────────────────────────
// MANAGE SUBSCRIPTIONS
// ──────────────────────────────────────────────
function renderManage() {
    renderManageList();
}

function renderManageList() {
    const container = document.getElementById('manageSubList');
    if (!container) return;
    container.innerHTML = subscriptions.map(sub => `
        <div class="manage-item">
            <div class="sub-icon" style="background:${sub.color}20;color:${sub.color}">${sub.icon}</div>
            <div class="sub-info">
                <span class="sub-name">${sub.name}</span>
                <span class="sub-category">$${sub.cost.toFixed(2)} / ${sub.cycle}</span>
            </div>
            <div class="manage-item__actions">
                <button class="btn btn--danger btn--sm" onclick="deleteSub(${sub.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

// Brand Picker
document.getElementById('brandPicker')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.brand-chip');
    if (!chip) return;
    document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const brand = BRANDS[chip.dataset.brand];
    if (brand && brand.name) {
        document.getElementById('subName').value = brand.name;
    }
    // Set chip icon color
    chip.querySelector('.brand-chip__icon').style.background = chip.dataset.color;
});

// Set brand chip icon colors on load
document.querySelectorAll('.brand-chip').forEach(chip => {
    chip.querySelector('.brand-chip__icon').style.background = chip.dataset.color;
});

// Add subscription form
document.getElementById('addSubForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('subName').value.trim();
    const cost = parseFloat(document.getElementById('subCost').value);
    const cycle = document.getElementById('subCycle').value;
    const category = document.getElementById('subCategory').value;
    const nextDate = document.getElementById('subDate').value;

    if (!name || isNaN(cost)) return;

    const activeChip = document.querySelector('.brand-chip.active');
    const brandKey = activeChip?.dataset.brand || 'custom';
    const brand = BRANDS[brandKey] || BRANDS.custom;

    subscriptions.push({
        id: nextId++,
        name,
        brand: brandKey,
        cost,
        cycle,
        category,
        nextDate: nextDate || '2026-03-15',
        color: activeChip?.dataset.color || brand.color,
        icon: name.charAt(0).toUpperCase(),
        notify: true,
    });

    e.target.reset();
    document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
    renderManageList();
});

function deleteSub(id) {
    subscriptions = subscriptions.filter(s => s.id !== id);
    renderManageList();
}

// Quick add button on dashboard
document.getElementById('addSubQuick')?.addEventListener('click', () => showView('view-add'));

// ──────────────────────────────────────────────
// REMINDERS
// ──────────────────────────────────────────────
function renderReminders() {
    const now = new Date('2026-03-07');
    const sorted = [...subscriptions].sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));
    const container = document.getElementById('reminderTimeline');
    if (!container) return;

    // Update urgency banner
    const weekLater = new Date(now);
    weekLater.setDate(weekLater.getDate() + 7);
    const urgent = sorted.filter(s => {
        const d = new Date(s.nextDate);
        return d >= now && d <= weekLater;
    });
    const urgencyBanner = document.getElementById('urgencyBanner');
    if (urgencyBanner) {
        const totalDue = urgent.reduce((s, sub) => s + sub.cost, 0);
        urgencyBanner.querySelector('strong').textContent = `${urgent.length} payment${urgent.length !== 1 ? 's' : ''} due this week`;
        urgencyBanner.querySelector('span').textContent = `Total: $${totalDue.toFixed(2)} — Don't miss your renewal dates!`;
    }

    container.innerHTML = sorted.map(sub => {
        const d = new Date(sub.nextDate);
        const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
        let urgency = 'later';
        if (diff <= 3) urgency = 'urgent';
        else if (diff <= 7) urgency = 'soon';

        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `
        <div class="reminder-card glass ${urgency}">
            <div class="reminder-date">
                <span class="reminder-date__day">${d.getDate()}</span>
                <span class="reminder-date__month">${months[d.getMonth()]}</span>
            </div>
            <div class="sub-icon" style="background:${sub.color}20;color:${sub.color}">${sub.icon}</div>
            <div class="reminder-info">
                <span class="reminder-name">${sub.name}</span>
                <span class="reminder-amount">$${sub.cost.toFixed(2)} · ${diff <= 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `in ${diff} days`}</span>
            </div>
            <div class="reminder-actions">
                <button class="reminder-toggle ${sub.notify ? 'on' : ''}" data-id="${sub.id}" title="Toggle notification"></button>
                <button class="btn btn--warning btn--sm">Snooze</button>
            </div>
        </div>`;
    }).join('');

    // Toggle notification bindings
    container.querySelectorAll('.reminder-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const id = parseInt(toggle.dataset.id);
            const sub = subscriptions.find(s => s.id === id);
            if (sub) {
                sub.notify = !sub.notify;
                toggle.classList.toggle('on', sub.notify);
            }
        });
    });
}

// ──────────────────────────────────────────────
// MONTHLY SUMMARY
// ──────────────────────────────────────────────
function renderSummary() {
    drawBarChart();
    drawCategoryMiniDonuts();
}

function drawBarChart() {
    const canvas = document.getElementById('barChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement.clientWidth - 48;
    const h = 260;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const values = [198.50, 215.30, 242.80, 255.60, 254.20, 284.97];
    const maxVal = Math.max(...values) * 1.15;
    const barW = Math.min(40, (w - 80) / months.length - 12);
    const gap = (w - 60) / months.length;
    const baseY = h - 40;
    const chartH = baseY - 20;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = baseY - (chartH * i / 4);
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(w - 20, y);
        ctx.stroke();
        // Labels
        ctx.fillStyle = '#555E6E';
        ctx.font = '11px Inter';
        ctx.textAlign = 'right';
        ctx.fillText('$' + Math.round(maxVal * i / 4), 35, y + 4);
    }

    // Bars
    months.forEach((m, i) => {
        const x = 50 + i * gap;
        const barH = (values[i] / maxVal) * chartH;
        const y = baseY - barH;

        // Bar gradient
        const grad = ctx.createLinearGradient(x, y, x, baseY);
        if (i === months.length - 1) {
            grad.addColorStop(0, '#00FFAB');
            grad.addColorStop(1, 'rgba(0,255,171,0.2)');
        } else {
            grad.addColorStop(0, 'rgba(255,255,255,0.25)');
            grad.addColorStop(1, 'rgba(255,255,255,0.05)');
        }

        // Rounded rect bar
        const r = 6;
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
        ctx.lineTo(x + barW, baseY);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Value on top
        ctx.fillStyle = i === months.length - 1 ? '#00FFAB' : '#8892A0';
        ctx.font = '600 11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('$' + values[i].toFixed(0), x + barW / 2, y - 8);

        // Month label
        ctx.fillStyle = '#8892A0';
        ctx.font = '500 12px Inter';
        ctx.fillText(m, x + barW / 2, baseY + 18);
    });
}

function drawCategoryMiniDonuts() {
    const container = document.getElementById('catGrid');
    if (!container) return;

    const groups = {};
    subscriptions.forEach(sub => {
        if (!groups[sub.category]) groups[sub.category] = 0;
        groups[sub.category] += sub.cost;
    });
    const total = Object.values(groups).reduce((a, b) => a + b, 0);

    container.innerHTML = Object.entries(groups).sort((a, b) => b[1] - a[1]).map(([cat, value]) => `
        <div class="cat-item">
            <canvas class="cat-donut" data-cat="${cat}" data-value="${value}" data-total="${total}" width="64" height="64"></canvas>
            <span class="cat-item__name">${CATEGORY_LABELS[cat] || cat}</span>
            <span class="cat-item__value">$${value.toFixed(2)}</span>
        </div>
    `).join('');

    // Draw mini donuts
    container.querySelectorAll('.cat-donut').forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const size = 64;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';
        ctx.scale(dpr, dpr);

        const cat = canvas.dataset.cat;
        const value = parseFloat(canvas.dataset.value);
        const totalVal = parseFloat(canvas.dataset.total);
        const pct = value / totalVal;
        const cx = size / 2, cy = size / 2, outerR = 28, innerR = 20;

        // Background ring
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
        ctx.arc(cx, cy, innerR, Math.PI * 2, 0, true);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fill();

        // Value ring
        const start = -Math.PI / 2;
        const end = start + pct * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, start, end);
        ctx.arc(cx, cy, innerR, end, start, true);
        ctx.closePath();
        ctx.fillStyle = CATEGORY_COLORS[cat] || '#8892A0';
        ctx.fill();

        // Percentage text
        ctx.fillStyle = '#F0F0F0';
        ctx.font = '700 12px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(pct * 100) + '%', cx, cy);
    });
}

// Export button
document.getElementById('exportBtn')?.addEventListener('click', () => {
    alert('📄 Summary exported! (Demo)');
});

// ──────────────────────────────────────────────
// NAV BINDINGS
// ──────────────────────────────────────────────
document.querySelectorAll('#view-dashboard .sidebar__link').forEach(bindNavLink);
document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);

// ──────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────
showView('view-auth');
