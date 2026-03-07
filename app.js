/* SubSync v2 - Pure Frontend Application */

var BRANDS = {
    netflix: { name: 'Netflix', color: '#E50914', icon: 'N', category: 'entertainment', building: '\uD83C\uDFAC', buildingName: 'Cinema Tower' },
    spotify: { name: 'Spotify', color: '#1DB954', icon: 'S', category: 'music', building: '\uD83C\uDFB5', buildingName: 'Music Hall' },
    youtube: { name: 'YouTube Premium', color: '#FF0000', icon: 'Y', category: 'entertainment', building: '\uD83D\uDCFA', buildingName: 'Video Palace' },
    adobe: { name: 'Adobe CC', color: '#FF0000', icon: 'A', category: 'productivity', building: '\uD83C\uDFD7\uFE0F', buildingName: 'Creator Forge' },
    figma: { name: 'Figma', color: '#A259FF', icon: 'F', category: 'productivity', building: '\uD83C\uDFA8', buildingName: 'Design Studio' },
    github: { name: 'GitHub Pro', color: '#8B5CF6', icon: 'G', category: 'productivity', building: '\u2694\uFE0F', buildingName: 'Code Armory' },
    icloud: { name: 'iCloud+', color: '#3B82F6', icon: 'i', category: 'cloud', building: '\u2601\uFE0F', buildingName: 'Cloud Castle' },
    custom: { name: '', color: '#7C3AED', icon: '+', category: 'other', building: '\uD83C\uDFF0', buildingName: 'Custom Keep' }
};
var CATEGORY_COLORS = { entertainment: '#E50914', productivity: '#A259FF', cloud: '#3B82F6', music: '#1DB954', news: '#F59E0B', fitness: '#22D3EE', other: '#A0A0B8' };
var CATEGORY_LABELS = { entertainment: '\uD83C\uDFAC Entertainment', productivity: '\u26A1 Productivity', cloud: '\u2601\uFE0F Cloud & Storage', music: '\uD83C\uDFB5 Music', news: '\uD83D\uDCF0 News & Media', fitness: '\uD83D\uDCAA Fitness', other: '\uD83D\uDCE6 Other' };

var subscriptions = [
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
    { id: 12, name: 'AWS', brand: 'custom', cost: 124.04, cycle: 'monthly', category: 'cloud', nextDate: '2026-04-01', color: '#FF9900', icon: 'A', notify: true, usage: 98 }
];
var nextId = 13;

/* Gamification */
var LEVEL_TITLES = ['Newbie', 'Coin Counter', 'Budget Rookie', 'Sub Tracker', 'Budget Warrior', 'Expense Knight', 'Savings Wizard', 'Finance Lord', 'Treasure Master', 'Sub Overlord'];
var BADGES = [
    { id: 'early_bird', name: 'Early Bird', icon: '\uD83D\uDC26', desc: 'Check reminders 3x', cond: function (g) { return g.remChecked >= 3; } },
    { id: 'budget_master', name: 'Budget King', icon: '\uD83D\uDC51', desc: 'Stay under budget', cond: function (g) { return g.underBudget; } },
    { id: 'streak_3', name: 'Hot Streak', icon: '\uD83D\uDD25', desc: '3-day streak', cond: function (g) { return g.streak >= 3; } },
    { id: 'streak_7', name: 'Inferno', icon: '\uD83D\uDCAB', desc: '7-day streak', cond: function (g) { return g.streak >= 7; } },
    { id: 'collector', name: 'Collector', icon: '\uD83D\uDCE6', desc: 'Track 10+ subs', cond: function () { return subscriptions.length >= 10; } },
    { id: 'penny', name: 'Penny Pincher', icon: '\uD83D\uDCB0', desc: 'Save $50+', cond: function (g) { return g.saved >= 50; } },
    { id: 'organized', name: 'Organized', icon: '\uD83D\uDCCB', desc: '4+ categories', cond: function () { var s = new Set(subscriptions.map(function (x) { return x.category; })); return s.size >= 4; } },
    { id: 'explorer', name: 'Explorer', icon: '\uD83D\uDDFA\uFE0F', desc: 'Visit all screens', cond: function (g) { return g.screens >= 5; } }
];
var GS = { xp: 650, level: 5, streak: 7, badges: ['early_bird', 'streak_3', 'streak_7', 'collector', 'organized'], remChecked: 5, underBudget: true, saved: 34.99, screens: 5, budget: 400 };
var suppressToasts = true;

