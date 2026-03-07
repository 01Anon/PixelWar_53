/* ═══════════════════════════════════════════════════════════════
   SubSync — Application Logic
   Subscription Expense Management Platform
   ═══════════════════════════════════════════════════════════════ */

// ── Constants ──
const BRANDS = {
    netflix:  { name: 'Netflix',  color: '#E50914', icon: 'N', category: 'entertainment', building: '🎬 Cinema Tower' },
    spotify:  { name: 'Spotify',  color: '#1DB954', icon: 'S', category: 'music', building: '🎵 Music Hall' },
    youtube:  { name: 'YouTube Premium', color: '#FF0000', icon: 'Y', category: 'entertainment', building: '📺 Video Palace' },
    adobe:    { name: 'Adobe CC', color: '#FF0000', icon: 'A', category: 'productivity', building: '🏗️ Creator Forge' },
    figma:    { name: 'Figma',    color: '#A259FF', icon: 'F', category: 'productivity', building: '🎨 Design Studio' },
    github:   { name: 'GitHub Pro', color: '#8B5CF6', icon: 'G', category: 'productivity', building: '⚔️ Code Armory' },
    icloud:   { name: 'iCloud+',  color: '#3B82F6', icon: 'i', category: 'cloud', building: '☁️ Cloud Castle' },
    custom:   { name: '',         color: '#00FFAB', icon: '+', category: 'other', building: '🏰 Custom Keep' },
};

const CATEGORY_COLORS = {
    entertainment: '#E50914', productivity: '#A259FF', cloud: '#3B82F6',
    music: '#1DB954', news: '#FF9F43', fitness: '#00FFAB', other: '#8892A0',
};
const CATEGORY_LABELS = {
    entertainment: '🎬 Entertainment', productivity: '⚡ Productivity', cloud: '☁️ Cloud & Storage',
    music: '🎵 Music', news: '📰 News & Media', fitness: '💪 Fitness', other: '📦 Other',
};
const BUILDING_MAP = {
    netflix: '🎬', spotify: '🎵', youtube: '📺', adobe: '🏗️', figma: '🎨',
    github: '⚔️', icloud: '☁️', custom: '🏰',
};

// ── Subscription Data ──
let subscriptions = [
    { id:1, name:'Netflix', brand:'netflix', cost:15.99, cycle:'monthly', category:'entertainment', nextDate:'2026-03-10', color:'#E50914', icon:'N', notify:true },
    { id:2, name:'Spotify', brand:'spotify', cost:9.99, cycle:'monthly', category:'music', nextDate:'2026-03-12', color:'#1DB954', icon:'S', notify:true },
    { id:3, name:'YouTube Premium', brand:'youtube', cost:13.99, cycle:'monthly', category:'entertainment', nextDate:'2026-03-08', color:'#FF0000', icon:'Y', notify:true },
    { id:4, name:'Adobe CC', brand:'adobe', cost:54.99, cycle:'monthly', category:'productivity', nextDate:'2026-03-15', color:'#FF0000', icon:'A', notify:true },
    { id:5, name:'Figma', brand:'figma', cost:12.00, cycle:'monthly', category:'productivity', nextDate:'2026-03-20', color:'#A259FF', icon:'F', notify:true },
    { id:6, name:'GitHub Pro', brand:'github', cost:4.00, cycle:'monthly', category:'productivity', nextDate:'2026-03-22', color:'#8B5CF6', icon:'G', notify:false },
    { id:7, name:'iCloud+ 200GB', brand:'icloud', cost:2.99, cycle:'monthly', category:'cloud', nextDate:'2026-03-25', color:'#3B82F6', icon:'i', notify:true },
    { id:8, name:'ChatGPT Plus', brand:'custom', cost:20.00, cycle:'monthly', category:'productivity', nextDate:'2026-03-18', color:'#10A37F', icon:'C', notify:true },
    { id:9, name:'Apple Music', brand:'custom', cost:10.99, cycle:'monthly', category:'music', nextDate:'2026-03-28', color:'#FC3C44', icon:'A', notify:false },
    { id:10, name:'Notion', brand:'custom', cost:8.00, cycle:'monthly', category:'productivity', nextDate:'2026-03-14', color:'#000000', icon:'N', notify:true },
    { id:11, name:'Disney+', brand:'custom', cost:7.99, cycle:'monthly', category:'entertainment', nextDate:'2026-03-30', color:'#113CCF', icon:'D', notify:true },
    { id:12, name:'AWS', brand:'custom', cost:124.04, cycle:'monthly', category:'cloud', nextDate:'2026-04-01', color:'#FF9900', icon:'A', notify:true },
];
let nextId = 13;

