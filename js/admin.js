'use strict';

// ── Auth ──────────────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    displayUserName();
    initDashboard();
    const hash = window.location.hash.substring(1);
    if (hash) showSection(hash);
});

function checkAuthentication() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userEmail  = sessionStorage.getItem('userEmail');
    const userRole   = sessionStorage.getItem('userRole');

    if (!isLoggedIn || !userEmail) {
        window.location.href = 'login.html';
        return;
    }
    if (userRole !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
    }
}

function displayUserName() {
    const el = document.getElementById('adminUserName');
    if (el) el.textContent = sessionStorage.getItem('userEmail') || 'Administrator';
}

function adminLogout() {
    if (confirm('Are you sure you want to log out?')) {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}

window.addEventListener('pageshow', (e) => { if (e.persisted) checkAuthentication(); });

// ── Navigation ────────────────────────────────────────────────────────────────

function showSection(id) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const section = document.getElementById(`${id}-section`);
    if (section) section.classList.add('active');
    const nav = document.querySelector(`.nav-item[onclick*="'${id}'"]`);
    if (nav) nav.classList.add('active');
    window.location.hash = id;

    if (id === 'shipments')  renderShipments();
    if (id === 'quotes')     renderQuotes();
    if (id === 'customers')  renderCustomers();
    if (id === 'analytics')  renderAnalytics();
    if (id === 'settings')   loadSettings();
    if (id === 'dispatch')   { if (typeof updateStats === 'function') { updateStats(); renderDashboard(); renderDrivers(); } }
    if (id === 'tripcalc')   { if (typeof calculate === 'function') calculate(); }
}

// ── Local Storage Helpers ─────────────────────────────────────────────────────