/* ── Toast ── */
function showToast(title, msg, type, dur) {
    type = type || 'info'; dur = dur || 3500;
    var c = document.getElementById('toast-container'); if (!c) return;
    var t = document.createElement('div'); t.className = 'toast toast--' + type;
    var icons = { success: '\u2705', error: '\u274C', info: '\uD83D\uDCAC', achievement: '\uD83C\uDFC6' };
    t.innerHTML = '<span class="toast__icon">' + (icons[type] || '\uD83D\uDCCC') + '</span><div class="toast__body"><span class="toast__title">' + title + '</span><span class="toast__message">' + msg + '</span></div><div class="toast__progress" style="animation:toastProg ' + dur + 'ms linear forwards"></div>';
    c.appendChild(t);
    if (!document.querySelector('[data-tp]')) { var s = document.createElement('style'); s.setAttribute('data-tp', ''); s.textContent = '@keyframes toastProg{from{width:100%}to{width:0%}}'; document.head.appendChild(s); }
    setTimeout(function () { t.classList.add('toast--removing'); setTimeout(function () { t.remove(); }, 300); }, dur);
}

/* ── Animated Counter ── */
function animateCounter(el, target, dur, prefix, suffix) {
    if (!el) return; dur = dur || 1200; prefix = prefix || ''; suffix = suffix || '';
    var isFloat = target % 1 !== 0, startTime = performance.now();
    function update(now) {
        var p = Math.min((now - startTime) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (isFloat ? (target * e).toFixed(2) : Math.round(target * e)) + suffix;
        if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

/* ── Particles ── */
var pAnim = null;
function initParticles() {
    var cv = document.getElementById('particleCanvas'); if (!cv) return;
    var ctx = cv.getContext('2d'), w, h, pts = [];
    function resize() { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    function Pt() { this.x = Math.random() * w; this.y = Math.random() * h; this.vx = (Math.random() - .5) * .4; this.vy = (Math.random() - .5) * .4; this.r = Math.random() * 2 + .5; this.a = Math.random() * .3 + .1; }
    Pt.prototype.update = function () { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > w) this.vx *= -1; if (this.y < 0 || this.y > h) this.vy *= -1; };
    Pt.prototype.draw = function () { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(124,58,237,' + this.a + ')'; ctx.fill(); };
    for (var i = 0; i < 50; i++) pts.push(new Pt());
    (function go() {
        ctx.clearRect(0, 0, w, h); pts.forEach(function (p) { p.update(); p.draw(); });
        for (var i = 0; i < pts.length; i++) for (var j = i + 1; j < pts.length; j++) {
            var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
            if (d < 130) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = 'rgba(124,58,237,' + (0.05 * (1 - d / 130)) + ')'; ctx.lineWidth = .5; ctx.stroke(); }
        }
        pAnim = requestAnimationFrame(go);
    })();
}
function stopParticles() { if (pAnim) { cancelAnimationFrame(pAnim); pAnim = null; } }

/* ── Avatar ── */
function setAvatarMood(mood) {
    var m = document.getElementById('avatarMouth'); if (!m) return;
    m.className = 'auth-avatar__mouth auth-avatar__mouth--' + mood;
}

/* ── Gamification ── */
function addXP(amt, reason) {
    GS.xp += amt; var need = (GS.level + 1) * 200;
    if (GS.xp >= need) { GS.level++; GS.xp -= need; showToast('Level Up!', 'Level ' + GS.level + ': ' + (LEVEL_TITLES[GS.level - 1] || 'Legend'), 'achievement', 4000); }
    else if (!suppressToasts) { showToast('+' + amt + ' XP', reason, 'success', 2000); }
    checkBadges(); renderGame();
}
function checkBadges() {
    BADGES.forEach(function (b) {
        if (!GS.badges.includes(b.id) && b.cond(GS)) { GS.badges.push(b.id); if (!suppressToasts) showToast('Badge Unlocked!', b.icon + ' ' + b.name, 'achievement', 4500); }
    });
}
function renderGame() {
    var need = (GS.level + 1) * 200, pct = Math.min(GS.xp / need * 100, 100);
    var el = function (id) { return document.getElementById(id); };
    if (el('levelNum')) el('levelNum').textContent = GS.level;
    if (el('levelTitle')) el('levelTitle').textContent = LEVEL_TITLES[GS.level - 1] || 'Legend';
    if (el('xpBarFill')) el('xpBarFill').style.width = pct + '%';
    if (el('xpText')) el('xpText').textContent = GS.xp + ' / ' + need + ' XP';
    if (el('streakCount')) el('streakCount').textContent = GS.streak;
    if (el('sidebarLevel')) el('sidebarLevel').textContent = GS.level;
    if (el('sidebarXpFill')) el('sidebarXpFill').style.width = pct + '%';
    if (el('sidebarXpText')) el('sidebarXpText').textContent = GS.xp + ' / ' + need + ' XP';
    if (el('sidebarStreakNum')) el('sidebarStreakNum').textContent = GS.streak;
    var bg = el('badgeGrid');
    if (bg) bg.innerHTML = BADGES.map(function (b) {
        return '<div class="badge-item ' + (GS.badges.includes(b.id) ? 'badge-item--unlocked' : 'badge-item--locked') + '" title="' + b.desc + '"><span class="badge-item__icon">' + b.icon + '</span>' + b.name + '</div>';
    }).join('');
}

/* ── Health Score ── */
function renderHealthScore() {
    var avg = subscriptions.reduce(function (s, sub) { return s + (sub.usage || 50); }, 0) / subscriptions.length;
    var score = Math.round(avg), circ = 2 * Math.PI * 58, offset = circ - (score / 100) * circ;
    var fill = document.getElementById('healthRingFill'), scoreEl = document.getElementById('healthScore'), hint = document.getElementById('healthHint');
    if (fill) { fill.style.strokeDashoffset = offset; }
    if (scoreEl) animateCounter(scoreEl, score, 1000);
    var low = subscriptions.filter(function (s) { return (s.usage || 50) < 30; });
    if (hint) hint.textContent = low.length ? low.length + ' sub' + (low.length > 1 ? 's' : '') + ' need attention' : 'All subs healthy!';
    var svg = document.querySelector('.health-ring');
    if (svg && !svg.querySelector('#healthGradGood')) {
        var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = '<linearGradient id="healthGradGood" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#22D3EE"/></linearGradient>';
        svg.prepend(defs);
    }
}

/* ── Kingdom Map ── */
function renderKingdom() {
    var map = document.getElementById('kingdomMap'); if (!map) return;
    map.innerHTML = subscriptions.map(function (sub) {
        var brand = BRANDS[sub.brand] || BRANDS.custom;
        return '<div class="kingdom-building" role="listitem" tabindex="0" title="' + sub.name + ' - $' + sub.cost.toFixed(2) + '/mo">' +
            '<div class="kingdom-building__glow" style="background:' + sub.color + '"></div>' +
            '<span class="kingdom-building__emoji">' + brand.building + '</span>' +
            '<span class="kingdom-building__name">' + brand.buildingName + '</span>' +
            '<span class="kingdom-building__cost">$' + sub.cost.toFixed(2) + '</span></div>';
    }).join('');
}

/* ── AI Prediction Chart ── */
function renderPredictions() {
    var cv = document.getElementById('predictCanvas'); if (!cv) return;
    var ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1, w = 300, h = 140;
    cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px'; ctx.scale(dpr, dpr);
    var actual = [198, 215, 243, 256, 254, 285], predicted = [null, null, null, null, null, 285, 299, 312, 305];
    var all = actual.concat(predicted.slice(actual.length)), max = Math.max.apply(null, all.filter(function (v) { return v !== null; })) * 1.1;
    var xStep = w / (all.length - 1);
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath(); ctx.strokeStyle = '#A78BFA'; ctx.lineWidth = 2.5;
    actual.forEach(function (v, i) { var x = i * xStep, y = h - 10 - (v / max) * (h - 20); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }); ctx.stroke();
    ctx.beginPath(); ctx.strokeStyle = '#F472B6'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
    predicted.forEach(function (v, i) { if (v === null) return; var x = i * xStep, y = h - 10 - (v / max) * (h - 20); if (i === actual.length - 1 || (i > 0 && predicted[i - 1] === null)) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); ctx.setLineDash([]);
    actual.forEach(function (v, i) { ctx.beginPath(); ctx.arc(i * xStep, h - 10 - (v / max) * (h - 20), 3, 0, Math.PI * 2); ctx.fillStyle = '#A78BFA'; ctx.fill(); });
    predicted.forEach(function (v, i) { if (v === null || i < actual.length) return; ctx.beginPath(); ctx.arc(i * xStep, h - 10 - (v / max) * (h - 20), 3, 0, Math.PI * 2); ctx.fillStyle = '#F472B6'; ctx.fill(); });
    ctx.fillStyle = '#7A7A96'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].forEach(function (m, i) { ctx.fillText(m, i * xStep, h - 1); });
}

/* ── Usage Heatmap ── */
function renderHeatmap() {
    var hm = document.getElementById('usageHeatmap'); if (!hm) return;
    var cells = [];
    for (var i = 0; i < 28; i++) {
        var a = Math.random() * 100, color;
        if (a > 80) color = 'rgba(124,58,237,0.8)'; else if (a > 60) color = 'rgba(124,58,237,0.5)';
        else if (a > 30) color = 'rgba(124,58,237,0.25)'; else color = 'rgba(124,58,237,0.08)';
        cells.push('<div class="heatmap-cell" style="background:' + color + '" title="Day ' + (i + 1) + ': ' + Math.round(a) + '% active"></div>');
    }
    hm.innerHTML = cells.join('');
}

/* ── Forecast Chart ── */
function renderForecast() {
    var cv = document.getElementById('forecastChart'); if (!cv) return;
    var ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1;
    var w = cv.parentElement.clientWidth - 48, h = 200;
    cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px'; ctx.scale(dpr, dpr);
    var actual = [198, 215, 243, 256, 254, 285], forecast = [285, 298, 312, 305, 320, 335];
    var all = actual.concat(forecast.slice(1)), max = Math.max.apply(null, all) * 1.1;
    var months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    var total = months.length, xStep = (w - 60) / (total - 1);
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i <= 4; i++) { var y = h - 30 - (h - 50) * i / 4; ctx.strokeStyle = 'rgba(124,58,237,.06)'; ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w - 10, y); ctx.stroke(); ctx.fillStyle = '#7A7A96'; ctx.font = '10px Inter'; ctx.textAlign = 'right'; ctx.fillText('$' + Math.round(max * i / 4), 35, y + 3); }
    ctx.beginPath(); ctx.moveTo(40, h - 30);
    actual.forEach(function (v, i) { ctx.lineTo(40 + i * xStep, h - 30 - (v / max) * (h - 50)); });
    ctx.lineTo(40 + (actual.length - 1) * xStep, h - 30); ctx.closePath();
    var aG = ctx.createLinearGradient(0, 0, 0, h); aG.addColorStop(0, 'rgba(124,58,237,.2)'); aG.addColorStop(1, 'rgba(124,58,237,0)'); ctx.fillStyle = aG; ctx.fill();
    ctx.beginPath(); ctx.strokeStyle = '#A78BFA'; ctx.lineWidth = 2.5;
    actual.forEach(function (v, i) { var x = 40 + i * xStep, y = h - 30 - (v / max) * (h - 50); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(40 + (actual.length - 1) * xStep, h - 30);
    forecast.forEach(function (v, i) { ctx.lineTo(40 + (actual.length - 1 + i) * xStep, h - 30 - (v / max) * (h - 50)); });
    ctx.lineTo(40 + (actual.length - 1 + forecast.length - 1) * xStep, h - 30); ctx.closePath();
    var fG = ctx.createLinearGradient(0, 0, 0, h); fG.addColorStop(0, 'rgba(244,114,182,.15)'); fG.addColorStop(1, 'rgba(244,114,182,0)'); ctx.fillStyle = fG; ctx.fill();
    ctx.beginPath(); ctx.strokeStyle = '#F472B6'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
    forecast.forEach(function (v, i) { var x = 40 + (actual.length - 1 + i) * xStep, y = h - 30 - (v / max) * (h - 50); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#7A7A96'; ctx.font = '11px Inter'; ctx.textAlign = 'center';
    months.forEach(function (m, i) { ctx.fillText(m, 40 + i * xStep, h - 8); });
}

/* ── View Router ── */
function showView(id) {
    document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('active'); });
    var t = document.getElementById(id); if (!t) return;
    t.classList.add('active');
    if (id === 'view-auth') initParticles(); else stopParticles();
    if (id !== 'view-auth') cloneSidebars(id);
    document.querySelectorAll('.sidebar__link').forEach(function (l) { l.classList.toggle('active', l.dataset.target === id); });
    switch (id) {
        case 'view-dashboard': renderDashboard(); break;
        case 'view-add': renderManage(); break;
        case 'view-reminders': renderReminders(); break;
        case 'view-insights': renderForecast(); renderHeatmap(); break;
        case 'view-summary': renderSummary(); break;
    }
}
function cloneSidebars(activeId) {
    var orig = document.querySelector('#view-dashboard .sidebar'); if (!orig) return;
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

/* ── Auth ── */
var authTabs = document.getElementById('authTabs');
var loginForm = document.getElementById('loginForm');
var signupForm = document.getElementById('signupForm');
var indicator = document.querySelector('.auth-tab__indicator');

if (authTabs) authTabs.addEventListener('click', function (e) {
    var tab = e.target.closest('.auth-tab'); if (!tab) return;
    document.querySelectorAll('.auth-tab').forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
    if (tab.dataset.tab === 'login') {
        loginForm.classList.remove('hidden'); signupForm.classList.add('hidden');
        indicator.style.transform = 'translateX(0)'; setAvatarMood('neutral');
    } else {
        loginForm.classList.add('hidden'); signupForm.classList.remove('hidden');
        indicator.style.transform = 'translateX(100%)'; setAvatarMood('happy');
    }
});

document.querySelectorAll('#loginForm input, #signupForm input').forEach(function (inp) {
    inp.addEventListener('focus', function () { setAvatarMood('happy'); });
    inp.addEventListener('blur', function () { setAvatarMood('neutral'); });
});

/* Login - just navigate to dashboard */
if (loginForm) loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    setAvatarMood('happy');
    suppressToasts = false;
    addXP(10, 'Entered the kingdom');
    showView('view-dashboard');
});

/* Signup - switch to login tab */
if (signupForm) signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    setAvatarMood('happy');
    showToast('Account Created!', 'Welcome to SubSync!', 'success', 3000);
    signupForm.reset();
    var loginTab = document.querySelector('.auth-tab[data-tab="login"]');
    if (loginTab) loginTab.click();
});