// ── Gamification State ──
const LEVEL_TITLES = ['Newbie','Coin Counter','Budget Rookie','Sub Tracker','Budget Warrior','Expense Knight','Savings Wizard','Finance Lord','Treasure Master','Sub Overlord'];
const BADGES_DEF = [
    { id:'early_bird', name:'Early Bird', icon:'🐦', desc:'Check reminders 3 times', condition: g => g.remindersChecked >= 3 },
    { id:'budget_master', name:'Budget Master', icon:'👑', desc:'Stay under budget', condition: g => g.underBudget },
    { id:'streak_3', name:'Hot Streak', icon:'🔥', desc:'3 day streak', condition: g => g.streak >= 3 },
    { id:'streak_7', name:'On Fire', icon:'💫', desc:'7 day streak', condition: g => g.streak >= 7 },
    { id:'collector', name:'Collector', icon:'📦', desc:'Track 10+ subs', condition: () => subscriptions.length >= 10 },
    { id:'penny_pincher', name:'Penny Pincher', icon:'💰', desc:'Save $50+', condition: g => g.totalSaved >= 50 },
    { id:'organized', name:'Organized', icon:'📋', desc:'Use all categories', condition: () => { const cats = new Set(subscriptions.map(s => s.category)); return cats.size >= 4; }},
    { id:'explorer', name:'Explorer', icon:'🗺️', desc:'Visit all screens', condition: g => g.screensVisited >= 4 },
];

let gameState = {
    xp: 650, level: 5, streak: 7, lastActive: '2026-03-06',
    badges: ['early_bird','streak_3','streak_7','collector','organized'],
    remindersChecked: 5, underBudget: true, totalSaved: 34.99, screensVisited: 4,
    budget: 400
};

// ── Insight Data ──
const INSIGHTS = [
    { text:'Your entertainment spending is <strong>23% higher</strong> than last month. Consider reviewing unused streaming services.', action:'View Details →' },
    { text:'<strong>Spotify + Apple Music</strong> detected! You could save <strong>$10.99/mo</strong> by consolidating music services.', action:'See Savings →' },
    { text:'You\'re in the top <strong>15%</strong> of SubSync users for tracking habits! 🏆 Keep up the great work.', action:'View Stats →' },
];
let currentInsight = 0;

// ──────────────────────────────────────────────
// TOAST NOTIFICATION SYSTEM
// ──────────────────────────────────────────────
function showToast(title, message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    const icons = { success:'✅', error:'❌', info:'ℹ️', achievement:'🏆' };
    toast.innerHTML = `
        <span class="toast__icon">${icons[type] || '📌'}</span>
        <div class="toast__body">
            <span class="toast__title">${title}</span>
            <span class="toast__message">${message}</span>
        </div>
        <div class="toast__progress" style="animation:toastProgress ${duration}ms linear forwards;"></div>`;
    container.appendChild(toast);
    // Add progress animation
    const style = document.createElement('style');
    style.textContent = `@keyframes toastProgress{from{width:100%;}to{width:0%;}}`;
    if (!document.querySelector('[data-toast-style]')) { style.setAttribute('data-toast-style',''); document.head.appendChild(style); }
    setTimeout(() => { toast.classList.add('toast--removing'); setTimeout(() => toast.remove(), 300); }, duration);
}

