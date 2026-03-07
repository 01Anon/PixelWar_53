/* ═══════════════════════════════════════════════════════════════
   SubSync v2 — Application Logic
   Subscription Expense Management Platform
   ═══════════════════════════════════════════════════════════════ */

const BRANDS = {
    netflix: { name: 'Netflix', color: '#E50914', icon: 'N', category: 'entertainment', building: '🎬', buildingName: 'Cinema Tower' },
    spotify: { name: 'Spotify', color: '#1DB954', icon: 'S', category: 'music', building: '🎵', buildingName: 'Music Hall' },
    youtube: { name: 'YouTube Premium', color: '#FF0000', icon: 'Y', category: 'entertainment', building: '📺', buildingName: 'Video Palace' },
    adobe: { name: 'Adobe CC', color: '#FF0000', icon: 'A', category: 'productivity', building: '🏗️', buildingName: 'Creator Forge' },
    figma: { name: 'Figma', color: '#A259FF', icon: 'F', category: 'productivity', building: '🎨', buildingName: 'Design Studio' },
    github: { name: 'GitHub Pro', color: '#8B5CF6', icon: 'G', category: 'productivity', building: '⚔️', buildingName: 'Code Armory' },
    icloud: { name: 'iCloud+', color: '#3B82F6', icon: 'i', category: 'cloud', building: '☁️', buildingName: 'Cloud Castle' },
    custom: { name: '', color: '#7C3AED', icon: '+', category: 'other', building: '🏰', buildingName: 'Custom Keep' },
};
const CATEGORY_COLORS = { entertainment: '#E50914', productivity: '#A259FF', cloud: '#3B82F6', music: '#1DB954', news: '#F59E0B', fitness: '#22D3EE', other: '#8B8BA3' };
const CATEGORY_LABELS = { entertainment: '🎬 Entertainment', productivity: '⚡ Productivity', cloud: '☁️ Cloud & Storage', music: '🎵 Music', news: '📰 News & Media', fitness: '💪 Fitness', other: '📦 Other' };

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

// ── Gamification ──
const LEVEL_TITLES = ['Newbie', 'Coin Counter', 'Budget Rookie', 'Sub Tracker', 'Budget Warrior', 'Expense Knight', 'Savings Wizard', 'Finance Lord', 'Treasure Master', 'Sub Overlord'];
const BADGES = [
    { id: 'early_bird', name: 'Early Bird', icon: '🐦', desc: 'Check reminders 3x', cond: g => g.remChecked >= 3 },
    { id: 'budget_master', name: 'Budget King', icon: '👑', desc: 'Stay under budget', cond: g => g.underBudget },
    { id: 'streak_3', name: 'Hot Streak', icon: '🔥', desc: '3-day streak', cond: g => g.streak >= 3 },
    { id: 'streak_7', name: 'Inferno', icon: '💫', desc: '7-day streak', cond: g => g.streak >= 7 },
    { id: 'collector', name: 'Collector', icon: '📦', desc: 'Track 10+ subs', cond: () => subscriptions.length >= 10 },
    { id: 'penny', name: 'Penny Pincher', icon: '💰', desc: 'Save $50+', cond: g => g.saved >= 50 },
    { id: 'organized', name: 'Organized', icon: '📋', desc: '4+ categories', cond: () => new Set(subscriptions.map(s => s.category)).size >= 4 },
    { id: 'explorer', name: 'Explorer', icon: '🗺️', desc: 'Visit all screens', cond: g => g.screens >= 5 },
];

let GS = { xp: 650, level: 5, streak: 7, badges: ['early_bird', 'streak_3', 'streak_7', 'collector', 'organized'], remChecked: 5, underBudget: true, saved: 34.99, screens: 5, budget: 400 };