/* Quick Access */
var biometric = document.getElementById('biometricBtn');
if (biometric) {
    biometric.addEventListener('click', function () { setAvatarMood('happy'); suppressToasts = false; addXP(10, 'Quick access'); showView('view-dashboard'); });
    biometric.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAvatarMood('happy'); suppressToasts = false; addXP(10, 'Quick access'); showView('view-dashboard'); } });
}

function handleLogout() { showView('view-auth'); setAvatarMood('neutral'); }

/* ── Dashboard ── */
function renderDashboard() {
    var total = subscriptions.reduce(function (s, sub) { return s + sub.cost; }, 0);
    animateCounter(document.getElementById('totalSpend'), total, 1200, '$');
    animateCounter(document.getElementById('activeSubs'), subscriptions.length, 800);
    var cv = document.querySelector('.chart-center__value');
    if (cv) cv.textContent = '$' + total.toFixed(2);
    renderHealthScore(); renderGame(); renderKingdom(); renderPredictions(); drawDonutChart();
}

/* ── Donut Chart ── */
function drawDonutChart() {
    var cv = document.getElementById('donutChart'); if (!cv) return;
    var ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1, size = 240;
    cv.width = size * dpr; cv.height = size * dpr; cv.style.width = size + 'px'; cv.style.height = size + 'px'; ctx.scale(dpr, dpr);
    var groups = {}; subscriptions.forEach(function (s) { groups[s.category] = (groups[s.category] || 0) + s.cost; });
    var total = Object.values(groups).reduce(function (a, b) { return a + b; }, 0);
    var entries = Object.entries(groups).sort(function (a, b) { return b[1] - a[1]; });
    var cx = size / 2, cy = size / 2, oR = 105, iR = 70, prog = 0;
    (function draw() {
        prog = Math.min(prog + 0.03, 1); ctx.clearRect(0, 0, size, size); var sa = -Math.PI / 2;
        entries.forEach(function (e) { var sw = (e[1] / total) * Math.PI * 2 * prog, ea = sa + sw; ctx.beginPath(); ctx.arc(cx, cy, oR, sa, ea); ctx.arc(cx, cy, iR, ea, sa, true); ctx.closePath(); ctx.fillStyle = CATEGORY_COLORS[e[0]] || '#A0A0B8'; ctx.fill(); sa = ea; });
        if (prog < 1) requestAnimationFrame(draw);
    })();
    var leg = document.getElementById('donutLegend');
    if (leg) leg.innerHTML = entries.map(function (e) { return '<div class="legend-item"><span class="legend-dot" style="background:' + (CATEGORY_COLORS[e[0]] || '#A0A0B8') + '"></span>' + (CATEGORY_LABELS[e[0]] || e[0]) + ' - $' + e[1].toFixed(2) + '</div>'; }).join('');
}