function getData(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function genId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
function genTracking() {
    return 'KEM' + Date.now().toString().slice(-9);
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const DATA_VERSION = 'v3';

function seedIfEmpty() {
    if (localStorage.getItem('dataVersion') !== DATA_VERSION) {
        ['shipments', 'quotes', 'customers'].forEach(k => localStorage.removeItem(k));
        localStorage.setItem('dataVersion', DATA_VERSION);
    }

    const R = {
        pick: arr => arr[Math.floor(Math.random() * arr.length)],
        int:  (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        date: (daysAgo) => {
            const d = new Date();
            d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
            return d.toISOString().slice(0, 10);
        },
        phone: () => `${R.int(200,999)}-${R.int(200,999)}-${R.int(1000,9999)}`,
        weight: () => R.pick(['1,200','3,500','5,800','8,400','12,000','15,500','22,000','28,000','34,000','40,000']),
    };

    const CITIES = [
        'Atlanta, GA','New York, NY','Dallas, TX','Chicago, IL','Miami, FL',
        'Los Angeles, CA','Houston, TX','Phoenix, AZ','Seattle, WA','Denver, CO',
        'Boston, MA','Charlotte, NC','Nashville, TN','Philadelphia, PA','San Diego, CA',
        'Detroit, MI','Portland, OR','Las Vegas, NV','Memphis, TN','Columbus, OH',
        'Indianapolis, IN','Jacksonville, FL','Austin, TX','Baltimore, MD','Louisville, KY',
        'Minneapolis, MN','Kansas City, MO','Raleigh, NC','Oklahoma City, OK','Tucson, AZ',
    ];

    const COMPANIES = [
        'TechCorp Industries','Global Manufacturing','Retail Solutions LLC','Summit Distributors',
        'Apex Freight Co.','Blue Ridge Supply','Ironclad Logistics','Sunrise Distribution',
        'Pacific Rim Exports','MidWest Freight Inc.','Coastal Trading Co.','Peak Performance LLC',
        'Harbor View Supply','Delta Cargo Group','Keystone Industries','Sterling Logistics',
        'Redwood Freight','Cascade Supply Chain','Northern Tier Goods','Pinnacle Transport',
        'Allied Distributors','Crestview Shipping','Lakeshore Supply','Riverbend Freight',
        'Golden Gate Trading','Thunderbolt Logistics','Horizon Supply Co.','BlueSky Cargo',
        'Silverstone Freight','Vanguard Shipping','Crossroads Distribution','Landmark Supply',
        'Eagle Eye Logistics','Centennial Freight','Keystone Supply Group','Atlas Transport',
        'Compass Cargo','Meridian Freight','Titan Logistics','Patriot Supply LLC',
    ];

    const FIRST = ['James','Maria','Robert','Linda','Michael','Patricia','David','Jennifer',
        'William','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah',
        'Charles','Karen','Christopher','Lisa','Daniel','Nancy','Matthew','Betty',
        'Anthony','Margaret','Mark','Sandra','Donald','Ashley','Steven','Dorothy',
        'Paul','Kimberly','Andrew','Emily','Joshua','Donna','Kevin','Michelle'];

    const LAST = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis',
        'Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas',
        'Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris',
        'Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King',
        'Wright','Scott','Torres','Nguyen','Hill','Flores'];

    const SERVICES = [
        'Full Truckload (FTL)',
        'Less-Than-Truckload (LTL)',
        'Expedited',
        'Intermodal',
    ];

    const STATUSES   = ['Pending Pickup','In Transit','In Transit','In Transit','Out for Delivery','Delivered','Delivered','Delivered','Delivered','Delayed'];
    const Q_STATUSES = ['Pending','Pending','Pending','Reviewed','Approved','Approved','Rejected'];

    if (getData('shipments').length === 0) {
        const shipments = Array.from({ length: 200 }, (_, i) => {
            let origin = R.pick(CITIES);
            let dest   = R.pick(CITIES.filter(c => c !== origin));
            return {
                id:          genId(),
                tracking:    'KEM' + String(100000000 + i).slice(-9),
                customer:    R.pick(COMPANIES),
                type:        R.pick(SERVICES),
                origin,
                destination: dest,
                weight:      R.int(500, 40000),
                status:      R.pick(STATUSES),
                date:        R.date(180),
            };
        });
        setData('shipments', shipments);
    }

    if (getData('quotes').length === 0) {
        const quotes = Array.from({ length: 80 }, () => {
            const first = R.pick(FIRST), last = R.pick(LAST);
            const co    = R.pick(COMPANIES);
            const slug  = co.toLowerCase().replace(/[^a-z]/g,'').slice(0,8);
            let origin  = R.pick(CITIES);
            let dest    = R.pick(CITIES.filter(c => c !== origin));
            return {
                id:          genId(),
                date:        R.date(90),
                company:     co,
                name:        `${first} ${last}`,
                email:       `${first.toLowerCase()}.${last.toLowerCase()}@${slug}.com`,
                phone:       R.phone(),
                origin,
                destination: dest,
                service:     R.pick(SERVICES),
                weight:      R.weight(),
                status:      R.pick(Q_STATUSES),
                notes:       '',
            };
        });
        setData('quotes', quotes);
    }

    if (getData('customers').length === 0) {
        const customers = Array.from({ length: 60 }, () => {
            const first = R.pick(FIRST), last = R.pick(LAST);
            const co    = R.pick(COMPANIES);
            const slug  = co.toLowerCase().replace(/[^a-z]/g,'').slice(0,8);
            return {
                id:        genId(),
                name:      `${first} ${last}`,
                company:   co,
                email:     `${first.toLowerCase()}.${last.toLowerCase()}@${slug}.com`,
                phone:     R.phone(),
                shipments: R.int(1, 45),
                joined:    R.date(730),
            };
        });
        setData('customers', customers);
    }
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

const MTD_RATES = {
    'Full Truckload (FTL)': 0.09,
    'Less-Than-Truckload (LTL)': 0.18,
    'Expedited': 0.28,
    'Intermodal': 0.07,
};

function initDashboard() {
    seedIfEmpty();
    const shipments = getData('shipments');
    const customers = getData('customers');
    const quotes    = getData('quotes');
    const now       = new Date();
    const ms30      = 30 * 24 * 60 * 60 * 1000;
    const ms7       = 7  * 24 * 60 * 60 * 1000;

    // Active Shipments
    const active       = shipments.filter(s => s.status !== 'Delivered').length;
    const newLast7     = shipments.filter(s => (now - new Date(s.date)) <= ms7).length;
    const el1 = document.getElementById('statActiveShipments');
    if (el1) animateCount(el1, active, '', '', false);
    const ch1 = document.getElementById('statActiveChange');
    if (ch1) ch1.textContent = `${newLast7} new in the last 7 days`;

    // Revenue MTD
    const mtd = shipments.filter(s => (now - new Date(s.date)) <= ms30);
    const revenue = Math.round(mtd.reduce((sum, s) => sum + (Number(s.weight) * (MTD_RATES[s.type] || 0.1)), 0));
    const el2 = document.getElementById('statRevenue');
    if (el2) animateCount(el2, revenue, '$', '', false);
    const ch2 = document.getElementById('statRevenueChange');
    if (ch2) ch2.textContent = `From ${mtd.length} shipments this month`;

    // Total Customers
    const newCust = customers.filter(c => (now - new Date(c.joined)) <= ms30).length;
    const el3 = document.getElementById('statTotalCustomers');
    if (el3) animateCount(el3, customers.length, '', '', false);
    const ch3 = document.getElementById('statCustomersChange');
    if (ch3) ch3.textContent = `+${newCust} new this month`;

    // On-Time Delivery Rate
    const delivered = shipments.filter(s => s.status === 'Delivered').length;
    const rate = shipments.length ? Math.round((delivered / shipments.length) * 1000) / 10 : 0;
    const el4 = document.getElementById('statOnTime');
    if (el4) animateCount(el4, rate, '', '%', true);
    const ch4 = document.getElementById('statOnTimeChange');
    if (ch4) ch4.textContent = `${delivered.toLocaleString()} of ${shipments.length.toLocaleString()} delivered`;

    renderDashboardShipments([...shipments].reverse().slice(0, 8));
    renderDashboardQuotes(quotes.filter(q => q.status === 'Pending').slice(0, 4));
}

function animateCount(el, end, prefix, suffix, isDecimal) {
    const duration = 900;
    const startTime = performance.now();
    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = isDecimal
            ? Math.round(end * ease * 10) / 10
            : Math.floor(end * ease);
        el.textContent = prefix + current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function typeLabel(type) {
    if (type.includes('FTL')) return 'FTL';
    if (type.includes('LTL')) return 'LTL';
    return type;
}

function renderDashboardShipments(shipments) {
    const tbody = document.getElementById('dashboardShipmentsBody');
    if (!tbody) return;
    if (shipments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:#7a90b0">No shipments yet.</td></tr>';
        return;
    }
    tbody.innerHTML = shipments.map(s => `
        <tr class="row-clickable" onclick="openViewShipment('${s.id}')">
            <td><strong>${s.tracking}</strong></td>
            <td>${s.customer}</td>
            <td style="font-size:0.8rem">${s.origin}<br><span style="color:#4a5c7a">→ ${s.destination}</span></td>
            <td>${typeLabel(s.type)}</td>
            <td style="font-family:'Courier New',monospace;font-size:0.82rem">${Number(s.weight).toLocaleString()} lbs</td>
            <td><span class="status-badge ${statusClass(s.status)}">${s.status}</span></td>
        </tr>`).join('');
}

function renderDashboardQuotes(quotes) {
    const el = document.getElementById('dashboardQuoteList');
    if (!el) return;
    if (quotes.length === 0) {
        el.innerHTML = '<p style="color:#7a90b0;font-size:0.85rem;padding:0.5rem 0">No pending quote requests.</p>';
        return;
    }
    el.innerHTML = quotes.map(q => `
        <div class="quote-item quote-clickable" onclick="openQuoteDetail('${q.id}')">
            <div class="quote-header">
                <strong>${q.company}</strong>
                <span class="quote-time">${q.date}</span>
            </div>
            <p>${q.service} | ${q.origin} → ${q.destination}</p>
            <p class="quote-weight">Weight: ${q.weight} lbs</p>
        </div>`).join('');
}

function openViewShipment(id) {
    const s = getData('shipments').find(x => x.id === id);
    if (!s) return;
    document.getElementById('viewShipmentContent').innerHTML = `
        <div class="shipment-detail-header">
            <div>
                <span class="tracking-label">Tracking Number</span>
                <span class="tracking-number">${s.tracking}</span>
            </div>
            <span class="status-badge ${statusClass(s.status)}" style="font-size:0.82rem;padding:0.35rem 1rem;">${s.status}</span>
        </div>
        <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Customer</span><span>${s.customer}</span></div>
            <div class="detail-item"><span class="detail-label">Service Type</span><span>${s.type}</span></div>
            <div class="detail-item"><span class="detail-label">Origin</span><span>${s.origin}</span></div>
            <div class="detail-item"><span class="detail-label">Destination</span><span>${s.destination}</span></div>
            <div class="detail-item"><span class="detail-label">Weight</span><span>${Number(s.weight).toLocaleString()} lbs</span></div>
            <div class="detail-item"><span class="detail-label">Shipment Date</span><span>${s.date}</span></div>
        </div>`;
    document.getElementById('viewShipmentEditBtn').onclick = () => {
        closeModal('viewShipmentModal');
        openEditShipment(id);
    };
    openModal('viewShipmentModal');
}

// ── Shipments ─────────────────────────────────────────────────────────────────

function renderShipments() {
    const search = (document.getElementById('shipmentSearch')?.value || '').toLowerCase();
    const filter = document.getElementById('shipmentFilter')?.value || '';
    let list = getData('shipments').filter(s => {
        const matchSearch = !search || s.tracking.toLowerCase().includes(search) || s.customer.toLowerCase().includes(search);
        const matchFilter = !filter || s.status === filter;
        return matchSearch && matchFilter;
    });
    const tbody = document.getElementById('shipmentsTableBody');
    if (!tbody) return;
    if (list.length === 0) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-medium)">No shipments found.</td></tr>'; return; }
    tbody.innerHTML = list.map(s => `
        <tr>
            <td><strong>${s.tracking}</strong></td>
            <td>${s.customer}</td>
            <td>${s.origin}</td>
            <td>${s.destination}</td>
            <td>${s.type}</td>
            <td><span class="status-badge ${statusClass(s.status)}">${s.status}</span></td>
            <td>${s.date}</td>
            <td>
                <button class="btn-icon" onclick="openEditShipment('${s.id}')" title="Edit">✏️</button>
                <button class="btn-icon danger" onclick="deleteShipment('${s.id}')" title="Delete">🗑️</button>
            </td>
        </tr>`).join('');
}

function addShipment(e) {
    e.preventDefault();
    const shipments = getData('shipments');
    shipments.unshift({
        id: genId(),
        tracking: genTracking(),
        customer: document.getElementById('sCustomer').value,
        type:     document.getElementById('sType').value,
        origin:   document.getElementById('sOrigin').value,
        destination: document.getElementById('sDestination').value,
        weight:   document.getElementById('sWeight').value || 0,
        status:   document.getElementById('sStatus').value,
        date:     new Date().toISOString().slice(0, 10),
    });
    setData('shipments', shipments);
    closeModal('addShipmentModal');
    e.target.reset();
    renderShipments();
    showToast('Shipment created successfully');
}

function openEditShipment(id) {
    const s = getData('shipments').find(x => x.id === id);
    if (!s) return;
    document.getElementById('editShipmentId').value = id;
    document.getElementById('eCustomer').value    = s.customer;
    document.getElementById('eType').value        = s.type;
    document.getElementById('eOrigin').value      = s.origin;
    document.getElementById('eDestination').value = s.destination;
    document.getElementById('eWeight').value      = s.weight;
    document.getElementById('eStatus').value      = s.status;
    openModal('editShipmentModal');
}

function saveEditShipment(e) {
    e.preventDefault();
    const id = document.getElementById('editShipmentId').value;
    const shipments = getData('shipments').map(s => s.id !== id ? s : {
        ...s,
        customer:    document.getElementById('eCustomer').value,
        type:        document.getElementById('eType').value,
        origin:      document.getElementById('eOrigin').value,
        destination: document.getElementById('eDestination').value,
        weight:      document.getElementById('eWeight').value,
        status:      document.getElementById('eStatus').value,
    });
    setData('shipments', shipments);
    closeModal('editShipmentModal');
    renderShipments();
    showToast('Shipment updated');
}

function deleteShipment(id) {
    if (!confirm('Delete this shipment?')) return;
    setData('shipments', getData('shipments').filter(s => s.id !== id));
    renderShipments();
    showToast('Shipment deleted');
}

// ── Quotes ────────────────────────────────────────────────────────────────────

function renderQuotes() {
    const search = (document.getElementById('quoteSearch')?.value || '').toLowerCase();
    const filter = document.getElementById('quoteFilter')?.value || '';
    let list = getData('quotes').filter(q => {
        const matchSearch = !search || q.company.toLowerCase().includes(search) || q.name.toLowerCase().includes(search);
        const matchFilter = !filter || q.status === filter;
        return matchSearch && matchFilter;
    });
    const tbody = document.getElementById('quotesTableBody');
    if (!tbody) return;
    if (list.length === 0) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-medium)">No quote requests found.</td></tr>'; return; }
    tbody.innerHTML = list.map(q => `
        <tr>
            <td>${q.date}</td>
            <td><strong>${q.company}</strong></td>
            <td>${q.name}</td>
            <td>${q.origin} → ${q.destination}</td>
            <td>${q.service}</td>
            <td>${q.weight} lbs</td>
            <td><span class="status-badge ${quoteStatusClass(q.status)}">${q.status}</span></td>
            <td>
                <button class="btn-icon" onclick="openQuoteDetail('${q.id}')" title="View">👁️</button>
                <button class="btn-icon danger" onclick="deleteQuote('${q.id}')" title="Delete">🗑️</button>
            </td>
        </tr>`).join('');
}

function openQuoteDetail(id) {
    const q = getData('quotes').find(x => x.id === id);
    if (!q) return;
    document.getElementById('quoteDetailContent').innerHTML = `
        <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Company</span><span>${q.company}</span></div>
            <div class="detail-item"><span class="detail-label">Contact</span><span>${q.name}</span></div>
            <div class="detail-item"><span class="detail-label">Email</span><span>${q.email}</span></div>
            <div class="detail-item"><span class="detail-label">Phone</span><span>${q.phone}</span></div>
            <div class="detail-item"><span class="detail-label">Origin</span><span>${q.origin}</span></div>
            <div class="detail-item"><span class="detail-label">Destination</span><span>${q.destination}</span></div>
            <div class="detail-item"><span class="detail-label">Service</span><span>${q.service}</span></div>
            <div class="detail-item"><span class="detail-label">Weight</span><span>${q.weight} lbs</span></div>
            <div class="detail-item"><span class="detail-label">Status</span><span><span class="status-badge ${quoteStatusClass(q.status)}">${q.status}</span></span></div>
            <div class="detail-item"><span class="detail-label">Date</span><span>${q.date}</span></div>
            ${q.notes ? `<div class="detail-item" style="grid-column:1/-1"><span class="detail-label">Notes</span><span>${q.notes}</span></div>` : ''}
        </div>`;
    document.getElementById('quoteApproveBtn').onclick = () => updateQuoteStatus(id, 'Approved');
    document.getElementById('quoteRejectBtn').onclick  = () => updateQuoteStatus(id, 'Rejected');
    openModal('quoteDetailModal');
}

function updateQuoteStatus(id, status) {
    const quotes = getData('quotes').map(q => q.id === id ? { ...q, status } : q);
    setData('quotes', quotes);
    closeModal('quoteDetailModal');
    renderQuotes();
    showToast(`Quote marked as ${status}`);
}

function deleteQuote(id) {
    if (!confirm('Delete this quote request?')) return;
    setData('quotes', getData('quotes').filter(q => q.id !== id));
    renderQuotes();
    showToast('Quote deleted');
}

// ── Customers ─────────────────────────────────────────────────────────────────

function renderCustomers() {
    const search = (document.getElementById('customerSearch')?.value || '').toLowerCase();
    let list = getData('customers').filter(c =>
        !search || c.name.toLowerCase().includes(search) ||
        (c.company || '').toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search)
    );
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;
    if (list.length === 0) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-medium)">No customers found.</td></tr>'; return; }
    tbody.innerHTML = list.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.company || '—'}</td>
            <td>${c.email}</td>
            <td>${c.phone || '—'}</td>
            <td>${c.shipments || 0}</td>
            <td>${c.joined}</td>
            <td>
                <button class="btn-icon danger" onclick="deleteCustomer('${c.id}')" title="Delete">🗑️</button>
            </td>
        </tr>`).join('');
}

function addCustomer(e) {
    e.preventDefault();
    const customers = getData('customers');
    customers.unshift({
        id:       genId(),
        name:     document.getElementById('cName').value,
        company:  document.getElementById('cCompany').value,
        email:    document.getElementById('cEmail').value,
        phone:    document.getElementById('cPhone').value,
        shipments: 0,
        joined:   new Date().toISOString().slice(0, 10),
    });
    setData('customers', customers);
    closeModal('addCustomerModal');
    e.target.reset();
    renderCustomers();
    showToast('Customer added');
}

function deleteCustomer(id) {
    if (!confirm('Delete this customer?')) return;
    setData('customers', getData('customers').filter(c => c.id !== id));
    renderCustomers();
    showToast('Customer deleted');
}

// ── Analytics ─────────────────────────────────────────────────────────────────

function renderAnalytics() {
    const shipments = getData('shipments');
    const customers = getData('customers');
    const quotes    = getData('quotes');

    document.getElementById('analyticsTotal').textContent     = shipments.length;
    document.getElementById('analyticsDelivered').textContent = shipments.filter(s => s.status === 'Delivered').length;
    document.getElementById('analyticsInTransit').textContent = shipments.filter(s => s.status === 'In Transit').length;
    document.getElementById('analyticsCustomers').textContent = customers.length;

    const statusCounts = {};
    shipments.forEach(s => { statusCounts[s.status] = (statusCounts[s.status] || 0) + 1; });
    renderBarChart('statusChart', statusCounts);
    renderDonutChart('shipmentDonut', 'donutLegend', 'donutTotal', statusCounts);

    const quoteCounts = {};
    quotes.forEach(q => { quoteCounts[q.status] = (quoteCounts[q.status] || 0) + 1; });
    renderBarChart('quoteChart', quoteCounts);

    const serviceCounts = {};
    shipments.forEach(s => {
        const key = s.type.replace('Full Truckload (FTL)', 'FTL').replace('Less-Than-Truckload (LTL)', 'LTL');
        serviceCounts[key] = (serviceCounts[key] || 0) + 1;
    });
    renderDonutChart('serviceMixDonut', 'serviceMixLegend', 'serviceMixTotal', serviceCounts,
        ['#00d4ff', '#00ff88', '#ff9900', '#a855f7']);

    renderTrendChart(shipments.length);

    const delivered = shipments.filter(s => s.status === 'Delivered').length;
    const rate = shipments.length ? Math.round((delivered / shipments.length) * 1000) / 10 : 98.4;
    renderGaugeChart('deliveryGauge', Math.min(rate, 100));

    const actCount = document.getElementById('activityCount');
    if (actCount) actCount.textContent = `${Math.min(shipments.length, 8)} EVENTS`;
    renderActivityFeed([...shipments].reverse().slice(0, 8));
}

function renderBarChart(containerId, data) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const max = Math.max(...Object.values(data), 1);
    const colors = { 'Delivered': '#00ff88', 'In Transit': '#00d4ff', 'Pending Pickup': '#ff9900', 'Out for Delivery': '#a855f7', 'Delayed': '#ff3366', 'Pending': '#ff9900', 'Reviewed': '#00d4ff', 'Approved': '#00ff88', 'Rejected': '#ff3366' };
    el.innerHTML = Object.entries(data).map(([label, count]) => `
        <div class="bar-row">
            <span class="bar-label">${label}</span>
            <div class="bar-track">
                <div class="bar-fill" style="width:${(count/max)*100}%;background:${colors[label]||'#00d4ff'}"></div>
            </div>
            <span class="bar-count">${count}</span>
        </div>`).join('');
}

function renderActivityFeed(shipments) {
    const el = document.getElementById('activityFeed');
    if (!el) return;
    if (shipments.length === 0) { el.innerHTML = '<p style="color:var(--text-medium)">No activity yet.</p>'; return; }
    el.innerHTML = shipments.map(s => `
        <div class="activity-item">
            <span class="activity-dot" style="background:${s.status==='Delivered'?'#00ff88':s.status==='In Transit'?'#00d4ff':s.status==='Delayed'?'#ff3366':'#ff9900'}"></span>
            <div>
                <strong>${s.tracking}</strong> — ${s.customer}
                <span class="status-badge ${statusClass(s.status)}" style="margin-left:.5rem">${s.status}</span>
            </div>
            <span class="activity-date">${s.date}</span>
        </div>`).join('');
}

// ── SVG Chart Helpers ─────────────────────────────────────────────────────────

function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
}

function renderDonutChart(svgId, legendId, totalId, data, colors) {
    colors = colors || ['#00d4ff', '#00ff88', '#ff9900', '#a855f7', '#ff3366', '#fbbf24'];
    const svg = document.getElementById(svgId);
    if (!svg) return;
    const cx = 80, cy = 80, r = 56, sw = 18;
    const circ = 2 * Math.PI * r;
    const entries = Object.entries(data);
    const total = entries.reduce((s, [, v]) => s + v, 0) || 1;

    svg.innerHTML = '';
    svg.appendChild(svgEl('circle', { cx, cy, r, fill: 'none', stroke: '#1a2540', 'stroke-width': sw }));

    let rotation = -90;
    entries.forEach(([, count], i) => {
        const frac = count / total;
        const arcLen = Math.max(frac * circ - circ * 0.018, 2);
        const circle = svgEl('circle', {
            cx, cy, r, fill: 'none',
            stroke: colors[i % colors.length],
            'stroke-width': sw,
            'stroke-dasharray': `${arcLen} ${circ}`,
            'stroke-linecap': 'round'
        });
        circle.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);
        circle.style.filter = `drop-shadow(0 0 4px ${colors[i % colors.length]}88)`;
        svg.appendChild(circle);
        rotation += frac * 360;
    });

    if (totalId) { const el = document.getElementById(totalId); if (el) el.textContent = total; }
    if (legendId) {
        const el = document.getElementById(legendId);
        if (el) el.innerHTML = entries.map(([label, count], i) => `
            <div class="legend-item">
                <span class="legend-dot" style="background:${colors[i%colors.length]};box-shadow:0 0 4px ${colors[i%colors.length]}"></span>
                <span>${label}</span>
                <span class="legend-count">${count}</span>
            </div>`).join('');
    }
}

function renderTrendChart(currentTotal) {
    const svg = document.getElementById('trendLineChart');
    const labelsEl = document.getElementById('trendLabels');
    if (!svg) return;
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const seed = [14, 21, 17, 25, 19, currentTotal || 5];
    if (labelsEl) labelsEl.innerHTML = months.map(m => `<span>${m}</span>`).join('');
    const W = 400, H = 150, padX = 16, padY = 24;
    const max = Math.max(...seed, 1) * 1.25;
    const pts = seed.map((v, i) => ({
        x: padX + (i / (seed.length - 1)) * (W - 2 * padX),
        y: H - padY - (v / max) * (H - 2 * padY)
    }));
    svg.innerHTML = '';
    const defs = svgEl('defs', {});
    defs.innerHTML = `<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00d4ff" stop-opacity="0.25"/><stop offset="100%" stop-color="#00d4ff" stop-opacity="0.01"/></linearGradient>`;
    svg.appendChild(defs);
    [0.25, 0.5, 0.75].forEach(p => {
        const y = H - padY - p * (H - 2 * padY);
        svg.appendChild(svgEl('line', { x1: padX, y1: y, x2: W - padX, y2: y, stroke: '#1a2e50', 'stroke-width': 1 }));
    });
    const areaD = `M ${pts[0].x} ${H - padY} ${pts.map(p => `L ${p.x} ${p.y}`).join(' ')} L ${pts[pts.length-1].x} ${H - padY} Z`;
    svg.appendChild(svgEl('path', { d: areaD, fill: 'url(#areaGrad)', stroke: 'none' }));
    let lineD = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const cx1 = (pts[i-1].x + pts[i].x) / 2;
        lineD += ` C ${cx1} ${pts[i-1].y}, ${cx1} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
    }
    const linePath = svgEl('path', { d: lineD, fill: 'none', stroke: '#00d4ff', 'stroke-width': 2.5, 'stroke-linecap': 'round' });
    linePath.style.filter = 'drop-shadow(0 0 5px #00d4ff)';
    svg.appendChild(linePath);
    pts.forEach((p, i) => {
        svg.appendChild(svgEl('circle', { cx: p.x, cy: p.y, r: 5, fill: '#0a1128', stroke: '#00d4ff', 'stroke-width': 2 }));
        const dot = svgEl('circle', { cx: p.x, cy: p.y, r: 2, fill: '#00d4ff' });
        dot.style.filter = 'drop-shadow(0 0 3px #00d4ff)';
        svg.appendChild(dot);
        const lbl = svgEl('text', { x: p.x, y: p.y - 9, 'text-anchor': 'middle', fill: '#6b80a0', 'font-size': 9, 'font-family': 'monospace' });
        lbl.textContent = seed[i];
        svg.appendChild(lbl);
    });
}

function renderGaugeChart(svgId, percent) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    const cx = 100, cy = 105, r = 72, SWEEP = 240, START = 150;
    svg.innerHTML = '';
    const defs = svgEl('defs', {});
    defs.innerHTML = `<linearGradient id="gaugeGrad" gradientUnits="userSpaceOnUse" x1="${cx-r}" y1="${cy}" x2="${cx+r}" y2="${cy}"><stop offset="0%" stop-color="#ff3366"/><stop offset="40%" stop-color="#ff9900"/><stop offset="100%" stop-color="#00ff88"/></linearGradient>`;
    svg.appendChild(defs);
    function pToC(cx, cy, r, deg) { const rad = deg * Math.PI / 180; return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }; }
    function makeArc(sa, sw) {
        const s = pToC(cx, cy, r, sa), e = pToC(cx, cy, r, sa + sw);
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${sw > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
    }
    svg.appendChild(Object.assign(svgEl('path', { d: makeArc(START, SWEEP), fill: 'none', stroke: '#1a2540', 'stroke-width': 14, 'stroke-linecap': 'round' })));
    if (percent > 0) {
        const fill = svgEl('path', { d: makeArc(START, (percent / 100) * SWEEP), fill: 'none', stroke: 'url(#gaugeGrad)', 'stroke-width': 14, 'stroke-linecap': 'round' });
        fill.style.filter = 'drop-shadow(0 0 8px #00ff88)';
        svg.appendChild(fill);
    }
    [0, 0.25, 0.5, 0.75, 1].forEach(p => {
        const deg = START + p * SWEEP;
        const inner = pToC(cx, cy, r - 12, deg), outer = pToC(cx, cy, r + 2, deg);
        svg.appendChild(svgEl('line', { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, stroke: '#2a3f60', 'stroke-width': 1.5 }));
    });
    const val = svgEl('text', { x: cx, y: cy - 10, 'text-anchor': 'middle', fill: '#00ff88', 'font-size': 26, 'font-weight': 800, 'font-family': 'monospace' });
    val.textContent = percent + '%';
    val.style.filter = 'drop-shadow(0 0 10px #00ff88)';
    svg.appendChild(val);
    const sub = svgEl('text', { x: cx, y: cy + 8, 'text-anchor': 'middle', fill: '#4a5c7a', 'font-size': 8 });
    sub.textContent = 'ON-TIME RATE';
    svg.appendChild(sub);
}

// ── Settings ──────────────────────────────────────────────────────────────────

function loadSettings() {
    const s = getData('companySettings')[0] || {};
    if (s.name)    document.getElementById('settingCompanyName').value = s.name;
    if (s.phone)   document.getElementById('settingPhone').value       = s.phone;
    if (s.email)   document.getElementById('settingEmail').value       = s.email;
    if (s.address) document.getElementById('settingAddress').value     = s.address;
}

function saveCompanySettings(e) {
    e.preventDefault();
    setData('companySettings', [{ name: document.getElementById('settingCompanyName').value, phone: document.getElementById('settingPhone').value, email: document.getElementById('settingEmail').value, address: document.getElementById('settingAddress').value }]);
    showToast('Company settings saved');
}

function changePassword(e) {
    e.preventDefault();
    const current  = document.getElementById('currentPassword').value;
    const next     = document.getElementById('newPassword').value;
    const confirm  = document.getElementById('confirmPassword').value;
    const stored   = localStorage.getItem('adminPassword') || 'KEM@2025';
    const msg      = document.getElementById('passwordMsg');
    if (current !== stored) { msg.textContent = 'Current password is incorrect.'; msg.className = 'settings-msg error'; return; }
    if (next.length < 6)    { msg.textContent = 'New password must be at least 6 characters.'; msg.className = 'settings-msg error'; return; }
    if (next !== confirm)   { msg.textContent = 'Passwords do not match.'; msg.className = 'settings-msg error'; return; }
    localStorage.setItem('adminPassword', next);
    msg.textContent = 'Password updated successfully.';
    msg.className   = 'settings-msg success';
    e.target.reset();
}

function exportData() {
    const data = { shipments: getData('shipments'), quotes: getData('quotes'), customers: getData('customers') };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `kem-data-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
}

function clearAllData() {
    if (!confirm('This will delete ALL shipments, quotes, and customers. Are you sure?')) return;
    ['shipments','quotes','customers','companySettings','dataVersion'].forEach(k => localStorage.removeItem(k));
    showToast('All data cleared');
    initDashboard();
}

// ── Modal Helpers ─────────────────────────────────────────────────────────────

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeModalOutside(e, id) { if (e.target.id === id) closeModal(id); }

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Status Helpers ────────────────────────────────────────────────────────────

function statusClass(status) {
    const map = { 'In Transit': 'in-transit', 'Delivered': 'delivered', 'Pending Pickup': 'pending', 'Out for Delivery': 'out-delivery', 'Delayed': 'delayed' };
    return map[status] || 'pending';
}
function quoteStatusClass(status) {
    const map = { 'Pending': 'pending', 'Reviewed': 'in-transit', 'Approved': 'delivered', 'Rejected': 'delayed' };
    return map[status] || 'pending';
}