// ──────────────────────────────────────────────
// ANIMATED COUNTER
// ──────────────────────────────────────────────
function animateCounter(el, target, duration = 1200, prefix = '', suffix = '') {
    const start = 0;
    const startTime = performance.now();
    const isFloat = String(target).includes('.') || target % 1 !== 0;
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * eased;
        el.textContent = prefix + (isFloat ? current.toFixed(2) : Math.round(current)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ──────────────────────────────────────────────
// PARTICLE SYSTEM (Auth Screen)
// ──────────────────────────────────────────────
let particleAnimId = null;
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w; this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5;
            this.r = Math.random() * 2 + 0.5; this.alpha = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
        draw() {
            ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,255,171,${this.alpha})`; ctx.fill();
        }
    }
    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0,255,171,${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5; ctx.stroke();
                }
            }
        }
        particleAnimId = requestAnimationFrame(animate);
    }
    animate();
}

function stopParticles() {
    if (particleAnimId) { cancelAnimationFrame(particleAnimId); particleAnimId = null; }
}

// ──────────────────────────────────────────────
// GAMIFICATION ENGINE
// ──────────────────────────────────────────────
function addXP(amount, reason) {
    gameState.xp += amount;
    const xpForNext = getXPForLevel(gameState.level + 1);
    if (gameState.xp >= xpForNext) {
        gameState.level++;
        gameState.xp -= xpForNext;
        showToast('Level Up! 🎉', `You reached Level ${gameState.level}: ${LEVEL_TITLES[gameState.level - 1] || 'Legend'}`, 'achievement', 4000);
    } else {
        showToast(`+${amount} XP`, reason, 'success', 2000);
    }
    checkBadges();
    renderGamification();
}

function getXPForLevel(level) { return level * 200; }

function checkBadges() {
    BADGES_DEF.forEach(badge => {
        if (!gameState.badges.includes(badge.id) && badge.condition(gameState)) {
            gameState.badges.push(badge.id);
            showToast('Badge Unlocked! 🏆', `${badge.icon} ${badge.name}: ${badge.desc}`, 'achievement', 4500);
        }
    });
}

function renderGamification() {
    const xpForNext = getXPForLevel(gameState.level + 1);
    const pct = Math.min((gameState.xp / xpForNext) * 100, 100);
    // Main panel
    const levelNum = document.getElementById('levelNum');
    const levelTitle = document.getElementById('levelTitle');
    const xpFill = document.getElementById('xpBarFill');
    const xpText = document.getElementById('xpText');
    if (levelNum) levelNum.textContent = gameState.level;
    if (levelTitle) levelTitle.textContent = LEVEL_TITLES[gameState.level - 1] || 'Legend';
    if (xpFill) xpFill.style.width = pct + '%';
    if (xpText) xpText.textContent = `${gameState.xp} / ${xpForNext} XP`;
    // Streak
    const streakCount = document.getElementById('streakCount');
    if (streakCount) streakCount.textContent = gameState.streak;
    // Sidebar
    const sLvl = document.getElementById('sidebarLevel');
    const sXpFill = document.getElementById('sidebarXpFill');
    const sXpText = document.getElementById('sidebarXpText');
    const sStreak = document.getElementById('sidebarStreakNum');
    if (sLvl) sLvl.textContent = gameState.level;
    if (sXpFill) sXpFill.style.width = pct + '%';
    if (sXpText) sXpText.textContent = `${gameState.xp} / ${xpForNext} XP`;
    if (sStreak) sStreak.textContent = gameState.streak;
    // Badges
    const badgeGrid = document.getElementById('badgeGrid');
    if (badgeGrid) {
        badgeGrid.innerHTML = BADGES_DEF.map(b => {
            const unlocked = gameState.badges.includes(b.id);
            return `<div class="badge-item ${unlocked ? 'badge-item--unlocked' : 'badge-item--locked'}" title="${b.desc}">
                <span class="badge-item__icon">${b.icon}</span>${b.name}
            </div>`;
        }).join('');
    }
}

// ──────────────────────────────────────────────
// BUDGET PROGRESS RING
// ──────────────────────────────────────────────
function renderBudgetRing() {
    const total = subscriptions.reduce((s, sub) => s + sub.cost, 0);
    const budget = gameState.budget;
    const pct = Math.min((total / budget) * 100, 100);
    const circumference = 2 * Math.PI * 52; // r=52
    const offset = circumference - (pct / 100) * circumference;
    const fill = document.getElementById('budgetRingFill');
    const pctEl = document.getElementById('budgetPct');
    const remaining = document.getElementById('budgetRemaining');
    if (fill) {
        fill.style.strokeDashoffset = offset;
        // Color based on usage
        if (pct > 90) fill.style.stroke = '#FF6B6B';
        else if (pct > 70) fill.style.stroke = '#FF9F43';
        else fill.style.stroke = '#00FFAB';
    }
    if (pctEl) animateCounter(pctEl, Math.round(pct), 1000, '', '%');
    if (remaining) remaining.textContent = `$${(budget - total).toFixed(2)} remaining`;
}

// ──────────────────────────────────────────────
// INSIGHT CAROUSEL
// ──────────────────────────────────────────────
function renderInsight() {
    const textEl = document.getElementById('insightText');
    const dots = document.querySelectorAll('.insight-dot');
    if (textEl) textEl.innerHTML = INSIGHTS[currentInsight].text;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentInsight));
}

document.getElementById('insightDots')?.addEventListener('click', e => {
    const dot = e.target.closest('.insight-dot');
    if (!dot) return;
    currentInsight = parseInt(dot.dataset.index);
    renderInsight();
});

// Auto-rotate insights
setInterval(() => {
    if (document.getElementById('view-dashboard')?.classList.contains('active')) {
        currentInsight = (currentInsight + 1) % INSIGHTS.length;
        renderInsight();
    }
}, 8000);

// ──────────────────────────────────────────────
// VIEW ROUTER
// ──────────────────────────────────────────────
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (!target) return;
    target.classList.add('active');

    if (viewId === 'view-auth') { initParticles(); }
    else { stopParticles(); }

    if (viewId !== 'view-auth') { cloneSidebars(viewId); }

    document.querySelectorAll('.sidebar__link').forEach(link => {
        link.classList.toggle('active', link.dataset.target === viewId);
        if (link.dataset.target === viewId) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });

    switch (viewId) {
        case 'view-dashboard': renderDashboard(); break;
        case 'view-add': renderManage(); break;
        case 'view-reminders': renderReminders(); addXP(15, 'Checked reminders'); break;
        case 'view-summary': renderSummary(); break;
    }
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
    } else {
        loginForm.classList.add('hidden'); signupForm.classList.remove('hidden');
        indicator.style.transform = 'translateX(100%)';
    }
});

loginForm?.addEventListener('submit', async e => { 
    e.preventDefault(); 
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
            addXP(10, 'Logged in'); 
            showView('view-dashboard'); 
            startOnboarding();
            
            // Update UI with real name and initials
            const initials = currentUser.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
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
        showToast('Error', 'Backend server offline (Port 5000)', 'danger', 3000);
    } finally {
        btn.innerHTML = originalText;
    }
});

signupForm?.addEventListener('submit', async e => { 
    e.preventDefault(); 
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
            currentUser = data.user;
            addXP(25, 'Account created!'); 
            showView('view-dashboard'); 
            startOnboarding();
            
            // Update UI with real name and initials
            const initials = currentUser.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
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
        showToast('Error', 'Backend server offline (Port 5000)', 'danger', 3000);
    } finally {
        btn.innerHTML = originalText;
    }
});

document.getElementById('biometricBtn')?.addEventListener('click', () => { showToast('Info', 'Biometrics require HTTPS', 'warning', 3000); });
// Keyboard support for biometric
document.getElementById('biometricBtn')?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showToast('Info', 'Biometrics require HTTPS', 'warning', 3000); }});

function handleLogout() { 
    currentUser = null;
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    showView('view-auth'); 
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
    renderGamification();
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

// ──────────────────────────────────────────────
// DONUT CHART
// ──────────────────────────────────────────────
function drawDonutChart() {
    const canvas = document.getElementById('donutChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 240;
    canvas.width = size * dpr; canvas.height = size * dpr;
    canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const groups = {};
    subscriptions.forEach(sub => { groups[sub.category] = (groups[sub.category] || 0) + sub.cost; });
    const total = Object.values(groups).reduce((a, b) => a + b, 0);
    const entries = Object.entries(groups).sort((a, b) => b[1] - a[1]);
    const cx = size / 2, cy = size / 2, outerR = 105, innerR = 70;

    // Animated draw
    let progress = 0;
    function drawFrame() {
        progress = Math.min(progress + 0.03, 1);
        ctx.clearRect(0, 0, size, size);
        let startAngle = -Math.PI / 2;
        entries.forEach(([cat, value]) => {
            const sweep = (value / total) * Math.PI * 2 * progress;
            const endAngle = startAngle + sweep;
            ctx.beginPath(); ctx.arc(cx, cy, outerR, startAngle, endAngle);
            ctx.arc(cx, cy, innerR, endAngle, startAngle, true); ctx.closePath();
            ctx.fillStyle = CATEGORY_COLORS[cat] || '#8892A0'; ctx.fill();
            startAngle = endAngle;
        });
        if (progress < 1) requestAnimationFrame(drawFrame);
    }
    drawFrame();

    const legend = document.getElementById('donutLegend');
    if (legend) {
        legend.innerHTML = entries.map(([cat, value]) => `
            <div class="legend-item">
                <span class="legend-dot" style="background:${CATEGORY_COLORS[cat] || '#8892A0'}"></span>
                ${CATEGORY_LABELS[cat] || cat} — $${value.toFixed(2)}
            </div>`).join('');
    }
}

// ──────────────────────────────────────────────
// MANAGE SUBSCRIPTIONS
// ──────────────────────────────────────────────
function renderManage() { renderManageList(); }

function renderManageList() {
    const container = document.getElementById('manageSubList');
    if (!container) return;
    container.innerHTML = subscriptions.map(sub => `
        <div class="manage-item" role="listitem">
            <div class="sub-icon" style="background:${sub.color}20;color:${sub.color}">${sub.icon}</div>
            <div class="sub-info">
                <span class="sub-name">${sub.name}</span>
                <span class="sub-category">$${sub.cost.toFixed(2)} / ${sub.cycle}</span>
            </div>
            <div class="manage-item__actions">
                <button class="btn btn--danger btn--sm" onclick="deleteSub(${sub.id})" aria-label="Remove ${sub.name}">Remove</button>
            </div>
        </div>`).join('');
}

// Brand Picker
document.getElementById('brandPicker')?.addEventListener('click', e => {
    const chip = e.target.closest('.brand-chip');
    if (!chip) return;
    document.querySelectorAll('.brand-chip').forEach(c => { c.classList.remove('active'); c.setAttribute('aria-selected', 'false'); });
    chip.classList.add('active'); chip.setAttribute('aria-selected', 'true');
    const brand = BRANDS[chip.dataset.brand];
    if (brand?.name) document.getElementById('subName').value = brand.name;
    chip.querySelector('.brand-chip__icon').style.background = chip.dataset.color;
});

document.querySelectorAll('.brand-chip').forEach(chip => {
    chip.querySelector('.brand-chip__icon').style.background = chip.dataset.color;
});

// Pokéball Capture Animation
function showPokeballCapture(subName) {
    const overlay = document.createElement('div');
    overlay.className = 'pokeball-capture';
    overlay.innerHTML = `
        <div>
            <div class="pokeball">
                <div class="pokeball__top"></div>
                <div class="pokeball__line"></div>
                <div class="pokeball__bottom"></div>
                <div class="pokeball__center"></div>
            </div>
            <div class="pokeball-text">${subName} captured!</div>
        </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => { overlay.style.opacity = '0'; overlay.style.transition = 'opacity .3s'; setTimeout(() => overlay.remove(), 300); }, 2000);
}