/* ── Manage Subs ── */
function renderManage() { renderManageList(); }
function renderManageList() {
    var c = document.getElementById('manageSubList'); if (!c) return;
    c.innerHTML = subscriptions.map(function (s) {
        return '<div class="manage-item" role="listitem"><div class="sub-icon" style="background:' + s.color + '20;color:' + s.color + '">' + s.icon + '</div><div class="sub-info"><span class="sub-name">' + s.name + '</span><span class="sub-category">$' + s.cost.toFixed(2) + ' / ' + s.cycle + '</span></div><div class="manage-item__actions"><button class="btn btn--danger btn--sm" onclick="deleteSub(' + s.id + ')">Release</button></div></div>';
    }).join('');
}

/* Brand Picker */
var brandPicker = document.getElementById('brandPicker');
if (brandPicker) brandPicker.addEventListener('click', function (e) {
    var ch = e.target.closest('.brand-chip'); if (!ch) return;
    document.querySelectorAll('.brand-chip').forEach(function (c) { c.classList.remove('active'); });
    ch.classList.add('active');
    var b = BRANDS[ch.dataset.brand]; if (b && b.name) document.getElementById('subName').value = b.name;
    var btn = document.querySelector('.pokeball-visual__button');
    if (btn) { btn.style.boxShadow = '0 0 25px ' + ch.dataset.color; setTimeout(function () { btn.style.boxShadow = ''; }, 1500); }
});
document.querySelectorAll('.brand-chip').forEach(function (ch) { var ic = ch.querySelector('.brand-chip__icon'); if (ic) ic.style.background = ch.dataset.color; });

