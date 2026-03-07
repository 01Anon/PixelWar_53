/* SubSync v2 - Application Logic */

const BRANDS = {
    netflix: { name: 'Netflix', color: '#E50914', icon: 'N', category: 'entertainment', building: '\uD83C\uDFAC', buildingName: 'Cinema Tower' },
    spotify: { name: 'Spotify', color: '#1DB954', icon: 'S', category: 'music', building: '\uD83C\uDFB5', buildingName: 'Music Hall' },
    youtube: { name: 'YouTube Premium', color: '#FF0000', icon: 'Y', category: 'entertainment', building: '\uD83D\uDCFA', buildingName: 'Video Palace' },
    adobe: { name: 'Adobe CC', color: '#FF0000', icon: 'A', category: 'productivity', building: '\uD83C\uDFD7\uFE0F', buildingName: 'Creator Forge' },
    figma: { name: 'Figma', color: '#A259FF', icon: 'F', category: 'productivity', building: '\uD83C\uDFA8', buildingName: 'Design Studio' },
    github: { name: 'GitHub Pro', color: '#8B5CF6', icon: 'G', category: 'productivity', building: '\u2694\uFE0F', buildingName: 'Code Armory' },
    icloud: { name: 'iCloud+', color: '#3B82F6', icon: 'i', category: 'cloud', building: '\u2601\uFE0F', buildingName: 'Cloud Castle' },
    custom: { name: '', color: '#7C3AED', icon: '+', category: 'other', building: '\uD83C\uDFF0', buildingName: 'Custom Keep' },
};
const CATEGORY_COLORS = { entertainment: '#E50914', productivity: '#A259FF', cloud: '#3B82F6', music: '#1DB954', news: '#F59E0B', fitness: '#22D3EE', other: '#A0A0B8' };
const CATEGORY_LABELS = { entertainment: '\uD83C\uDFAC Entertainment', productivity: '\u26A1 Productivity', cloud: '\u2601\uFE0F Cloud & Storage', music: '\uD83C\uDFB5 Music', news: '\uD83D\uDCF0 News & Media', fitness: '\uD83D\uDCAA Fitness', other: '\uD83D\uDCE6 Other' };

let subscriptions = [
    { id: 1, name: 'Netflix', brand: 'netflix', cost: 15.99, cycle: 'monthly', category: 'entertainment', nextDate: '2026-03-10', color: '#E50914', icon: 'N', notify: true, usage: 85 },
    { id: 2, name: 'Spotify', brand: 'spotify', cost: 9.99, cycle: 'monthly', category: 'music', nextDate: '2026-03-12', color: '#1DB954', icon: 'S', notify: true, usage: 92 },
    { id: 3, name: 'YouTube Premium', brand: 'youtube', cost: 13.99, cycle: 'monthly', category: 'entertainment', nextDate: '2026-03-08', color: '#FF0000', icon: 'Y', notify: true, usage: 78 },
    { id: 4, name: 'Adobe CC', brand: 'adobe', cost: 54.99, cycle: 'monthly', category: 'productivity', nextDate: '2026-03-15', color: '#FF0000', icon: 'A', notify: true, usage: 65 },
    { id: 5, name: 'Figma', brand: 'figma', cost: 12.00, cycle: 'monthly', category: 'productivity', nextDate: '2026-03-20', color: '#A259FF', icon: 'F', notify: true, usage: 88 },
    { id: 6, name: 'GitHub Pro', brand: 'github', cost: 4.00, cycle: 'monthly', category: 'productivity', nextDate: '2026-03-22', color: '#8B5CF6', icon: 'G', notify: false, usage: 95 },
    { id: 7, name: 'iCloud+ 200GB', brand: 'icloud', cost: 2.99, cycle: 'monthly', category: 'cloud', nextDate: '2026-03-25', color: '#3B82F6', icon: 'i', notify: true, usage: 70 },
    { id: 8, name: 'ChatGPT Plus', brand: 'custom', cost: 20.00, cycle: 'monthly', category: 'productivity', nextDate: '2026-03-18', color: '#10A37F', icon: 'C', notify: true, usage: 90 },
    { id: 9, name: 'Apple Music', brand: 'custom', cost: 10.99, cycle: 'monthly', category: 'music', nextDate: '2026-03-28', color: '#FC3C44', icon: 'A', notify: false, usage: 12 },
    { id: 10, name: 'Notion', brand: 'custom', cost: 8.00, cycle: 'monthly', category: 'productivity', nextDate: '2026-03-14', color: '#787878', icon: 'N', notify: true, usage: 80 },
    { id: 11, name: 'Disney+', brand: 'custom', cost: 7.99, cycle: 'monthly', category: 'entertainment', nextDate: '2026-03-30', color: '#113CCF', icon: 'D', notify: true, usage: 25 },
    { id: 12, name: 'AWS', brand: 'custom', cost: 124.04, cycle: 'monthly', category: 'cloud', nextDate: '2026-04-01', color: '#FF9900', icon: 'A', notify: true, usage: 98 },
];
let nextId = 13;