// Add subscription form
document.getElementById('addSubForm')?.addEventListener('submit', e => {
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
        id: nextId++, name, brand: brandKey, cost, cycle, category,
        nextDate: nextDate || '2026-03-15',
        color: activeChip?.dataset.color || brand.color,
        icon: name.charAt(0).toUpperCase(), notify: true,
    });

    showPokeballCapture(name);
    addXP(25, `Captured ${name}!`);
    e.target.reset();
    document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
    renderManageList();
});

function deleteSub(id) {
    const sub = subscriptions.find(s => s.id === id);
    subscriptions = subscriptions.filter(s => s.id !== id);
    if (sub) showToast('Released!', `${sub.name} has been removed`, 'info');
    renderManageList();
}

document.getElementById('addSubQuick')?.addEventListener('click', () => showView('view-add'));

// ──────────────────────────────────────────────
// REMINDERS
// ──────────────────────────────────────────────
function renderReminders() {
    const now = new Date('2026-03-07');
    const sorted = [...subscriptions].sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));
    const container = document.getElementById('reminderTimeline');
    if (!container) return;

    const weekLater = new Date(now); weekLater.setDate(weekLater.getDate() + 7);
    const urgent = sorted.filter(s => { const d = new Date(s.nextDate); return d >= now && d <= weekLater; });
    const banner = document.getElementById('urgencyBanner');
    if (banner) {
        const totalDue = urgent.reduce((s, sub) => s + sub.cost, 0);
        banner.querySelector('strong').textContent = `${urgent.length} payment${urgent.length !== 1 ? 's' : ''} due this week`;
        banner.querySelector('span').textContent = `Total: $${totalDue.toFixed(2)} — Don't miss your renewal dates!`;
    }

    container.innerHTML = sorted.map(sub => {
        const d = new Date(sub.nextDate);
        const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
        let urgency = 'later';
        if (diff <= 3) urgency = 'urgent'; else if (diff <= 7) urgency = 'soon';
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `
        <div class="reminder-card glass ${urgency}" role="listitem" tabindex="0" aria-label="${sub.name} due ${d.toLocaleDateString()}">
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
                <button class="reminder-toggle ${sub.notify ? 'on' : ''}" data-id="${sub.id}" title="Toggle notification" aria-label="Toggle notification for ${sub.name}" role="switch" aria-checked="${sub.notify}"></button>
                <button class="btn btn--warning btn--sm" aria-label="Snooze ${sub.name}">Snooze</button>
            </div>
        </div>`;
    }).join('');

    container.querySelectorAll('.reminder-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const id = parseInt(toggle.dataset.id);
            const sub = subscriptions.find(s => s.id === id);
            if (sub) { sub.notify = !sub.notify; toggle.classList.toggle('on', sub.notify); toggle.setAttribute('aria-checked', sub.notify); }
        });
        toggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }});
    });
}