// ── Toast ──
function showToast(title, msg, type = 'info', dur = 3500) {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    const icons = { success: '✅', error: '❌', info: '💬', achievement: '🏆' };
    t.innerHTML = `<span class="toast__icon">${icons[type] || '📌'}</span><div class="toast__body"><span class="toast__title">${title}</span><span class="toast__message">${msg}</span></div><div class="toast__progress" style="animation:toastProg ${dur}ms linear forwards"></div>`;
    c.appendChild(t);
    if (!document.querySelector('[data-tp]')) { const s = document.createElement('style'); s.setAttribute('data-tp', ''); s.textContent = '@keyframes toastProg{from{width:100%}to{width:0%}}'; document.head.appendChild(s); }
    setTimeout(() => { t.classList.add('toast--removing'); setTimeout(() => t.remove(), 300); }, dur);
}

// ── Animated Counter ──
function animateCounter(el, target, dur = 1200, prefix = '', suffix = '') {
    const isFloat = target % 1 !== 0;
    const start = performance.now();
    (function upd(now) {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (isFloat ? (target * e).toFixed(2) : Math.round(target * e)) + suffix;
        if (p < 1) requestAnimationFrame(upd);
    })(start);
}

// ── Particles ──
let pAnim = null;
function initParticles() {
    const cv = document.getElementById('particleCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let w, h, pts = [];
    function resize() { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    class P {
        constructor() { this.x = Math.random() * w; this.y = Math.random() * h; this.vx = (Math.random() - .5) * .4; this.vy = (Math.random() - .5) * .4; this.r = Math.random() * 2 + .5; this.a = Math.random() * .3 + .1; }
        update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > w) this.vx *= -1; if (this.y < 0 || this.y > h) this.vy *= -1; }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(124,58,237,${this.a})`; ctx.fill(); }
    }
    for (let i = 0; i < 50; i++)pts.push(new P());
    (function go() {
        ctx.clearRect(0, 0, w, h); pts.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < pts.length; i++)for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
            if (d < 130) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(124,58,237,${.05 * (1 - d / 130)})`; ctx.lineWidth = .5; ctx.stroke(); }
        }
        pAnim = requestAnimationFrame(go);
    })();
}
function stopParticles() { if (pAnim) { cancelAnimationFrame(pAnim); pAnim = null; } }

// ── Avatar Expressions ──
function setAvatarMood(mood) {
    const mouth = document.getElementById('avatarMouth');
    if (!mouth) return;
    mouth.className = 'auth-avatar__mouth auth-avatar__mouth--' + mood;
}

// ── Gamification ──
function addXP(amt, reason) {
    GS.xp += amt;
    const need = (GS.level + 1) * 200;
    if (GS.xp >= need) { GS.level++; GS.xp -= need; showToast('Level Up! 🎉', `Level ${GS.level}: ${LEVEL_TITLES[GS.level - 1] || 'Legend'}`, 'achievement', 4000); }
    else showToast(`+${amt} XP`, reason, 'success', 2000);
    checkBadges(); renderGame();
}
function checkBadges() { BADGES.forEach(b => { if (!GS.badges.includes(b.id) && b.cond(GS)) { GS.badges.push(b.id); showToast('Badge Unlocked!', `${b.icon} ${b.name}`, 'achievement', 4500); } }); }
function renderGame() {
    const need = (GS.level + 1) * 200, pct = Math.min(GS.xp / need * 100, 100);
    const $ = id => document.getElementById(id);
    if ($('levelNum')) $('levelNum').textContent = GS.level;
    if ($('levelTitle')) $('levelTitle').textContent = LEVEL_TITLES[GS.level - 1] || 'Legend';
    if ($('xpBarFill')) $('xpBarFill').style.width = pct + '%';
    if ($('xpText')) $('xpText').textContent = `${GS.xp} / ${need} XP`;
    if ($('streakCount')) $('streakCount').textContent = GS.streak;
    if ($('sidebarLevel')) $('sidebarLevel').textContent = GS.level;
    if ($('sidebarXpFill')) $('sidebarXpFill').style.width = pct + '%';
    if ($('sidebarXpText')) $('sidebarXpText').textContent = `${GS.xp} / ${need} XP`;
    if ($('sidebarStreakNum')) $('sidebarStreakNum').textContent = GS.streak;
    const bg = $('badgeGrid');
    if (bg) bg.innerHTML = BADGES.map(b => `<div class="badge-item ${GS.badges.includes(b.id) ? 'badge-item--unlocked' : 'badge-item--locked'}" title="${b.desc}"><span class="badge-item__icon">${b.icon}</span>${b.name}</div>`).join('');
}

