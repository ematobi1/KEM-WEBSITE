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

// ── Seed Data (first load) ────────────────────────────────────────────────────

function seedIfEmpty() {
    if (getData('shipments').length === 0) {
        setData('shipments', [
            { id: genId(), tracking: 'KEM234567890', customer: 'TechCorp Industries',   origin: 'Atlanta, GA',  destination: 'New York, NY',  type: 'Full Truckload (FTL)',       weight: 38000, status: 'In Transit',     date: '2025-04-20' },
            { id: genId(), tracking: 'KEM234567891', customer: 'Global Manufacturing',  origin: 'Dallas, TX',   destination: 'Chicago, IL',   type: 'Less-Than-Truckload (LTL)',  weight: 12000, status: 'Delivered',      date: '2025-04-18' },
            { id: genId(), tracking: 'KEM234567892', customer: 'Retail Solutions LLC',  origin: 'Miami, FL',    destination: 'Boston, MA',    type: 'Expedited',                  weight: 5500,  status: 'Pending Pickup', date: '2025-04-22' },
            { id: genId(), tracking: 'KEM234567893', customer: 'Summit Distributors',   origin: 'Phoenix, AZ',  destination: 'Seattle, WA',   type: 'Intermodal',                 weight: 22000, status: 'In Transit',     date: '2025-04-19' },
            { id: genId(), tracking: 'KEM234567894', customer: 'Apex Freight Co.',      origin: 'Denver, CO',   destination: 'Houston, TX',   type: 'Full Truckload (FTL)',       weight: 40000, status: 'Delivered',      date: '2025-04-15' },
        ]);
    }
    if (getData('quotes').length === 0) {
        setData('quotes', [
            { id: genId(), date: '2025-04-22', company: 'ABC Company Inc.',  name: 'John Smith',   email: 'john@abc.com',    phone: '404-555-0101', origin: 'Atlanta, GA',   destination: 'Los Angeles, CA', service: 'Full Truckload (FTL)',      weight: '40,000', status: 'Pending',  notes: '' },
            { id: genId(), date: '2025-04-22', company: 'XYZ Logistics',     name: 'Sara Lee',     email: 'sara@xyz.com',    phone: '713-555-0102', origin: 'Houston, TX',   destination: 'Denver, CO',      service: 'Less-Than-Truckload (LTL)', weight: '3,500',  status: 'Pending',  notes: '' },
            { id: genId(), date: '2025-04-21', company: 'Fast Ship Co.',     name: 'Mike Torres',  email: 'mike@fast.com',   phone: '305-555-0103', origin: 'Miami, FL',     destination: 'Seattle, WA',     service: 'Expedited',                 weight: '12,000', status: 'Reviewed', notes: 'Quoted $4,200' },
            { id: genId(), date: '2025-04-20', company: 'Blue Ridge Supply', name: 'Amy Chen',     email: 'amy@bluridge.com',phone: '828-555-0104', origin: 'Charlotte, NC', destination: 'Nashville, TN',   service: 'Less-Than-Truckload (LTL)', weight: '7,800',  status: 'Approved', notes: '' },
        ]);
    }
    if (getData('customers').length === 0) {
        setData('customers', [
            { id: genId(), name: 'John Smith',   company: 'ABC Company Inc.',  email: 'john@abc.com',     phone: '404-555-0101', shipments: 12, joined: '2024-09-10' },
            { id: genId(), name: 'Sara Lee',     company: 'XYZ Logistics',     email: 'sara@xyz.com',     phone: '713-555-0102', shipments: 7,  joined: '2024-11-03' },
            { id: genId(), name: 'Mike Torres',  company: 'Fast Ship Co.',     email: 'mike@fast.com',    phone: '305-555-0103', shipments: 19, joined: '2024-06-15' },
            { id: genId(), name: 'Amy Chen',     company: 'Blue Ridge Supply', email: 'amy@bluridge.com', phone: '828-555-0104', shipments: 5,  joined: '2025-01-22' },
            { id: genId(), name: 'David Park',   company: 'TechCorp Industries',email:'d.park@techcorp.com',phone:'678-555-0105',shipments: 31, joined: '2023-12-01' },
        ]);
    }
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function initDashboard() {
    seedIfEmpty();
    const shipments = getData('shipments');
    const active = shipments.filter(s => s.status !== 'Delivered').length;
    document.querySelector('#dashboard-section .stats-grid .stat-card:nth-child(1) .stat-number').textContent = active;
    document.querySelector('#dashboard-section .stats-grid .stat-card:nth-child(3) .stat-number').textContent = getData('customers').length.toLocaleString();
    renderDashboardShipments(shipments.slice(-5).reverse());
    renderDashboardQuotes(getData('quotes').filter(q => q.status === 'Pending').slice(0, 3));
}

function renderDashboardShipments(shipments) {
    const tbody = document.querySelector('#dashboard-section tbody');
    if (!tbody) return;
    tbody.innerHTML = shipments.map(s => `
        <tr>
            <td><strong>${s.tracking}</strong></td>
            <td>${s.customer}</td>
            <td>${s.origin}</td>
            <td>${s.destination}</td>
            <td><span class="status-badge ${statusClass(s.status)}">${s.status}</span></td>
        </tr>`).join('');
}

function renderDashboardQuotes(quotes) {
    const el = document.querySelector('#dashboard-section .quote-list');
    if (!el) return;
    if (quotes.length === 0) { el.innerHTML = '<p style="color:var(--text-medium)">No pending quote requests.</p>'; return; }
    el.innerHTML = quotes.map(q => `
        <div class="quote-item">
            <div class="quote-header"><strong>${q.company}</strong><span class="quote-time">${q.date}</span></div>
            <p>${q.service} | ${q.origin} → ${q.destination}</p>
            <p class="quote-weight">Weight: ${q.weight} lbs</p>
        </div>`).join('');
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

    const quoteCounts = {};
    quotes.forEach(q => { quoteCounts[q.status] = (quoteCounts[q.status] || 0) + 1; });
    renderBarChart('quoteChart', quoteCounts);

    renderActivityFeed([...shipments].reverse().slice(0, 8));
}

function renderBarChart(containerId, data) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const max = Math.max(...Object.values(data), 1);
    const colors = { 'Delivered': '#2e7d32', 'In Transit': '#1565c0', 'Pending Pickup': '#e65100', 'Out for Delivery': '#6a1b9a', 'Delayed': '#c62828', 'Pending': '#e65100', 'Reviewed': '#1565c0', 'Approved': '#2e7d32', 'Rejected': '#c62828' };
    el.innerHTML = Object.entries(data).map(([label, count]) => `
        <div class="bar-row">
            <span class="bar-label">${label}</span>
            <div class="bar-track">
                <div class="bar-fill" style="width:${(count/max)*100}%;background:${colors[label]||'var(--primary-color)'}"></div>
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
            <span class="activity-dot" style="background:${s.status==='Delivered'?'#2e7d32':s.status==='In Transit'?'#1565c0':'#e65100'}"></span>
            <div>
                <strong>${s.tracking}</strong> — ${s.customer}
                <span class="status-badge ${statusClass(s.status)}" style="margin-left:.5rem">${s.status}</span>
            </div>
            <span class="activity-date">${s.date}</span>
        </div>`).join('');
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
    ['shipments','quotes','customers','companySettings'].forEach(k => localStorage.removeItem(k));
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