// ──────────────────────────────────────────────
// MONTHLY SUMMARY
// ──────────────────────────────────────────────
function renderSummary() {
    // Animate summary counters
    document.querySelectorAll('.summary-bento .animate-counter').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const prefix = el.dataset.prefix || '';
        if (!isNaN(target)) animateCounter(el, target, 1200, prefix);
    });
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
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    const months = ['Oct','Nov','Dec','Jan','Feb','Mar'];
    const values = [198.50,215.30,242.80,255.60,254.20,284.97];
    const maxVal = Math.max(...values) * 1.15;
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
            if (progress >= 0.9) {
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

function drawCategoryMiniDonuts() {
    const container = document.getElementById('catGrid');
    if (!container) return;
    const groups = {};
    subscriptions.forEach(sub => { groups[sub.category] = (groups[sub.category] || 0) + sub.cost; });
    const total = Object.values(groups).reduce((a, b) => a + b, 0);

    container.innerHTML = Object.entries(groups).sort((a, b) => b[1] - a[1]).map(([cat, value]) => `
        <div class="cat-item" tabindex="0" aria-label="${CATEGORY_LABELS[cat] || cat}: $${value.toFixed(2)}">
            <canvas class="cat-donut" data-cat="${cat}" data-value="${value}" data-total="${total}" width="64" height="64" role="img"></canvas>
            <span class="cat-item__name">${CATEGORY_LABELS[cat] || cat}</span>
            <span class="cat-item__value">$${value.toFixed(2)}</span>
        </div>`).join('');

    container.querySelectorAll('.cat-donut').forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const size = 64;
        canvas.width = size * dpr; canvas.height = size * dpr;
        canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
        ctx.scale(dpr, dpr);
        const cat = canvas.dataset.cat, value = parseFloat(canvas.dataset.value), totalVal = parseFloat(canvas.dataset.total);
        const pct = value / totalVal;
        const cx = size / 2, cy = size / 2, outerR = 28, innerR = 20;
        // Background ring
        ctx.beginPath(); ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
        ctx.arc(cx, cy, innerR, Math.PI * 2, 0, true); ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fill();
        // Animated ring
        let p = 0;
        function drawRing() {
            p = Math.min(p + 0.03, 1);
            ctx.clearRect(0, 0, size, size);
            ctx.beginPath(); ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
            ctx.arc(cx, cy, innerR, Math.PI * 2, 0, true); ctx.closePath();
            ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fill();
            const start = -Math.PI / 2;
            const end = start + pct * Math.PI * 2 * p;
            ctx.beginPath(); ctx.arc(cx, cy, outerR, start, end);
            ctx.arc(cx, cy, innerR, end, start, true); ctx.closePath();
            ctx.fillStyle = CATEGORY_COLORS[cat] || '#8892A0'; ctx.fill();
            ctx.fillStyle = '#F0F0F0'; ctx.font = '700 12px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(Math.round(pct * 100 * p) + '%', cx, cy);
            if (p < 1) requestAnimationFrame(drawRing);
        }
        drawRing();
    });
}