/* Pokeball Capture */
function showPokeballCapture(name) {
    var ov = document.createElement('div'); ov.className = 'pokeball-capture';
    var stars = '';
    for (var i = 0; i < 10; i++) {
        var angle = i * 36, radius = 80 + Math.random() * 40;
        var sx = Math.cos(angle * Math.PI / 180) * radius, sy = Math.sin(angle * Math.PI / 180) * radius;
        stars += '<span style="top:calc(50% + ' + sy + 'px - 12px);left:calc(50% + ' + sx + 'px - 12px);animation-delay:' + (i * 0.08) + 's">\u2728</span>';
    }
    ov.innerHTML = '<div class="pokeball-capture__glow"></div><div class="pokeball-capture__flash"></div>' +
        '<div style="position:relative;display:flex;flex-direction:column;align-items:center;z-index:2">' +
        '<div class="pokeball-lg"><div class="pokeball-visual__top"></div><div class="pokeball-visual__band" style="top:64px"></div><div class="pokeball-visual__bottom"></div><div class="pokeball-visual__button"><div class="pokeball-visual__button-inner"></div></div></div>' +
        '<div class="pokeball-stars">' + stars + '</div><div class="pokeball-text">' + name + ' captured!</div></div>';
    document.body.appendChild(ov);
    setTimeout(function () { ov.style.opacity = '0'; ov.style.transition = 'opacity .4s'; setTimeout(function () { ov.remove(); }, 400); }, 2800);
}