// ── Health Score ──
function renderHealthScore() {
    const avgUsage = subscriptions.reduce((s, sub) => s + (sub.usage || 50), 0) / subscriptions.length;
    const score = Math.round(avgUsage);
    const circ = 2 * Math.PI * 58;
    const offset = circ - (score / 100) * circ;
    const fill = document.getElementById('healthRingFill');
    const scoreEl = document.getElementById('healthScore');
    const hint = document.getElementById('healthHint');
    if (fill) { fill.style.strokeDashoffset = offset; fill.style.stroke = score > 70 ? 'url(#healthGradGood)' : score > 40 ? '#F59E0B' : '#EF4444'; }
    if (scoreEl) animateCounter(scoreEl, score, 1000);
    const lowUsage = subscriptions.filter(s => (s.usage || 50) < 30);
    if (hint) hint.textContent = lowUsage.length ? `${lowUsage.length} sub${lowUsage.length > 1 ? 's' : ''} need attention` : 'All subs healthy! 💪';
    // Add SVG gradient defs if missing
    const svg = document.querySelector('.health-ring');
    if (svg && !svg.querySelector('#healthGradGood')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = '<linearGradient id="healthGradGood" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#22D3EE"/></linearGradient>';
        svg.prepend(defs);
    }
}

// ── Kingdom Map ──
function renderKingdom() {
    const map = document.getElementById('kingdomMap');
    if (!map) return;
    map.innerHTML = subscriptions.map(sub => {
        const brand = BRANDS[sub.brand] || BRANDS.custom;
        const emoji = brand.building;
        const bName = brand.buildingName;
        const usagePct = sub.usage || 50;
        const glowColor = sub.color;
        return `<div class="kingdom-building" role="listitem" tabindex="0" title="${sub.name} — $${sub.cost.toFixed(2)}/mo — ${usagePct}% usage">
            <div class="kingdom-building__glow" style="background:${glowColor}"></div>
            <span class="kingdom-building__emoji">${emoji}</span>
            <span class="kingdom-building__name">${bName}</span>
            <span class="kingdom-building__cost">$${sub.cost.toFixed(2)}</span>
        </div>`;
    }).join('');
}