document.getElementById('exportBtn')?.addEventListener('click', () => { showToast('Exported! 📄', 'Summary has been exported as PDF', 'success'); });

// ──────────────────────────────────────────────
// ONBOARDING
// ──────────────────────────────────────────────
const ONBOARDING_STEPS = [
    { target: '.topbar', title: 'Welcome to SubSync! 🚀', text: 'Your gamified subscription manager. Track expenses, earn XP, and level up your financial game!', position: 'bottom' },
    { target: '#gamificationCard', title: 'Your Progress 🎮', text: 'Earn XP for every action. Level up, maintain streaks, and unlock badges as you manage your subscriptions!', position: 'top' },
    { target: '#donutCard', title: 'Expense Breakdown 📊', text: 'Visualize where your money goes with interactive charts. Each category is color-coded for easy tracking.', position: 'left' },
    { target: '#statBudget', title: 'Budget Ring 💰', text: 'Monitor your budget in real-time. The ring changes color as you approach your limit!', position: 'bottom' },
];
let onboardingStep = 0;

function startOnboarding() {
    if (localStorage.getItem('subsync_onboarded')) return;
    onboardingStep = 0;
    showOnboardingStep();
}

function showOnboardingStep() {
    const overlay = document.getElementById('onboarding-overlay');
    if (onboardingStep >= ONBOARDING_STEPS.length) {
        overlay?.classList.add('hidden');
        localStorage.setItem('subsync_onboarded', 'true');
        showToast('Tour Complete! 🎉', 'You earned +50 XP!', 'achievement');
        addXP(50, 'Completed onboarding tour');
        return;
    }
    overlay?.classList.remove('hidden');
    const step = ONBOARDING_STEPS[onboardingStep];
    const targetEl = document.querySelector(step.target);
    const tooltip = document.getElementById('onboardingTooltip');
    const title = document.getElementById('onboardingTitle');
    const text = document.getElementById('onboardingText');
    const stepEl = document.getElementById('onboardingStep');

    if (title) title.textContent = step.title;
    if (text) text.textContent = step.text;
    if (stepEl) stepEl.textContent = `${onboardingStep + 1} / ${ONBOARDING_STEPS.length}`;

    if (targetEl && tooltip) {
        const rect = targetEl.getBoundingClientRect();
        tooltip.style.top = (rect.bottom + 16) + 'px';
        tooltip.style.left = Math.max(16, rect.left) + 'px';
    }
}

document.getElementById('onboardingNext')?.addEventListener('click', () => { onboardingStep++; showOnboardingStep(); });
document.getElementById('onboardingSkip')?.addEventListener('click', () => {
    document.getElementById('onboarding-overlay')?.classList.add('hidden');
    localStorage.setItem('subsync_onboarded', 'true');
});

// ──────────────────────────────────────────────
// NAV BINDINGS & INIT
// ──────────────────────────────────────────────
document.querySelectorAll('#view-dashboard .sidebar__link').forEach(bindNavLink);
document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);

// Keyboard navigation for insight action
document.getElementById('insightActionBtn')?.addEventListener('click', () => showView('view-summary'));

// Initialize
showView('view-auth');