/* Add Form */
var addForm = document.getElementById('addSubForm');
if (addForm) addForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('subName').value.trim(), cost = parseFloat(document.getElementById('subCost').value);
    var cycle = document.getElementById('subCycle').value, cat = document.getElementById('subCategory').value, date = document.getElementById('subDate').value;
    if (!name || isNaN(cost)) return;
    var ac = document.querySelector('.brand-chip.active'), bk = ac ? ac.dataset.brand : 'custom', b = BRANDS[bk] || BRANDS.custom;
    subscriptions.push({ id: nextId++, name: name, brand: bk, cost: cost, cycle: cycle, category: cat, nextDate: date || '2026-03-15', color: ac ? ac.dataset.color : b.color, icon: name.charAt(0).toUpperCase(), notify: true, usage: Math.floor(Math.random() * 60) + 40 });
    showPokeballCapture(name); addXP(25, name + ' captured!');
    e.target.reset(); document.querySelectorAll('.brand-chip').forEach(function (c) { c.classList.remove('active'); }); renderManageList();
});

function deleteSub(id) {
    var s = subscriptions.find(function (x) { return x.id === id; });
    subscriptions = subscriptions.filter(function (x) { return x.id !== id; });
    if (s) showToast('Released!', s.name + ' freed from kingdom', 'info'); renderManageList();
}