// ── AI Prediction Chart ──
function renderPredictions() {
    const cv = document.getElementById('predictCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = 300, h = 140;
    cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    const actual = [198, 215, 243, 256, 254, 285];
    const predicted = [null, null, null, null, null, 285, 299, 312, 305];
    const all = [...actual, ...predicted.slice(actual.length)];
    const max = Math.max(...all.filter(v => v !== null)) * 1.1;
    const xStep = w / (all.length - 1);

    ctx.clearRect(0, 0, w, h);
    // Actual line
    ctx.beginPath(); ctx.strokeStyle = '#A78BFA'; ctx.lineWidth = 2.5;
    actual.forEach((v, i) => { const x = i * xStep, y = h - 10 - (v / max) * (h - 20); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.stroke();
    // Predicted line (dashed)
    ctx.beginPath(); ctx.strokeStyle = '#F472B6'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
    predicted.forEach((v, i) => { if (v === null) return; const x = i * xStep, y = h - 10 - (v / max) * (h - 20); if (i === actual.length - 1 || predicted[i - 1] === null) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke(); ctx.setLineDash([]);
    // Dots
    actual.forEach((v, i) => { ctx.beginPath(); ctx.arc(i * xStep, h - 10 - (v / max) * (h - 20), 3, 0, Math.PI * 2); ctx.fillStyle = '#A78BFA'; ctx.fill(); });
    predicted.forEach((v, i) => { if (v === null || i < actual.length) return; ctx.beginPath(); ctx.arc(i * xStep, h - 10 - (v / max) * (h - 20), 3, 0, Math.PI * 2); ctx.fillStyle = '#F472B6'; ctx.fill(); });
    // Labels
    ctx.fillStyle = '#52526B'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].forEach((m, i) => { ctx.fillText(m, i * xStep, h - 1); });
}

// ── Usage Heatmap ──
function renderHeatmap() {
    const hm = document.getElementById('usageHeatmap');
    if (!hm) return;
    // 4 weeks x 7 days per sub (simplified as overall)
    const days = [];
    for (let i = 0; i < 28; i++) {
        const activity = Math.random() * 100;
        let color;
        if (activity > 80) color = 'rgba(124,58,237,0.8)';
        else if (activity > 60) color = 'rgba(124,58,237,0.5)';
        else if (activity > 30) color = 'rgba(124,58,237,0.25)';
        else color = 'rgba(124,58,237,0.08)';
        days.push(`<div class="heatmap-cell" style="background:${color}" title="Day ${i + 1}: ${Math.round(activity)}% active"></div>`);
    }
    hm.innerHTML = days.join('');
}

// ── Forecast Chart ──
function renderForecast() {
    const cv = document.getElementById('forecastChart');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = cv.parentElement.clientWidth - 48, h = 200;
    cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    const actual = [198, 215, 243, 256, 254, 285];
    const forecast = [285, 298, 312, 305, 320, 335];
    const all = [...actual, ...forecast.slice(1)];
    const max = Math.max(...all) * 1.1;
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const total = months.length;
    const xStep = (w - 60) / (total - 1);

    ctx.clearRect(0, 0, w, h);
    // Grid
    for (let i = 0; i <= 4; i++) {
        const y = h - 30 - (h - 50) * i / 4; ctx.strokeStyle = 'rgba(124,58,237,.06)'; ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w - 10, y); ctx.stroke();
        ctx.fillStyle = '#52526B'; ctx.font = '10px Inter'; ctx.textAlign = 'right'; ctx.fillText('$' + Math.round(max * i / 4), 35, y + 3);
    }
    // Actual area fill
    ctx.beginPath(); ctx.moveTo(40, h - 30);
    actual.forEach((v, i) => { ctx.lineTo(40 + i * xStep, h - 30 - (v / max) * (h - 50)); });
    ctx.lineTo(40 + (actual.length - 1) * xStep, h - 30); ctx.closePath();
    const aGrad = ctx.createLinearGradient(0, 0, 0, h); aGrad.addColorStop(0, 'rgba(124,58,237,.2)'); aGrad.addColorStop(1, 'rgba(124,58,237,0)');
    ctx.fillStyle = aGrad; ctx.fill();
    // Actual line
    ctx.beginPath(); ctx.strokeStyle = '#A78BFA'; ctx.lineWidth = 2.5;
    actual.forEach((v, i) => { const x = 40 + i * xStep, y = h - 30 - (v / max) * (h - 50); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }); ctx.stroke();
    // Forecast area
    ctx.beginPath(); ctx.moveTo(40 + (actual.length - 1) * xStep, h - 30);
    forecast.forEach((v, i) => { ctx.lineTo(40 + (actual.length - 1 + i) * xStep, h - 30 - (v / max) * (h - 50)); });
    ctx.lineTo(40 + (actual.length - 1 + forecast.length - 1) * xStep, h - 30); ctx.closePath();
    const fGrad = ctx.createLinearGradient(0, 0, 0, h); fGrad.addColorStop(0, 'rgba(244,114,182,.15)'); fGrad.addColorStop(1, 'rgba(244,114,182,0)');
    ctx.fillStyle = fGrad; ctx.fill();
    // Forecast line (dashed)
    ctx.beginPath(); ctx.strokeStyle = '#F472B6'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
    forecast.forEach((v, i) => { const x = 40 + (actual.length - 1 + i) * xStep, y = h - 30 - (v / max) * (h - 50); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }); ctx.stroke(); ctx.setLineDash([]);
    // Labels
    ctx.fillStyle = '#52526B'; ctx.font = '11px Inter'; ctx.textAlign = 'center';
    months.forEach((m, i) => { if (i < total) ctx.fillText(m, 40 + i * xStep, h - 8); });
}

// ── VIEW ROUTER ──
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const t = document.getElementById(id); if (!t) return;
    t.classList.add('active');
    id === 'view-auth' ? initParticles() : stopParticles();
    if (id !== 'view-auth') cloneSidebars(id);
    document.querySelectorAll('.sidebar__link').forEach(l => { l.classList.toggle('active', l.dataset.target === id); });
    switch (id) {
        case 'view-dashboard': renderDashboard(); break;
        case 'view-add': renderManage(); break;
        case 'view-reminders': renderReminders(); addXP(15, 'Checked battle alerts'); break;
        case 'view-insights': renderInsights(); break;
        case 'view-summary': renderSummary(); break;
    }
}
function cloneSidebars(activeId) {
    const orig = document.querySelector('#view-dashboard .sidebar');
    document.querySelectorAll('.sidebar[data-clone]').forEach(ph => {
        const cl = orig.cloneNode(true); cl.removeAttribute('id'); cl.setAttribute('data-clone', 'sidebar');
        cl.querySelectorAll('.sidebar__link').forEach(l => l.classList.toggle('active', l.dataset.target === activeId));
        ph.replaceWith(cl);
        cl.querySelectorAll('.sidebar__link').forEach(bindNav);
        const lb = cl.querySelector('#logoutBtn') || cl.querySelector('.sidebar__user .btn-icon');
        if (lb) lb.addEventListener('click', handleLogout);
    });
}
function bindNav(l) { l.addEventListener('click', e => { e.preventDefault(); showView(l.dataset.target); }); }

// ── AUTH ──
const authTabs = document.getElementById('authTabs'), loginForm = document.getElementById('loginForm'), signupForm = document.getElementById('signupForm'), indicator = document.querySelector('.auth-tab__indicator');
authTabs?.addEventListener('click', e => {
    const tab = e.target.closest('.auth-tab'); if (!tab) return;
    document.querySelectorAll('.auth-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
    if (tab.dataset.tab === 'login') { loginForm.classList.remove('hidden'); signupForm.classList.add('hidden'); indicator.style.transform = 'translateX(0)'; setAvatarMood('neutral'); }
    else { loginForm.classList.add('hidden'); signupForm.classList.remove('hidden'); indicator.style.transform = 'translateX(100%)'; setAvatarMood('happy'); }
});
// Make avatar happy on input focus
document.querySelectorAll('#loginForm input, #signupForm input').forEach(input => {
    input.addEventListener('focus', () => setAvatarMood('happy'));
    input.addEventListener('blur', () => setAvatarMood('neutral'));
});
loginForm?.addEventListener('submit', e => { e.preventDefault(); setAvatarMood('happy'); addXP(10, 'Entered the kingdom'); showView('view-dashboard'); });
signupForm?.addEventListener('submit', e => { e.preventDefault(); setAvatarMood('happy'); addXP(25, 'Kingdom created!'); showView('view-dashboard'); });
document.getElementById('biometricBtn')?.addEventListener('click', () => { setAvatarMood('happy'); addXP(10, 'Quick access'); showView('view-dashboard'); });
document.getElementById('biometricBtn')?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showView('view-dashboard'); } });
function handleLogout() { showView('view-auth'); setAvatarMood('neutral'); }