// Gamification
var LEVEL_TITLES = ['Newbie', 'Coin Counter', 'Budget Rookie', 'Sub Tracker', 'Budget Warrior', 'Expense Knight', 'Savings Wizard', 'Finance Lord', 'Treasure Master', 'Sub Overlord'];
var BADGES = [
    { id: 'early_bird', name: 'Early Bird', icon: '\uD83D\uDC26', desc: 'Check reminders 3x', cond: function (g) { return g.remChecked >= 3; } },
    { id: 'budget_master', name: 'Budget King', icon: '\uD83D\uDC51', desc: 'Stay under budget', cond: function (g) { return g.underBudget; } },
    { id: 'streak_3', name: 'Hot Streak', icon: '\uD83D\uDD25', desc: '3-day streak', cond: function (g) { return g.streak >= 3; } },
    { id: 'streak_7', name: 'Inferno', icon: '\uD83D\uDCAB', desc: '7-day streak', cond: function (g) { return g.streak >= 7; } },
    { id: 'collector', name: 'Collector', icon: '\uD83D\uDCE6', desc: 'Track 10+ subs', cond: function () { return subscriptions.length >= 10; } },
    { id: 'penny', name: 'Penny Pincher', icon: '\uD83D\uDCB0', desc: 'Save $50+', cond: function (g) { return g.saved >= 50; } },
    { id: 'organized', name: 'Organized', icon: '\uD83D\uDCCB', desc: '4+ categories', cond: function () { var cats = new Set(subscriptions.map(function (s) { return s.category; })); return cats.size >= 4; } },
    { id: 'explorer', name: 'Explorer', icon: '\uD83D\uDDFA\uFE0F', desc: 'Visit all screens', cond: function (g) { return g.screens >= 5; } },
];
var GS = { xp: 650, level: 5, streak: 7, badges: ['early_bird', 'streak_3', 'streak_7', 'collector', 'organized'], remChecked: 5, underBudget: true, saved: 34.99, screens: 5, budget: 400 };
var suppressToasts = true; // Prevent badge toasts on initial load

// Toast System
function showToast(title, msg, type, dur) {
    type = type || 'info';
    dur = dur || 3500;
    var c = document.getElementById('toast-container');
    var t = document.createElement('div');
    t.className = 'toast toast--' + type;
    var icons = { success: '\u2705', error: '\u274C', info: '\uD83D\uDCAC', achievement: '\uD83C\uDFC6' };
    t.innerHTML = '<span class="toast__icon">' + (icons[type] || '\uD83D\uDCCC') + '</span><div class="toast__body"><span class="toast__title">' + title + '</span><span class="toast__message">' + msg + '</span></div><div class="toast__progress" style="animation:toastProg ' + dur + 'ms linear forwards"></div>';
    c.appendChild(t);
    if (!document.querySelector('[data-tp]')) {
        var s = document.createElement('style');
        s.setAttribute('data-tp', '');
        s.textContent = '@keyframes toastProg{from{width:100%}to{width:0%}}';
        document.head.appendChild(s);
    }
    setTimeout(function () { t.classList.add('toast--removing'); setTimeout(function () { t.remove(); }, 300); }, dur);
}