var addQuick = document.getElementById('addSubQuick');
if (addQuick) addQuick.addEventListener('click', function () { showView('view-add'); });

/* ── Reminders ── */
function renderReminders() {
    var now = new Date('2026-03-07'), sorted = subscriptions.slice().sort(function (a, b) { return new Date(a.nextDate) - new Date(b.nextDate); });
    var c = document.getElementById('reminderTimeline'); if (!c) return;
    var wk = new Date(now); wk.setDate(wk.getDate() + 7);
    var urg = sorted.filter(function (s) { var d = new Date(s.nextDate); return d >= now && d <= wk; });
    var ban = document.getElementById('urgencyBanner');
    if (ban) { var td = urg.reduce(function (s, sub) { return s + sub.cost; }, 0); ban.querySelector('strong').textContent = urg.length + ' payment' + (urg.length !== 1 ? 's' : '') + ' due this week'; ban.querySelector('span').textContent = 'Total: $' + td.toFixed(2) + ' - Defend your treasury!'; }
    var Mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    c.innerHTML = sorted.map(function (s) {
        var d = new Date(s.nextDate), diff = Math.ceil((d - now) / 86400000), u = 'later';
        if (diff <= 3) u = 'urgent'; else if (diff <= 7) u = 'soon';
        return '<div class="reminder-card glass ' + u + '" role="listitem" tabindex="0"><div class="reminder-date"><span class="reminder-date__day">' + d.getDate() + '</span><span class="reminder-date__month">' + Mo[d.getMonth()] + '</span></div><div class="sub-icon" style="background:' + s.color + '20;color:' + s.color + '">' + s.icon + '</div><div class="reminder-info"><span class="reminder-name">' + s.name + '</span><span class="reminder-amount">$' + s.cost.toFixed(2) + ' \u00B7 ' + (diff <= 0 ? 'Today' : diff === 1 ? 'Tomorrow' : 'in ' + diff + ' days') + '</span></div><div class="reminder-actions"><button class="reminder-toggle ' + (s.notify ? 'on' : '') + '" data-id="' + s.id + '" role="switch" aria-checked="' + s.notify + '"></button><button class="btn btn--warning btn--sm">Snooze</button></div></div>';
    }).join('');
    c.querySelectorAll('.reminder-toggle').forEach(function (t) {
        t.addEventListener('click', function () { var id = parseInt(t.dataset.id), s = subscriptions.find(function (x) { return x.id === id; }); if (s) { s.notify = !s.notify; t.classList.toggle('on', s.notify); t.setAttribute('aria-checked', String(s.notify)); } });
        t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); } });
    });
}