// ── DASHBOARD ──
function renderDashboard() {
    const total = subscriptions.reduce((s, sub) => s + sub.cost, 0);
    animateCounter(document.getElementById('totalSpend'), total, 1200, '$');
    animateCounter(document.getElementById('activeSubs'), subscriptions.length, 800);
    document.querySelector('.chart-center__value').textContent = '$' + total.toFixed(2);
    renderHealthScore();
    renderGame();
    renderKingdom();
    renderPredictions();
    drawDonutChart();
}

// ── DONUT CHART ──
function drawDonutChart() {
    const cv = document.getElementById('donutChart'); if (!cv) return;
    const ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1, size = 240;
    cv.width = size * dpr; cv.height = size * dpr; cv.style.width = size + 'px'; cv.style.height = size + 'px'; ctx.scale(dpr, dpr);
    const groups = {}; subscriptions.forEach(s => { groups[s.category] = (groups[s.category] || 0) + s.cost; });
    const total = Object.values(groups).reduce((a, b) => a + b, 0);
    const entries = Object.entries(groups).sort((a, b) => b[1] - a[1]);
    const cx = size / 2, cy = size / 2, oR = 105, iR = 70;
    let prog = 0;
    (function draw() {
        prog = Math.min(prog + .03, 1); ctx.clearRect(0, 0, size, size); let sa = -Math.PI / 2;
        entries.forEach(([cat, val]) => { const sw = (val / total) * Math.PI * 2 * prog, ea = sa + sw; ctx.beginPath(); ctx.arc(cx, cy, oR, sa, ea); ctx.arc(cx, cy, iR, ea, sa, true); ctx.closePath(); ctx.fillStyle = CATEGORY_COLORS[cat] || '#8B8BA3'; ctx.fill(); sa = ea; });
        if (prog < 1) requestAnimationFrame(draw);
    })();
    const leg = document.getElementById('donutLegend');
    if (leg) leg.innerHTML = entries.map(([c, v]) => `<div class="legend-item"><span class="legend-dot" style="background:${CATEGORY_COLORS[c] || '#8B8BA3'}"></span>${CATEGORY_LABELS[c] || c} — $${v.toFixed(2)}</div>`).join('');
}