// Animated Counter
function animateCounter(el, target, dur, prefix, suffix) {
    if (!el) return;
    dur = dur || 1200; prefix = prefix || ''; suffix = suffix || '';
    var isFloat = target % 1 !== 0;
    var startTime = performance.now();
    function update(now) {
        var p = Math.min((now - startTime) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (isFloat ? (target * e).toFixed(2) : Math.round(target * e)) + suffix;
        if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// Particle System
var pAnim = null;
function initParticles() {
    var cv = document.getElementById('particleCanvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var w, h, pts = [];
    function resize() { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    function Particle() { this.x = Math.random() * w; this.y = Math.random() * h; this.vx = (Math.random() - .5) * .4; this.vy = (Math.random() - .5) * .4; this.r = Math.random() * 2 + .5; this.a = Math.random() * .3 + .1; }
    Particle.prototype.update = function () { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > w) this.vx *= -1; if (this.y < 0 || this.y > h) this.vy *= -1; };
    Particle.prototype.draw = function () { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(124,58,237,' + this.a + ')'; ctx.fill(); };
    for (var i = 0; i < 50; i++) pts.push(new Particle());
    function go() {
        ctx.clearRect(0, 0, w, h);
        pts.forEach(function (p) { p.update(); p.draw(); });
        for (var i = 0; i < pts.length; i++) {
            for (var j = i + 1; j < pts.length; j++) {
                var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
                if (d < 130) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = 'rgba(124,58,237,' + (0.05 * (1 - d / 130)) + ')'; ctx.lineWidth = .5; ctx.stroke(); }
            }
        }
        pAnim = requestAnimationFrame(go);
    }
    go();
}
function stopParticles() { if (pAnim) { cancelAnimationFrame(pAnim); pAnim = null; } }

// Avatar Expression
function setAvatarMood(mood) {
    var mouth = document.getElementById('avatarMouth');
    if (!mouth) return;
    mouth.className = 'auth-avatar__mouth auth-avatar__mouth--' + mood;
}

// Avatar Eye Tracking
document.addEventListener('mousemove', function (e) {
    var pupils = document.querySelectorAll('.auth-avatar__pupil');
    if (!pupils.length) return;

    pupils.forEach(function (pupil) {
        var eye = pupil.parentElement;
        var rect = eye.getBoundingClientRect();
        var eyeCX = rect.left + rect.width / 2;
        var eyeCY = rect.top + rect.height / 2;

        var dx = e.clientX - eyeCX;
        var dy = e.clientY - eyeCY;
        var angle = Math.atan2(dy, dx);

        // Max distance the pupil can move from the center
        var maxDist = rect.width / 4;
        // Dampen distance dynamically
        var dist = Math.min(maxDist, Math.hypot(dx, dy) * 0.05);

        var tx = Math.cos(angle) * dist;
        var ty = Math.sin(angle) * dist;
        pupil.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
    });
});

// Gamification Engine
function addXP(amt, reason) {
    GS.xp += amt;
    var need = (GS.level + 1) * 200;
    if (GS.xp >= need) { GS.level++; GS.xp -= need; showToast('Level Up!', 'Level ' + GS.level + ': ' + (LEVEL_TITLES[GS.level - 1] || 'Legend'), 'achievement', 4000); }
    else { showToast('+' + amt + ' XP', reason, 'success', 2000); }
    checkBadges(); renderGame();
}
function checkBadges() {
    BADGES.forEach(function (b) {
        if (!GS.badges.includes(b.id) && b.cond(GS)) { GS.badges.push(b.id); if (!suppressToasts) showToast('Badge Unlocked!', b.icon + ' ' + b.name, 'achievement', 4500); }
    });
}
let currentUser = null; // Store user data

function cloneSidebars(activeViewId) {
    const original = document.querySelector('#view-dashboard .sidebar');
    document.querySelectorAll('.sidebar[data-clone]').forEach(placeholder => {
        const clone = original.cloneNode(true);
        clone.removeAttribute('id');
        clone.setAttribute('data-clone', 'sidebar');
        clone.querySelectorAll('.sidebar__link').forEach(link => {
            link.classList.toggle('active', link.dataset.target === activeViewId);
        });
        placeholder.replaceWith(clone);
        clone.querySelectorAll('.sidebar__link').forEach(bindNavLink);
        const logoutBtn = clone.querySelector('#logoutBtn') || clone.querySelector('.sidebar__user .btn-icon');
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    });
}

function bindNavLink(link) {
    link.addEventListener('click', e => { e.preventDefault(); showView(link.dataset.target); });
}

// ──────────────────────────────────────────────
// AUTH
// ──────────────────────────────────────────────
const authTabs = document.getElementById('authTabs');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const indicator = document.querySelector('.auth-tab__indicator');

authTabs?.addEventListener('click', e => {
    const tab = e.target.closest('.auth-tab');
    if (!tab) return;
    document.querySelectorAll('.auth-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
    if (tab.dataset.tab === 'login') {
        loginForm.classList.remove('hidden'); signupForm.classList.add('hidden');
        indicator.style.transform = 'translateX(0)';
        setAvatarMood('neutral');
    } else {
        loginForm.classList.add('hidden'); signupForm.classList.remove('hidden');
        indicator.style.transform = 'translateX(100%)';
        setAvatarMood('happy');
    }
});

// Avatar reacts to typing
document.querySelectorAll('#loginForm input, #signupForm input').forEach(inp => {
    inp.addEventListener('focus', () => { setAvatarMood('happy'); });
    inp.addEventListener('blur', () => { setAvatarMood('neutral'); });
});

loginForm?.addEventListener('submit', async e => {
    e.preventDefault();
    setAvatarMood('happy');
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');

    if (!email || !password) return showToast('Error', 'Please enter email and password', 'danger', 3000);

    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Loading...</span>';

    try {
        const res = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            currentUser = data.user;

            // Clear default/mock subscriptions for the new user session
            subscriptions = [];
            nextId = 1;

            // Reset gamification/streak state if needed
            if (typeof gameState !== 'undefined') {
                gameState.xp = 0;
                gameState.level = 1;
                gameState.badges = [];
            } else if (typeof GS !== 'undefined') {
                GS.xp = 0;
                GS.level = 1;
                GS.badges = [];
            }

            addXP(10, 'Logged in');
            showView('view-dashboard');
            if (typeof startOnboarding === 'function') startOnboarding();

            // Update UI with real name and initials
            const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            document.querySelectorAll('.sidebar__user').forEach(userEl => {
                const avatar = userEl.querySelector('.avatar');
                const nameEl = userEl.querySelector('.sidebar__user-name');
                const emailEl = userEl.querySelector('.sidebar__user-email');
                if (avatar) avatar.textContent = initials;
                if (nameEl) nameEl.textContent = currentUser.name;
                if (emailEl) emailEl.textContent = currentUser.email;
            });
            const titleObj = document.querySelector('.topbar__subtitle');
            if (titleObj && titleObj.textContent.includes('Welcome')) {
                titleObj.textContent = `Welcome back, ${currentUser.name.split(' ')[0]} 👋`;
            }
        } else {
            showToast('Error', data.error, 'danger', 3000);
        }
    } catch (err) {
        showToast('Demo Mode', 'Running without backend - using demo data', 'info', 3000);
        addXP(10, 'Entered the kingdom');
        showView('view-dashboard');
    } finally {
        btn.innerHTML = originalText;
    }
});

signupForm?.addEventListener('submit', async e => {
    e.preventDefault();
    setAvatarMood('happy');
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const btn = document.getElementById('signupBtn');

    if (!name || !email || !password) return showToast('Error', 'Please fill all fields', 'danger', 3000);

    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Loading...</span>';

    try {
        const res = await fetch('http://localhost:5000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            showToast('Success', 'Account created! Please log in.', 'success', 3000);

            // Clear form and switch to login tab
            signupForm.reset();
            const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
            if (loginTab) loginTab.click();

            // Pre-fill the login email for convenience
            document.getElementById('loginEmail').value = email;
            document.getElementById('loginPassword').value = '';
            document.getElementById('loginPassword').focus();
        } else {
            showToast('Error', data.error, 'danger', 3000);
        }
    } catch (err) {
        showToast('Error', 'Backend server offline (Port 5000)', 'danger', 3000);
    } finally {
        btn.innerHTML = originalText;
    }
});

document.getElementById('biometricBtn')?.addEventListener('click', () => {
    setAvatarMood('happy');
    addXP(10, 'Quick access');
    showView('view-dashboard');
});
// Keyboard support for biometric
document.getElementById('biometricBtn')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setAvatarMood('happy');
        addXP(10, 'Quick access');
        showView('view-dashboard');
    }
});

function handleLogout() {
    currentUser = null;
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    showView('view-auth');
    setAvatarMood('neutral');
}

// ──────────────────────────────────────────────
// DASHBOARD
// ──────────────────────────────────────────────
function renderDashboard() {
    const total = subscriptions.reduce((s, sub) => s + sub.cost, 0);
    // Animated counters
    const totalEl = document.getElementById('totalSpend');
    const activeEl = document.getElementById('activeSubs');
    if (totalEl) animateCounter(totalEl, total, 1200, '$');
    if (activeEl) animateCounter(activeEl, subscriptions.length, 800);

    document.querySelector('.chart-center__value').textContent = '$' + total.toFixed(2);

    renderBudgetRing();
    renderGame();
    renderInsight();
    drawDonutChart();
    renderDashSubList();
}

function renderDashSubList() {
    const container = document.getElementById('dashSubList');
    if (!container) return;
    container.innerHTML = subscriptions.map(sub => {
        const brand = BRANDS[sub.brand] || BRANDS.custom;
        const buildingIcon = BUILDING_MAP[sub.brand] || '🏰';
        return `
        <div class="sub-item" role="listitem" tabindex="0" aria-label="${sub.name} - $${sub.cost.toFixed(2)} per ${sub.cycle}">
            <div class="sub-icon" style="background:${sub.color}20;color:${sub.color}">${sub.icon}</div>
            <div class="sub-info">
                <span class="sub-name">${sub.name}</span>
                <span class="sub-category">${CATEGORY_LABELS[sub.category] || sub.category}</span>
                <span class="sub-building-label">${buildingIcon} ${brand.building || 'Custom Keep'}</span>
            </div>
            <div>
                <span class="sub-price">$${sub.cost.toFixed(2)}</span>
                <span class="sub-cycle">/${sub.cycle}</span>
            </div>
        </div>`;
    }).join('');
}

// Kingdom Map
function renderKingdom() {
    var map = document.getElementById('kingdomMap');
    if (!map) return;
    map.innerHTML = subscriptions.map(function (sub) {
        var brand = BRANDS[sub.brand] || BRANDS.custom;
        return '<div class="kingdom-building" role="listitem" tabindex="0" title="' + sub.name + ' - $' + sub.cost.toFixed(2) + '/mo - ' + (sub.usage || 50) + '% usage">' +
            '<div class="kingdom-building__glow" style="background:' + sub.color + '"></div>' +
            '<span class="kingdom-building__emoji">' + brand.building + '</span>' +
            '<span class="kingdom-building__name">' + brand.buildingName + '</span>' +
            '<span class="kingdom-building__cost">$' + sub.cost.toFixed(2) + '</span>' +
            '</div>';
    }).join('');
    // AI Prediction Chart
    function renderPredictions() {
        var cv = document.getElementById('predictCanvas');
        if (!cv) return;
        var ctx = cv.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var w = 300, h = 140;
        cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px';
        ctx.scale(dpr, dpr);
        var actual = [198, 215, 243, 256, 254, 285];
        var predicted = [null, null, null, null, null, 285, 299, 312, 305];
        var all = actual.concat(predicted.slice(actual.length));
        var max = Math.max.apply(null, all.filter(function (v) { return v !== null; })) * 1.1;
        var xStep = w / (all.length - 1);
        ctx.clearRect(0, 0, w, h);
        // Actual line
        ctx.beginPath(); ctx.strokeStyle = '#A78BFA'; ctx.lineWidth = 2.5;
        actual.forEach(function (v, i) { var x = i * xStep, y = h - 10 - (v / max) * (h - 20); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.stroke();
        // Predicted line dashed
        ctx.beginPath(); ctx.strokeStyle = '#F472B6'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
        predicted.forEach(function (v, i) { if (v === null) return; var x = i * xStep, y = h - 10 - (v / max) * (h - 20); if (i === actual.length - 1 || (i > 0 && predicted[i - 1] === null)) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
        ctx.stroke(); ctx.setLineDash([]);
        // Dots
        actual.forEach(function (v, i) { ctx.beginPath(); ctx.arc(i * xStep, h - 10 - (v / max) * (h - 20), 3, 0, Math.PI * 2); ctx.fillStyle = '#A78BFA'; ctx.fill(); });
        predicted.forEach(function (v, i) { if (v === null || i < actual.length) return; ctx.beginPath(); ctx.arc(i * xStep, h - 10 - (v / max) * (h - 20), 3, 0, Math.PI * 2); ctx.fillStyle = '#F472B6'; ctx.fill(); });
        // Labels
        ctx.fillStyle = '#7A7A96'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
        ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].forEach(function (m, i) { ctx.fillText(m, i * xStep, h - 1); });
    }

    // Usage Heatmap
    function renderHeatmap() {
        var hm = document.getElementById('usageHeatmap');
        if (!hm) return;
        var cells = [];
        for (var i = 0; i < 28; i++) {
            var activity = Math.random() * 100;
            var color;
            if (activity > 80) color = 'rgba(124,58,237,0.8)';
            else if (activity > 60) color = 'rgba(124,58,237,0.5)';
            else if (activity > 30) color = 'rgba(124,58,237,0.25)';
            else color = 'rgba(124,58,237,0.08)';
            cells.push('<div class="heatmap-cell" style="background:' + color + '" title="Day ' + (i + 1) + ': ' + Math.round(activity) + '% active"></div>');
        }
        hm.innerHTML = cells.join('');
    }

    // Forecast Chart
    function renderForecast() {
        var cv = document.getElementById('forecastChart');
        if (!cv) return;
        var ctx = cv.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var w = cv.parentElement.clientWidth - 48, h = 200;
        cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px';
        ctx.scale(dpr, dpr);
        var actual = [198, 215, 243, 256, 254, 285];
        var forecast = [285, 298, 312, 305, 320, 335];
        var all = actual.concat(forecast.slice(1));
        var max = Math.max.apply(null, all) * 1.1;
        var months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
        var total = months.length;
        var xStep = (w - 60) / (total - 1);
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i <= 4; i++) { var y = h - 30 - (h - 50) * i / 4; ctx.strokeStyle = 'rgba(124,58,237,.06)'; ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w - 10, y); ctx.stroke(); ctx.fillStyle = '#7A7A96'; ctx.font = '10px Inter'; ctx.textAlign = 'right'; ctx.fillText('$' + Math.round(max * i / 4), 35, y + 3); }
        // Actual area
        ctx.beginPath(); ctx.moveTo(40, h - 30);
        actual.forEach(function (v, i) { ctx.lineTo(40 + i * xStep, h - 30 - (v / max) * (h - 50)); });
        ctx.lineTo(40 + (actual.length - 1) * xStep, h - 30); ctx.closePath();
        var aGrad = ctx.createLinearGradient(0, 0, 0, h); aGrad.addColorStop(0, 'rgba(124,58,237,.2)'); aGrad.addColorStop(1, 'rgba(124,58,237,0)');
        ctx.fillStyle = aGrad; ctx.fill();
        // Actual line
        ctx.beginPath(); ctx.strokeStyle = '#A78BFA'; ctx.lineWidth = 2.5;
        actual.forEach(function (v, i) { var x = 40 + i * xStep, y = h - 30 - (v / max) * (h - 50); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.stroke();
        // Forecast area
        ctx.beginPath(); ctx.moveTo(40 + (actual.length - 1) * xStep, h - 30);
        forecast.forEach(function (v, i) { ctx.lineTo(40 + (actual.length - 1 + i) * xStep, h - 30 - (v / max) * (h - 50)); });
        ctx.lineTo(40 + (actual.length - 1 + forecast.length - 1) * xStep, h - 30); ctx.closePath();
        var fGrad = ctx.createLinearGradient(0, 0, 0, h); fGrad.addColorStop(0, 'rgba(244,114,182,.15)'); fGrad.addColorStop(1, 'rgba(244,114,182,0)');
        ctx.fillStyle = fGrad; ctx.fill();
        // Forecast line dashed
        ctx.beginPath(); ctx.strokeStyle = '#F472B6'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
        forecast.forEach(function (v, i) { var x = 40 + (actual.length - 1 + i) * xStep, y = h - 30 - (v / max) * (h - 50); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#7A7A96'; ctx.font = '11px Inter'; ctx.textAlign = 'center';
        months.forEach(function (m, i) { if (i < total) ctx.fillText(m, 40 + i * xStep, h - 8); });
    }

    // View Router
    function showView(id) {
        document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('active'); });
        var t = document.getElementById(id);
        if (!t) return;
        t.classList.add('active');
        if (id === 'view-auth') initParticles(); else stopParticles();
        if (id !== 'view-auth') cloneSidebars(id);
        document.querySelectorAll('.sidebar__link').forEach(function (l) { l.classList.toggle('active', l.dataset.target === id); });
        switch (id) {
            case 'view-dashboard': renderDashboard(); break;
            case 'view-add': renderManage(); break;
            case 'view-reminders': renderReminders(); addXP(15, 'Checked battle alerts'); break;
            case 'view-insights': renderInsightsScreen(); break;
            case 'view-summary': renderSummary(); break;
        }
    }
    function cloneSidebars(activeId) {
        var orig = document.querySelector('#view-dashboard .sidebar');
        document.querySelectorAll('.sidebar[data-clone]').forEach(function (ph) {
            var cl = orig.cloneNode(true); cl.removeAttribute('id'); cl.setAttribute('data-clone', 'sidebar');
            cl.querySelectorAll('.sidebar__link').forEach(function (l) { l.classList.toggle('active', l.dataset.target === activeId); });
            ph.replaceWith(cl);
            cl.querySelectorAll('.sidebar__link').forEach(bindNav);
            var lb = cl.querySelector('#logoutBtn') || cl.querySelector('.sidebar__user .btn-icon');
            if (lb) lb.addEventListener('click', handleLogout);
        });
    }
    function bindNav(l) { l.addEventListener('click', function (e) { e.preventDefault(); showView(l.dataset.target); }); }

    // Dashboard
    function renderDashboard() {
        var total = subscriptions.reduce(function (s, sub) { return s + sub.cost; }, 0);
        animateCounter(document.getElementById('totalSpend'), total, 1200, '$');
        animateCounter(document.getElementById('activeSubs'), subscriptions.length, 800);
        var centerVal = document.querySelector('.chart-center__value');
        if (centerVal) centerVal.textContent = '$' + total.toFixed(2);
        renderHealthScore();
        renderGame();
        renderKingdom();
        renderPredictions();
        drawDonutChart();
    }

    // Donut Chart
    function drawDonutChart() {
        var cv = document.getElementById('donutChart');
        if (!cv) return;
        var ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1, size = 240;
        cv.width = size * dpr; cv.height = size * dpr; cv.style.width = size + 'px'; cv.style.height = size + 'px';
        ctx.scale(dpr, dpr);
        var groups = {};
        subscriptions.forEach(function (s) { groups[s.category] = (groups[s.category] || 0) + s.cost; });
        var total = Object.values(groups).reduce(function (a, b) { return a + b; }, 0);
        var entries = Object.entries(groups).sort(function (a, b) { return b[1] - a[1]; });
        var cx = size / 2, cy = size / 2, oR = 105, iR = 70;
        var prog = 0;
        function draw() {
            prog = Math.min(prog + 0.03, 1);
            ctx.clearRect(0, 0, size, size);
            var sa = -Math.PI / 2;
            entries.forEach(function (entry) {
                var cat = entry[0], val = entry[1];
                var sw = (val / total) * Math.PI * 2 * prog;
                var ea = sa + sw;
                ctx.beginPath(); ctx.arc(cx, cy, oR, sa, ea); ctx.arc(cx, cy, iR, ea, sa, true); ctx.closePath();
                ctx.fillStyle = CATEGORY_COLORS[cat] || '#A0A0B8'; ctx.fill();
                sa = ea;
            });
            if (prog < 1) requestAnimationFrame(draw);
        }
        draw();
        var leg = document.getElementById('donutLegend');
        if (leg) leg.innerHTML = entries.map(function (e) { return '<div class="legend-item"><span class="legend-dot" style="background:' + (CATEGORY_COLORS[e[0]] || '#A0A0B8') + '"></span>' + (CATEGORY_LABELS[e[0]] || e[0]) + ' - $' + e[1].toFixed(2) + '</div>'; }).join('');
    }

    // Manage Subscriptions
    function renderManage() { renderManageList(); }
    function renderManageList() {
        var c = document.getElementById('manageSubList');
        if (!c) return;
        c.innerHTML = subscriptions.map(function (s) {
            return '<div class="manage-item" role="listitem"><div class="sub-icon" style="background:' + s.color + '20;color:' + s.color + '">' + s.icon + '</div><div class="sub-info"><span class="sub-name">' + s.name + '</span><span class="sub-category">$' + s.cost.toFixed(2) + ' / ' + s.cycle + '</span></div><div class="manage-item__actions"><button class="btn btn--danger btn--sm" onclick="deleteSub(' + s.id + ')">Release</button></div></div>';
        }).join('');
    }

    // Brand Picker
    var brandPicker = document.getElementById('brandPicker');
    if (brandPicker) brandPicker.addEventListener('click', function (e) {
        var ch = e.target.closest('.brand-chip');
        if (!ch) return;
        document.querySelectorAll('.brand-chip').forEach(function (c) { c.classList.remove('active'); });
        ch.classList.add('active');
        var b = BRANDS[ch.dataset.brand];
        if (b && b.name) document.getElementById('subName').value = b.name;
        ch.querySelector('.brand-chip__icon').style.background = ch.dataset.color;
        // Animate pokeball button glow
        var btn = document.querySelector('.pokeball-visual__button');
        if (btn) { btn.style.boxShadow = '0 0 25px ' + ch.dataset.color; setTimeout(function () { btn.style.boxShadow = ''; }, 1500); }
    });
    document.querySelectorAll('.brand-chip').forEach(function (ch) { ch.querySelector('.brand-chip__icon').style.background = ch.dataset.color; });

    // Pokeball Capture with Blinking Light + Flash
    function showPokeballCapture(name) {
        var ov = document.createElement('div');
        ov.className = 'pokeball-capture';
        // Generate star burst positions
        var stars = '';
        for (var i = 0; i < 10; i++) {
            var angle = i * 36;
            var radius = 80 + Math.random() * 40;
            var sx = Math.cos(angle * Math.PI / 180) * radius;
            var sy = Math.sin(angle * Math.PI / 180) * radius;
            stars += '<span style="top:calc(50% + ' + sy + 'px - 12px);left:calc(50% + ' + sx + 'px - 12px);animation-delay:' + (i * 0.08) + 's">\u2728</span>';
        }
        ov.innerHTML =
            '<div class="pokeball-capture__glow"></div>' +
            '<div class="pokeball-capture__flash"></div>' +
            '<div style="position:relative;display:flex;flex-direction:column;align-items:center;z-index:2">' +
            '<div class="pokeball-lg">' +
            '<div class="pokeball-visual__top"></div>' +
            '<div class="pokeball-visual__band" style="top:64px"></div>' +
            '<div class="pokeball-visual__bottom"></div>' +
            '<div class="pokeball-visual__button"><div class="pokeball-visual__button-inner"></div></div>' +
            '</div>' +
            '<div class="pokeball-stars">' + stars + '</div>' +
            '<div class="pokeball-text">' + name + ' captured!</div>' +
            '</div>';
        document.body.appendChild(ov);
        setTimeout(function () { ov.style.opacity = '0'; ov.style.transition = 'opacity .4s'; setTimeout(function () { ov.remove(); }, 400); }, 2800);
    }

    // Add Form
    var addForm = document.getElementById('addSubForm');
    if (addForm) addForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('subName').value.trim();
        var cost = parseFloat(document.getElementById('subCost').value);
        var cycle = document.getElementById('subCycle').value;
        var cat = document.getElementById('subCategory').value;
        var date = document.getElementById('subDate').value;
        if (!name || isNaN(cost)) return;
        var ac = document.querySelector('.brand-chip.active');
        var bk = ac ? ac.dataset.brand : 'custom';
        var b = BRANDS[bk] || BRANDS.custom;
        subscriptions.push({ id: nextId++, name: name, brand: bk, cost: cost, cycle: cycle, category: cat, nextDate: date || '2026-03-15', color: ac ? ac.dataset.color : b.color, icon: name.charAt(0).toUpperCase(), notify: true, usage: Math.floor(Math.random() * 60) + 40 });
        showPokeballCapture(name);
        addXP(25, name + ' captured!');
        e.target.reset();
        document.querySelectorAll('.brand-chip').forEach(function (c) { c.classList.remove('active'); });
        renderManageList();
    });

    function deleteSub(id) {
        var s = subscriptions.find(function (x) { return x.id === id; });
        subscriptions = subscriptions.filter(function (x) { return x.id !== id; });
        if (s) showToast('Released!', s.name + ' freed from kingdom', 'info');
        renderManageList();
    }

    var addQuick = document.getElementById('addSubQuick');
    if (addQuick) addQuick.addEventListener('click', function () { showView('view-add'); });

    // Reminders
    function renderReminders() {
        var now = new Date('2026-03-07');
        var sorted = subscriptions.slice().sort(function (a, b) { return new Date(a.nextDate) - new Date(b.nextDate); });
        var c = document.getElementById('reminderTimeline');
        if (!c) return;
        var wk = new Date(now); wk.setDate(wk.getDate() + 7);
        var urg = sorted.filter(function (s) { var d = new Date(s.nextDate); return d >= now && d <= wk; });
        var ban = document.getElementById('urgencyBanner');
        if (ban) {
            var td = urg.reduce(function (s, sub) { return s + sub.cost; }, 0);
            ban.querySelector('strong').textContent = urg.length + ' payment' + (urg.length !== 1 ? 's' : '') + ' due this week';
            ban.querySelector('span').textContent = 'Total: $' + td.toFixed(2) + ' - Defend your treasury!';
        }
        var Mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        c.innerHTML = sorted.map(function (s) {
            var d = new Date(s.nextDate);
            var diff = Math.ceil((d - now) / 86400000);
            var u = 'later';
            if (diff <= 3) u = 'urgent'; else if (diff <= 7) u = 'soon';
            return '<div class="reminder-card glass ' + u + '" role="listitem" tabindex="0">' +
                '<div class="reminder-date"><span class="reminder-date__day">' + d.getDate() + '</span><span class="reminder-date__month">' + Mo[d.getMonth()] + '</span></div>' +
                '<div class="sub-icon" style="background:' + s.color + '20;color:' + s.color + '">' + s.icon + '</div>' +
                '<div class="reminder-info"><span class="reminder-name">' + s.name + '</span><span class="reminder-amount">$' + s.cost.toFixed(2) + ' \u00B7 ' + (diff <= 0 ? 'Today' : diff === 1 ? 'Tomorrow' : 'in ' + diff + ' days') + '</span></div>' +
                '<div class="reminder-actions"><button class="reminder-toggle ' + (s.notify ? 'on' : '') + '" data-id="' + s.id + '" role="switch" aria-checked="' + s.notify + '"></button><button class="btn btn--warning btn--sm">Snooze</button></div>' +
                '</div>';
        }).join('');
        c.querySelectorAll('.reminder-toggle').forEach(function (t) {
            t.addEventListener('click', function () {
                var id = parseInt(t.dataset.id);
                var s = subscriptions.find(function (x) { return x.id === id; });
                if (s) { s.notify = !s.notify; t.classList.toggle('on', s.notify); t.setAttribute('aria-checked', String(s.notify)); }
            });
            t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); } });
        });
    }

    // ──────────────────────────────────────────────
    // MONTHLY SUMMARY
    // ──────────────────────────────────────────────
    function renderSummary() {
        const total = subscriptions.reduce((s, sub) => s + sub.cost, 0);
        const paidCount = subscriptions.filter(s => {
            const d = new Date(s.nextDate);
            return d < new Date(); // Past due dates count as paid for this demo
        }).length;
        const totalCount = subscriptions.length;

        // Animate summary counters
        const totalEl = document.querySelector('.summary-total .stat-value');
        if (totalEl) {
            totalEl.dataset.target = total.toFixed(2);
            animateCounter(totalEl, total, 1200, '$');
        }

        // Example logic for "Savings" - in a real app this would analyze usage
        const savingsEl = document.querySelector('.summary-saved .stat-value');
        if (savingsEl) {
            const potentialSavings = total > 50 ? (total * 0.15).toFixed(2) : 0; // Fake 15% savings suggestion
            savingsEl.dataset.target = potentialSavings;
            animateCounter(savingsEl, parseFloat(potentialSavings), 1200, '$');
        }

        const countEl = document.querySelector('.summary-count .stat-value');
        const remainingEl = document.querySelector('.summary-count .stat-hint');
        if (countEl) countEl.innerHTML = `${paidCount} / ${totalCount}`;
        if (remainingEl) remainingEl.textContent = `${totalCount - paidCount} remaining this month`;

        // Savings Challenge Bar
        const challengeTotal = 50;
        const challengeSaved = total > 0 ? Math.min(challengeTotal, 35) : 0; // Mock progress for demo
        const fillEl = document.getElementById('savingsFill');
        if (fillEl) {
            fillEl.style.width = Math.min((challengeSaved / challengeTotal) * 100, 100) + '%';
            fillEl.innerHTML = `<span class="savings-challenge__pct">$${challengeSaved} / $${challengeTotal}</span>`;
        }

        drawBarChart(total);
        drawCategoryMiniDonuts();
    }

    function drawBarChart(currentMonthTotal) {
        const canvas = document.getElementById('barChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.parentElement.clientWidth - 48;
        const h = 260;
        canvas.width = w * dpr; canvas.height = h * dpr;
        canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
        ctx.scale(dpr, dpr);

        const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        // Use the dynamic total for the current month
        const values = [0, 0, 0, 0, currentMonthTotal === 0 ? 0 : currentMonthTotal * 0.8, currentMonthTotal];
        const maxVal = Math.max(...values, 100) * 1.15; // fallback max 100
        const barW = Math.min(40, (w - 80) / months.length - 12);
        const gap = (w - 60) / months.length;
        const baseY = h - 40, chartH = baseY - 20;

        let progress = 0;
        function drawFrame() {
            progress = Math.min(progress + 0.025, 1);
            ctx.clearRect(0, 0, w, h);
            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
            for (let i = 0; i <= 4; i++) {
                const y = baseY - (chartH * i / 4);
                ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w - 20, y); ctx.stroke();
                ctx.fillStyle = '#555E6E'; ctx.font = '11px Inter'; ctx.textAlign = 'right';
                ctx.fillText('$' + Math.round(maxVal * i / 4), 35, y + 4);
            }
            // Bars
            months.forEach((m, i) => {
                const x = 50 + i * gap;
                const barH = (values[i] / maxVal) * chartH * progress;
                const y = baseY - barH;
                const grad = ctx.createLinearGradient(x, y, x, baseY);
                if (i === months.length - 1) { grad.addColorStop(0, '#00FFAB'); grad.addColorStop(1, 'rgba(0,255,171,0.2)'); }
                else { grad.addColorStop(0, 'rgba(255,255,255,0.25)'); grad.addColorStop(1, 'rgba(255,255,255,0.05)'); }
                const r = 6;
                ctx.beginPath(); ctx.moveTo(x, baseY); ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y); ctx.lineTo(x + barW - r, y);
                ctx.quadraticCurveTo(x + barW, y, x + barW, y + r); ctx.lineTo(x + barW, baseY);
                ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
                if (progress >= 0.9 && values[i] > 0) {
                    ctx.fillStyle = i === months.length - 1 ? '#00FFAB' : '#8892A0';
                    ctx.font = '600 11px Inter'; ctx.textAlign = 'center';
                    ctx.fillText('$' + values[i].toFixed(0), x + barW / 2, y - 8);
                }
                ctx.fillStyle = '#8892A0'; ctx.font = '500 12px Inter'; ctx.fillText(m, x + barW / 2, baseY + 18);

            });
            if (progress < 1) requestAnimationFrame(drawFrame);
        }
        drawFrame();
    }
}
function drawCatDonuts() {
    var c = document.getElementById('catGrid');
    if (!c) return;
    var g = {};
    subscriptions.forEach(function (s) { g[s.category] = (g[s.category] || 0) + s.cost; });
    var t = Object.values(g).reduce(function (a, b) { return a + b; }, 0);
    c.innerHTML = Object.entries(g).sort(function (a, b) { return b[1] - a[1]; }).map(function (entry) {
        var cat = entry[0], v = entry[1];
        return '<div class="cat-item"><canvas class="cat-donut" data-cat="' + cat + '" data-value="' + v + '" data-total="' + t + '" width="64" height="64" role="img"></canvas><span class="cat-item__name">' + (CATEGORY_LABELS[cat] || cat) + '</span><span class="cat-item__value">$' + v.toFixed(2) + '</span></div>';
    }).join('');
    c.querySelectorAll('.cat-donut').forEach(function (cv) {
        var ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1, sz = 64;
        cv.width = sz * dpr; cv.height = sz * dpr; cv.style.width = sz + 'px'; cv.style.height = sz + 'px'; ctx.scale(dpr, dpr);
        var cat = cv.dataset.cat, val = parseFloat(cv.dataset.value), tot = parseFloat(cv.dataset.total), pct = val / tot;
        var cx = sz / 2, cy = sz / 2, oR = 28, iR = 20;
        var p = 0;
        function d() {
            p = Math.min(p + 0.03, 1);
            ctx.clearRect(0, 0, sz, sz);
            ctx.beginPath(); ctx.arc(cx, cy, oR, 0, Math.PI * 2); ctx.arc(cx, cy, iR, Math.PI * 2, 0, true); ctx.closePath(); ctx.fillStyle = 'rgba(124,58,237,.08)'; ctx.fill();
            var sa = -Math.PI / 2, ea = sa + pct * Math.PI * 2 * p;
            ctx.beginPath(); ctx.arc(cx, cy, oR, sa, ea); ctx.arc(cx, cy, iR, ea, sa, true); ctx.closePath(); ctx.fillStyle = CATEGORY_COLORS[cat] || '#A0A0B8'; ctx.fill();
            ctx.fillStyle = '#F0F0F5'; ctx.font = '700 12px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(Math.round(pct * 100 * p) + '%', cx, cy);
            if (p < 1) requestAnimationFrame(d);
        }
        d();
    });
}

var exportBtn = document.getElementById('exportBtn');
if (exportBtn) exportBtn.addEventListener('click', function () { showToast('Exported!', 'Treasury report saved', 'success'); });

// Nav & Init
document.querySelectorAll('#view-dashboard .sidebar__link').forEach(bindNav);
var logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
showView('view-auth');
setTimeout(function () { suppressToasts = false; }, 2000);