/* ── Summary ── */
function renderSummary() { drawBarChart(); drawCatDonuts(); }
function drawBarChart() {
    var cv = document.getElementById('barChart'); if (!cv) return;
    var ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1, w = cv.parentElement.clientWidth - 48, h = 260;
    cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px'; ctx.scale(dpr, dpr);
    var mo = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], vals = [198.5, 215.3, 242.8, 255.6, 254.2, 284.97], mx = Math.max.apply(null, vals) * 1.15;
    var bW = Math.min(40, (w - 80) / mo.length - 12), gap = (w - 60) / mo.length, bY = h - 40, cH = bY - 20, p = 0;
    (function draw() {
        p = Math.min(p + 0.025, 1); ctx.clearRect(0, 0, w, h);
        for (var i = 0; i <= 4; i++) { var y = bY - (cH * i / 4); ctx.strokeStyle = 'rgba(124,58,237,.06)'; ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w - 20, y); ctx.stroke(); ctx.fillStyle = '#7A7A96'; ctx.font = '11px Inter'; ctx.textAlign = 'right'; ctx.fillText('$' + Math.round(mx * i / 4), 35, y + 4); }
        mo.forEach(function (m, i) {
            var x = 50 + i * gap, barH = (vals[i] / mx) * cH * p, y = bY - barH;
            var g = ctx.createLinearGradient(x, y, x, bY);
            if (i === mo.length - 1) { g.addColorStop(0, '#A78BFA'); g.addColorStop(1, 'rgba(124,58,237,.2)'); }
            else { g.addColorStop(0, 'rgba(244,114,182,.3)'); g.addColorStop(1, 'rgba(244,114,182,.05)'); }
            var r = 6; ctx.beginPath(); ctx.moveTo(x, bY); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.lineTo(x + bW - r, y); ctx.quadraticCurveTo(x + bW, y, x + bW, y + r); ctx.lineTo(x + bW, bY); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
            if (p >= 0.9) { ctx.fillStyle = i === mo.length - 1 ? '#A78BFA' : '#F472B6'; ctx.font = '600 11px Inter'; ctx.textAlign = 'center'; ctx.fillText('$' + vals[i].toFixed(0), x + bW / 2, y - 8); }
            ctx.fillStyle = '#A0A0B8'; ctx.font = '500 12px Inter'; ctx.fillText(m, x + bW / 2, bY + 18);
        });
        if (p < 1) requestAnimationFrame(draw);
    })();
}
function drawCatDonuts() {
    var c = document.getElementById('catGrid'); if (!c) return;
    var g = {}; subscriptions.forEach(function (s) { g[s.category] = (g[s.category] || 0) + s.cost; });
    var t = Object.values(g).reduce(function (a, b) { return a + b; }, 0);
    c.innerHTML = Object.entries(g).sort(function (a, b) { return b[1] - a[1]; }).map(function (e) {
        return '<div class="cat-item"><canvas class="cat-donut" data-cat="' + e[0] + '" data-value="' + e[1] + '" data-total="' + t + '" width="64" height="64"></canvas><span class="cat-item__name">' + (CATEGORY_LABELS[e[0]] || e[0]) + '</span><span class="cat-item__value">$' + e[1].toFixed(2) + '</span></div>';
    }).join('');
    c.querySelectorAll('.cat-donut').forEach(function (cv) {
        var ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1, sz = 64;
        cv.width = sz * dpr; cv.height = sz * dpr; cv.style.width = sz + 'px'; cv.style.height = sz + 'px'; ctx.scale(dpr, dpr);
        var cat = cv.dataset.cat, val = parseFloat(cv.dataset.value), tot = parseFloat(cv.dataset.total), pct = val / tot;
        var cx = sz / 2, cy = sz / 2, oR = 28, iR = 20, p = 0;
        (function d() {
            p = Math.min(p + 0.03, 1); ctx.clearRect(0, 0, sz, sz);
            ctx.beginPath(); ctx.arc(cx, cy, oR, 0, Math.PI * 2); ctx.arc(cx, cy, iR, Math.PI * 2, 0, true); ctx.closePath(); ctx.fillStyle = 'rgba(124,58,237,.08)'; ctx.fill();
            var sa = -Math.PI / 2, ea = sa + pct * Math.PI * 2 * p;
            ctx.beginPath(); ctx.arc(cx, cy, oR, sa, ea); ctx.arc(cx, cy, iR, ea, sa, true); ctx.closePath(); ctx.fillStyle = CATEGORY_COLORS[cat] || '#A0A0B8'; ctx.fill();
            ctx.fillStyle = '#F0F0F5'; ctx.font = '700 12px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(Math.round(pct * 100 * p) + '%', cx, cy);
            if (p < 1) requestAnimationFrame(d);
        })();
    });
}

var exportBtn = document.getElementById('exportBtn');
if (exportBtn) exportBtn.addEventListener('click', function () { showToast('Exported!', 'Treasury report saved', 'success'); });

/* ── Smart Cancellation ── */
var cancelList = document.getElementById('cancelSuggestions');
if (cancelList) {
    cancelList.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            var item = e.target.closest('.cancel-item');
            if (!item) return;
            var nameEl = item.querySelector('strong');
            var name = nameEl ? nameEl.textContent : 'Subscription';
            
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            item.style.transition = 'all 0.3s ease';
            
            setTimeout(function () {
                item.remove();
                showToast('Cancelled', name + ' has been cancelled.', 'success');
                var count = subscriptions.length;
                subscriptions = subscriptions.filter(function (s) { return s.name !== name; });
                if (subscriptions.length < count) {
                    renderDashboard();
                    renderManageList();
                    if (typeof drawBarChart === 'function') drawBarChart();
                    if (typeof drawCatDonuts === 'function') drawCatDonuts();
                }
            }, 300);
        }
    });
}

/* ── Init ── */
document.querySelectorAll('#view-dashboard .sidebar__link').forEach(bindNav);
var logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
showView('view-auth');
setTimeout(function () { suppressToasts = false; }, 2000);