// ── MANAGE ──
function renderManage() { renderManageList(); }
function renderManageList() {
    const c = document.getElementById('manageSubList'); if (!c) return;
    c.innerHTML = subscriptions.map(s => `<div class="manage-item" role="listitem"><div class="sub-icon" style="background:${s.color}20;color:${s.color}">${s.icon}</div><div class="sub-info"><span class="sub-name">${s.name}</span><span class="sub-category">$${s.cost.toFixed(2)} / ${s.cycle}</span></div><div class="manage-item__actions"><button class="btn btn--danger btn--sm" onclick="deleteSub(${s.id})">Release</button></div></div>`).join('');
}

document.getElementById('brandPicker')?.addEventListener('click', e => {
    const ch = e.target.closest('.brand-chip'); if (!ch) return;
    document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active')); ch.classList.add('active');
    const b = BRANDS[ch.dataset.brand]; if (b?.name) document.getElementById('subName').value = b.name;
    ch.querySelector('.brand-chip__icon').style.background = ch.dataset.color;
    // Animate pokeball button
    const btn = document.querySelector('.pokeball-visual__button');
    if (btn) { btn.style.boxShadow = `0 0 20px ${ch.dataset.color}`; setTimeout(() => btn.style.boxShadow = '', 1500); }
});
document.querySelectorAll('.brand-chip').forEach(ch => ch.querySelector('.brand-chip__icon').style.background = ch.dataset.color);

function showPokeballCapture(name) {
    const ov = document.createElement('div'); ov.className = 'pokeball-capture';
    const stars = Array.from({ length: 8 }, (_, i) => { const a = i * 45, r = 100; return `<span style="top:calc(50% + ${Math.sin(a * Math.PI / 180) * r}px - 12px);left:calc(50% + ${Math.cos(a * Math.PI / 180) * r}px - 12px);animation-delay:${i * .1}s">✨</span>`; }).join('');
    ov.innerHTML = `<div style="position:relative;display:flex;flex-direction:column;align-items:center"><div class="pokeball-lg"><div class="pokeball-visual__top"></div><div class="pokeball-visual__band" style="top:64px"></div><div class="pokeball-visual__bottom"></div><div class="pokeball-visual__button"><div class="pokeball-visual__button-inner"></div></div></div><div class="pokeball-stars">${stars}</div><div class="pokeball-text">${name} captured!</div></div>`;
    document.body.appendChild(ov);
    setTimeout(() => { ov.style.opacity = '0'; ov.style.transition = 'opacity .3s'; setTimeout(() => ov.remove(), 300); }, 2500);
}

document.getElementById('addSubForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('subName').value.trim(), cost = parseFloat(document.getElementById('subCost').value), cycle = document.getElementById('subCycle').value, cat = document.getElementById('subCategory').value, date = document.getElementById('subDate').value;
    if (!name || isNaN(cost)) return;
    const ac = document.querySelector('.brand-chip.active'), bk = ac?.dataset.brand || 'custom', b = BRANDS[bk] || BRANDS.custom;
    subscriptions.push({ id: nextId++, name, brand: bk, cost, cycle, category: cat, nextDate: date || '2026-03-15', color: ac?.dataset.color || b.color, icon: name.charAt(0).toUpperCase(), notify: true, usage: Math.floor(Math.random() * 60) + 40 });
    showPokeballCapture(name); addXP(25, `${name} captured!`);
    e.target.reset(); document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active')); renderManageList();
});

function deleteSub(id) { const s = subscriptions.find(x => x.id === id); subscriptions = subscriptions.filter(x => x.id !== id); if (s) showToast('Released!', `${s.name} freed from kingdom`, 'info'); renderManageList(); }

document.getElementById('addSubQuick')?.addEventListener('click', () => showView('view-add'));

// ── REMINDERS ──
function renderReminders() {
    const now = new Date('2026-03-07'), sorted = [...subscriptions].sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));
    const c = document.getElementById('reminderTimeline'); if (!c) return;
    const wk = new Date(now); wk.setDate(wk.getDate() + 7);
    const urg = sorted.filter(s => { const d = new Date(s.nextDate); return d >= now && d <= wk; });
    const ban = document.getElementById('urgencyBanner');
    if (ban) { const td = urg.reduce((s, sub) => s + sub.cost, 0); ban.querySelector('strong').textContent = `${urg.length} payment${urg.length !== 1 ? 's' : ''} due this week`; ban.querySelector('span').textContent = `Total: $${td.toFixed(2)} — Defend your treasury!`; }
    const Mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    c.innerHTML = sorted.map(s => {
        const d = new Date(s.nextDate), diff = Math.ceil((d - now) / (864e5)); let u = 'later'; if (diff <= 3) u = 'urgent'; else if (diff <= 7) u = 'soon';
        return `<div class="reminder-card glass ${u}" role="listitem" tabindex="0"><div class="reminder-date"><span class="reminder-date__day">${d.getDate()}</span><span class="reminder-date__month">${Mo[d.getMonth()]}</span></div><div class="sub-icon" style="background:${s.color}20;color:${s.color}">${s.icon}</div><div class="reminder-info"><span class="reminder-name">${s.name}</span><span class="reminder-amount">$${s.cost.toFixed(2)} · ${diff <= 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `in ${diff} days`}</span></div><div class="reminder-actions"><button class="reminder-toggle ${s.notify ? 'on' : ''}" data-id="${s.id}" role="switch" aria-checked="${s.notify}"></button><button class="btn btn--warning btn--sm">Snooze</button></div></div>`;
    }).join('');
    c.querySelectorAll('.reminder-toggle').forEach(t => { t.addEventListener('click', () => { const id = +t.dataset.id, s = subscriptions.find(x => x.id === id); if (s) { s.notify = !s.notify; t.classList.toggle('on', s.notify); t.setAttribute('aria-checked', s.notify); } }); t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); } }); });
}

// ── INSIGHTS ──
function renderInsights() { renderForecast(); renderHeatmap(); }

// ── SUMMARY ──
function renderSummary() { drawBarChart(); drawCatDonuts(); }
function drawBarChart() {
    const cv = document.getElementById('barChart'); if (!cv) return;
    const ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1, w = cv.parentElement.clientWidth - 48, h = 260;
    cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px'; ctx.scale(dpr, dpr);
    const mo = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], vals = [198.5, 215.3, 242.8, 255.6, 254.2, 284.97], mx = Math.max(...vals) * 1.15;
    const bW = Math.min(40, (w - 80) / mo.length - 12), gap = (w - 60) / mo.length, bY = h - 40, cH = bY - 20;
    let p = 0;
    (function draw() {
        p = Math.min(p + .025, 1); ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(124,58,237,.06)'; ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) { const y = bY - (cH * i / 4); ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w - 20, y); ctx.stroke(); ctx.fillStyle = '#52526B'; ctx.font = '11px Inter'; ctx.textAlign = 'right'; ctx.fillText('$' + Math.round(mx * i / 4), 35, y + 4); }
        mo.forEach((m, i) => {
            const x = 50 + i * gap, barH = (vals[i] / mx) * cH * p, y = bY - barH;
            const g = ctx.createLinearGradient(x, y, x, bY);
            if (i === mo.length - 1) { g.addColorStop(0, '#A78BFA'); g.addColorStop(1, 'rgba(124,58,237,.2)'); }
            else { g.addColorStop(0, 'rgba(244,114,182,.3)'); g.addColorStop(1, 'rgba(244,114,182,.05)'); }
            const r = 6; ctx.beginPath(); ctx.moveTo(x, bY); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.lineTo(x + bW - r, y); ctx.quadraticCurveTo(x + bW, y, x + bW, y + r); ctx.lineTo(x + bW, bY); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
            if (p >= .9) { ctx.fillStyle = i === mo.length - 1 ? '#A78BFA' : '#F472B6'; ctx.font = '600 11px Inter'; ctx.textAlign = 'center'; ctx.fillText('$' + vals[i].toFixed(0), x + bW / 2, y - 8); }
            ctx.fillStyle = '#8B8BA3'; ctx.font = '500 12px Inter'; ctx.fillText(m, x + bW / 2, bY + 18);
        });
        if (p < 1) requestAnimationFrame(draw);
    })();
}
function drawCatDonuts() {
    const c = document.getElementById('catGrid'); if (!c) return;
    const g = {}; subscriptions.forEach(s => { g[s.category] = (g[s.category] || 0) + s.cost; });
    const t = Object.values(g).reduce((a, b) => a + b, 0);
    c.innerHTML = Object.entries(g).sort((a, b) => b[1] - a[1]).map(([cat, v]) => `<div class="cat-item"><canvas class="cat-donut" data-cat="${cat}" data-value="${v}" data-total="${t}" width="64" height="64" role="img"></canvas><span class="cat-item__name">${CATEGORY_LABELS[cat] || cat}</span><span class="cat-item__value">$${v.toFixed(2)}</span></div>`).join('');
    c.querySelectorAll('.cat-donut').forEach(cv => {
        const ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1, sz = 64; cv.width = sz * dpr; cv.height = sz * dpr; cv.style.width = sz + 'px'; cv.style.height = sz + 'px'; ctx.scale(dpr, dpr);
        const cat = cv.dataset.cat, val = +cv.dataset.value, tot = +cv.dataset.total, pct = val / tot;
        const cx = sz / 2, cy = sz / 2, oR = 28, iR = 20;
        let p = 0; (function d() {
            p = Math.min(p + .03, 1); ctx.clearRect(0, 0, sz, sz);
            ctx.beginPath(); ctx.arc(cx, cy, oR, 0, Math.PI * 2); ctx.arc(cx, cy, iR, Math.PI * 2, 0, true); ctx.closePath(); ctx.fillStyle = 'rgba(124,58,237,.08)'; ctx.fill();
            const sa = -Math.PI / 2, ea = sa + pct * Math.PI * 2 * p; ctx.beginPath(); ctx.arc(cx, cy, oR, sa, ea); ctx.arc(cx, cy, iR, ea, sa, true); ctx.closePath(); ctx.fillStyle = CATEGORY_COLORS[cat] || '#8B8BA3'; ctx.fill();
            ctx.fillStyle = '#EEEEF0'; ctx.font = '700 12px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(Math.round(pct * 100 * p) + '%', cx, cy);
            if (p < 1) requestAnimationFrame(d);
        })();
    });
}

document.getElementById('exportBtn')?.addEventListener('click', () => showToast('Exported! 📜', 'Treasury report saved', 'success'));

// ── NAV & INIT ──
document.querySelectorAll('#view-dashboard .sidebar__link').forEach(bindNav);
document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
showView('view-auth');
