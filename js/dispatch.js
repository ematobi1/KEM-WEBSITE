'use strict';

/* ============================================================
   KEM Logistics — Dispatch Portal Logic
   All data persisted in localStorage
   ============================================================ */

const LOADS_KEY   = 'kem_loads';
const DRIVERS_KEY = 'kem_drivers';
const DOCS_KEY    = 'kem_dispatch_docs';

/* ---- Storage helpers ---- */

function getLoads()           { return JSON.parse(localStorage.getItem(LOADS_KEY)   || '[]'); }
function saveLoads(loads)     { localStorage.setItem(LOADS_KEY,   JSON.stringify(loads)); }
function getDrivers()         { return JSON.parse(localStorage.getItem(DRIVERS_KEY) || '[]'); }
function saveDrivers(drivers) { localStorage.setItem(DRIVERS_KEY, JSON.stringify(drivers)); }
function getDocs()            { return JSON.parse(localStorage.getItem(DOCS_KEY)    || '[]'); }
function saveDocs(docs)       { localStorage.setItem(DOCS_KEY,    JSON.stringify(docs)); }

/* ---- Seed default drivers ---- */

function seedDrivers() {
    if (getDrivers().length) return;
    saveDrivers([
        { id: 'DRV001', name: 'Marcus Williams', initials: 'MW', truckType: 'Dry Van',  truckNumber: 'KEM-101', status: 'Available', location: 'Atlanta, GA',    dotNumber: '3421857', mcNumber: '987654', phone: '(470) 555-0101', currentLoadId: null },
        { id: 'DRV002', name: 'Angela Davis',    initials: 'AD', truckType: 'Flatbed',   truckNumber: 'KEM-102', status: 'Available', location: 'Dallas, TX',     dotNumber: '2983741', mcNumber: '765432', phone: '(214) 555-0102', currentLoadId: null },
        { id: 'DRV003', name: 'James Torres',    initials: 'JT', truckType: 'Reefer',    truckNumber: 'KEM-103', status: 'Off Duty',  location: 'Chicago, IL',    dotNumber: '4712984', mcNumber: '543210', phone: '(312) 555-0103', currentLoadId: null },
        { id: 'DRV004', name: 'Lisa Johnson',    initials: 'LJ', truckType: 'Box Truck', truckNumber: 'KEM-201', status: 'Available', location: 'Houston, TX',    dotNumber: '5621398', mcNumber: '321098', phone: '(713) 555-0104', currentLoadId: null },
        { id: 'DRV005', name: 'Robert Kim',      initials: 'RK', truckType: 'Step Deck', truckNumber: 'KEM-104', status: 'Available', location: 'Nashville, TN',  dotNumber: '6734512', mcNumber: '210987', phone: '(615) 555-0105', currentLoadId: null },
    ]);
}

/* ---- Generate load number ---- */

function generateLoadNumber() {
    const existing = getLoads();
    const nextNum  = existing.length + 1;
    return 'KEM' + String(nextNum).padStart(4, '0');
}

/* ---- Toast notification ---- */

function showToast(msg, type) {
    let toast = document.getElementById('dispatch-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'dispatch-toast';
        toast.className = 'dispatch-toast';
        document.body.appendChild(toast);
    }
    toast.className = 'dispatch-toast' + (type === 'error' ? ' error' : '');
    toast.textContent = (type === 'error' ? '✕  ' : '✓  ') + msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3800);
}

/* ---- Modal helpers ---- */

function openModal(id)  { document.getElementById(id)?.classList.add('open');    document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); document.body.style.overflow = ''; }

/* ---- Tab switching ---- */

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels  = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('panel-' + target)?.classList.add('active');

            if (target === 'dashboard') renderDashboard();
            if (target === 'drivers')   renderDrivers();
            if (target === 'documents') renderDocuments();
        });
    });
}

/* ---- Load form ---- */

function initLoadForm() {
    const form = document.getElementById('load-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);

        const load = {
            id:                  generateLoadNumber(),
            originCity:          fd.get('origin-city')?.trim(),
            originState:         fd.get('origin-state')?.trim(),
            destCity:            fd.get('dest-city')?.trim(),
            destState:           fd.get('dest-state')?.trim(),
            pickupDate:          fd.get('pickup-date'),
            pickupTime:          fd.get('pickup-time'),
            deliveryDate:        fd.get('delivery-date'),
            deliveryTime:        fd.get('delivery-time'),
            commodity:           fd.get('commodity')?.trim(),
            weight:              fd.get('weight'),
            equipment:           fd.get('equipment'),
            dimLength:           fd.get('dim-length'),
            dimWidth:            fd.get('dim-width'),
            dimHeight:           fd.get('dim-height'),
            rateType:            fd.get('rate-type'),
            rate:                fd.get('rate'),
            hazmat:              fd.has('hazmat'),
            specialInstructions: fd.get('special-instructions')?.trim(),
            brokerName:          fd.get('broker-name')?.trim(),
            brokerContact:       fd.get('broker-contact')?.trim(),
            referenceNumber:     fd.get('reference-number')?.trim(),
            status:              'Pending',
            driverId:            null,
            driverName:          null,
            createdAt:           new Date().toISOString(),
            statusHistory: [{
                status:    'Pending',
                timestamp: new Date().toISOString(),
                location:  (fd.get('origin-city') + ', ' + fd.get('origin-state')).trim(),
                notes:     'Load submitted to board'
            }]
        };

        const loads = getLoads();
        loads.push(load);
        saveLoads(loads);
        form.reset();
        showToast('Load ' + load.id + ' submitted to board!');
        updateStats();
    });
}

/* ---- Render drivers ---- */

function renderDrivers() {
    const container = document.getElementById('drivers-container');
    if (!container) return;
    const drivers = getDrivers();

    if (!drivers.length) {
        container.innerHTML = '<div class="empty-state"><p>No drivers on roster.</p></div>';
        return;
    }

    container.innerHTML = drivers.map(d => {
        const sc = driverStatusClass(d.status);
        const availableLoads = getLoads().filter(l => l.status === 'Pending');
        const canAssign = d.status === 'Available' && availableLoads.length > 0;

        return '<div class="driver-card" data-driver-id="' + d.id + '">' +
            '<div class="driver-card-header">' +
                '<div>' +
                    '<div class="driver-name">' + esc(d.name) + '</div>' +
                    '<div class="driver-truck">' + esc(d.truckType) + ' &middot; ' + esc(d.truckNumber) + '</div>' +
                '</div>' +
                '<div class="driver-avatar">' + esc(d.initials) + '</div>' +
            '</div>' +
            '<div class="driver-details">' +
                '<div class="driver-detail-item">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
                    esc(d.location) +
                '</div>' +
                '<div class="driver-detail-item">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.88C1.59 3.83 2.28 2.91 3.28 2.73h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z"/></svg>' +
                    esc(d.phone) +
                '</div>' +
                '<div class="driver-detail-item">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' +
                    'DOT: ' + esc(d.dotNumber) + ' &middot; MC: ' + esc(d.mcNumber) +
                '</div>' +
                (d.currentLoadId ? '<div class="driver-detail-item" style="color:#ff9900"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>Load: ' + esc(d.currentLoadId) + '</div>' : '') +
            '</div>' +
            '<div class="driver-card-footer">' +
                '<span class="status-badge ' + sc + '">' + esc(d.status) + '</span>' +
                '<div style="display:flex;gap:0.4rem;flex-wrap:wrap">' +
                    (canAssign ? '<button class="btn-dispatch btn-dispatch-primary btn-dispatch-sm" onclick="openAssignFromDriverModal(\'' + d.id + '\')">Assign Load</button>' : '') +
                    '<button class="btn-dispatch btn-dispatch-secondary btn-dispatch-sm" onclick="toggleDriverStatus(\'' + d.id + '\')">' +
                        (d.status === 'Off Duty' ? 'Set Available' : 'Set Off Duty') +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

/* ---- Assign driver from driver card ---- */

let _pendingDriverId = null;
let _pendingLoadId   = null;

function openAssignFromDriverModal(driverId) {
    _pendingDriverId = driverId;
    const loads = getLoads().filter(l => l.status === 'Pending');
    const sel   = document.getElementById('assign-load-select');
    if (!sel) return;
    if (!loads.length) { showToast('No pending loads available.', 'error'); return; }
    sel.innerHTML = '<option value="">-- Select a Load --</option>' +
        loads.map(l => '<option value="' + l.id + '">' + l.id + ' — ' + esc(l.originCity) + ', ' + esc(l.originState) + ' → ' + esc(l.destCity) + ', ' + esc(l.destState) + ' (' + esc(l.equipment) + ')</option>').join('');
    openModal('assign-modal');
}

function openAssignFromLoadModal(loadId) {
    _pendingLoadId = loadId;
    const drivers = getDrivers().filter(d => d.status === 'Available');
    const sel     = document.getElementById('assign-driver-select');
    if (!sel) return;
    if (!drivers.length) { showToast('No available drivers.', 'error'); return; }
    sel.innerHTML = '<option value="">-- Select a Driver --</option>' +
        drivers.map(d => '<option value="' + d.id + '">' + esc(d.name) + ' — ' + esc(d.truckType) + ' ' + esc(d.truckNumber) + ' (' + esc(d.location) + ')</option>').join('');
    openModal('assign-driver-modal');
}

function confirmAssignFromDriver() {
    const loadId = document.getElementById('assign-load-select')?.value;
    if (!loadId || !_pendingDriverId) { showToast('Please select a load.', 'error'); return; }
    assignDriverToLoad(_pendingDriverId, loadId);
    closeModal('assign-modal');
}

function confirmAssignFromLoad() {
    const driverId = document.getElementById('assign-driver-select')?.value;
    if (!driverId || !_pendingLoadId) { showToast('Please select a driver.', 'error'); return; }
    assignDriverToLoad(driverId, _pendingLoadId);
    closeModal('assign-driver-modal');
}

function assignDriverToLoad(driverId, loadId) {
    const loads   = getLoads();
    const drivers = getDrivers();
    const load    = loads.find(l => l.id === loadId);
    const driver  = drivers.find(d => d.id === driverId);
    if (!load || !driver) return;

    load.status     = 'Dispatched';
    load.driverId   = driverId;
    load.driverName = driver.name;
    load.statusHistory.push({
        status:    'Dispatched',
        timestamp: new Date().toISOString(),
        location:  load.originCity + ', ' + load.originState,
        notes:     'Driver assigned: ' + driver.name
    });

    driver.status        = 'On Load';
    driver.currentLoadId = loadId;

    saveLoads(loads);
    saveDrivers(drivers);
    showToast(driver.name + ' assigned to ' + loadId);
    renderDrivers();
    renderDashboard();
    updateStats();
}

function toggleDriverStatus(driverId) {
    const drivers = getDrivers();
    const driver  = drivers.find(d => d.id === driverId);
    if (!driver) return;
    if (driver.status === 'On Load') { showToast('Cannot change status — driver has an active load.', 'error'); return; }
    driver.status = driver.status === 'Off Duty' ? 'Available' : 'Off Duty';
    saveDrivers(drivers);
    renderDrivers();
    updateStats();
}

/* ---- Render dashboard ---- */

let _currentFilter = 'all';

function renderDashboard(filterStatus) {
    if (filterStatus !== undefined) _currentFilter = filterStatus;
    const tbody    = document.getElementById('loads-tbody');
    const countEl  = document.getElementById('active-load-count');
    if (!tbody) return;

    let loads = getLoads();
    const allActive = loads.filter(l => l.status !== 'Delivered').length;
    if (countEl) countEl.textContent = allActive;

    if (_currentFilter !== 'all') {
        loads = loads.filter(l => l.status === statusFromFilter(_currentFilter));
    }

    loads = loads.slice().reverse();

    if (!loads.length) {
        tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state">' +
            '<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>' +
            '<p>No loads found. Submit a load from the Load Board tab.</p></div></td></tr>';
        return;
    }

    tbody.innerHTML = loads.map(l => {
        const sc   = loadStatusClass(l.status);
        const rate = l.rateType === 'per-mile'
            ? '$' + Number(l.rate).toFixed(2) + '/mi'
            : '$' + Number(l.rate).toLocaleString();
        const assignBtn = l.status === 'Pending'
            ? '<button class="btn-dispatch btn-dispatch-primary btn-dispatch-sm" onclick="openAssignFromLoadModal(\'' + l.id + '\')">Assign</button>'
            : '';

        return '<tr>' +
            '<td><span class="load-number">' + esc(l.id) + '</span></td>' +
            '<td>' + (l.driverName ? esc(l.driverName) : '<span style="color:rgba(255,255,255,0.28)">Unassigned</span>') + '</td>' +
            '<td class="route-cell"><span class="route-text">' + esc(l.originCity) + ', ' + esc(l.originState) + '</span><span class="route-arrow"> → </span><span class="route-text">' + esc(l.destCity) + ', ' + esc(l.destState) + '</span></td>' +
            '<td><span class="status-badge ' + sc + '">' + esc(l.status) + '</span></td>' +
            '<td style="font-size:0.78rem">' + formatDT(l.pickupDate, l.pickupTime) + '</td>' +
            '<td style="font-size:0.78rem">' + formatDT(l.deliveryDate, l.deliveryTime) + '</td>' +
            '<td style="font-weight:700;color:#ff9900">' + rate + '</td>' +
            '<td style="color:rgba(255,255,255,0.55)">' + esc(l.equipment || '—') + '</td>' +
            '<td><div class="td-actions">' +
                '<button class="btn-dispatch btn-dispatch-secondary btn-dispatch-sm" onclick="openStatusModal(\'' + l.id + '\')">Update</button>' +
                '<button class="btn-dispatch btn-dispatch-secondary btn-dispatch-sm" onclick="openDetailsModal(\'' + l.id + '\')">Details</button>' +
                assignBtn +
                '<button class="btn-dispatch btn-dispatch-success btn-dispatch-sm" onclick="openRateConfirmation(\'' + l.id + '\')">Rate Conf.</button>' +
            '</div></td>' +
        '</tr>';
    }).join('');
}

function statusFromFilter(f) {
    const map = { pending: 'Pending', dispatched: 'Dispatched', 'in-transit': 'In Transit', delivered: 'Delivered' };
    return map[f] || f;
}

/* ---- Status update modal ---- */

function openStatusModal(loadId) {
    const load = getLoads().find(l => l.id === loadId);
    if (!load) return;

    const titleEl    = document.getElementById('status-modal-title');
    const loadIdEl   = document.getElementById('status-load-id');
    const timelineEl = document.getElementById('status-modal-timeline');

    if (titleEl)  titleEl.textContent  = 'Update Status — ' + loadId;
    if (loadIdEl) loadIdEl.value       = loadId;

    if (timelineEl) {
        timelineEl.innerHTML = load.statusHistory.map((entry, i) => {
            const isCurrent = i === load.statusHistory.length - 1;
            return '<div class="timeline-entry">' +
                '<div class="timeline-dot ' + (isCurrent ? 'current' : '') + '"></div>' +
                '<div class="timeline-content">' +
                    '<div class="timeline-status">' + esc(entry.status) + '</div>' +
                    '<div class="timeline-time">' + new Date(entry.timestamp).toLocaleString() + '</div>' +
                    (entry.location ? '<div class="timeline-notes">📍 ' + esc(entry.location) + '</div>' : '') +
                    (entry.notes    ? '<div class="timeline-notes">' + esc(entry.notes) + '</div>' : '') +
                '</div>' +
            '</div>';
        }).join('');
    }

    openModal('status-modal');
}

function submitStatusUpdate() {
    const loadId   = document.getElementById('status-load-id')?.value;
    const newStatus= document.getElementById('new-status-select')?.value;
    const location = document.getElementById('status-location')?.value.trim();
    const notes    = document.getElementById('status-notes')?.value.trim();

    if (!newStatus) { showToast('Please select a status.', 'error'); return; }

    const loads   = getLoads();
    const drivers = getDrivers();
    const load    = loads.find(l => l.id === loadId);
    if (!load) return;

    load.status = newStatus;
    load.statusHistory.push({ status: newStatus, timestamp: new Date().toISOString(), location: location || '', notes: notes || '' });

    if (newStatus === 'Delivered' && load.driverId) {
        const driver = drivers.find(d => d.id === load.driverId);
        if (driver) {
            driver.status        = 'Available';
            driver.currentLoadId = null;
            saveDrivers(drivers);
        }
    }

    saveLoads(loads);
    closeModal('status-modal');
    renderDashboard();
    showToast('Load ' + loadId + ' updated to ' + newStatus);
    updateStats();
}

/* ---- Details modal ---- */

function openDetailsModal(loadId) {
    const load = getLoads().find(l => l.id === loadId);
    if (!load) return;
    const contentEl = document.getElementById('details-modal-content');
    const titleEl   = document.getElementById('details-modal-title');
    if (titleEl) titleEl.textContent = 'Load Details — ' + loadId;

    const rate = load.rateType === 'per-mile'
        ? '$' + load.rate + '/mile'
        : '$' + Number(load.rate).toLocaleString();

    const rows = [
        ['Load Number', '<span style="color:#ff9900;font-weight:800">' + esc(load.id) + '</span>'],
        ['Status',      '<span class="status-badge ' + loadStatusClass(load.status) + '">' + esc(load.status) + '</span>'],
        ['Origin',      esc(load.originCity) + ', ' + esc(load.originState)],
        ['Destination', esc(load.destCity)   + ', ' + esc(load.destState)],
        ['Pickup',      formatDT(load.pickupDate, load.pickupTime)],
        ['Delivery',    formatDT(load.deliveryDate, load.deliveryTime)],
        ['Commodity',   esc(load.commodity || '—')],
        ['Weight',      load.weight ? Number(load.weight).toLocaleString() + ' lbs' : '—'],
        ['Equipment',   esc(load.equipment || '—')],
        ['Dimensions',  (load.dimLength && load.dimWidth && load.dimHeight) ? load.dimLength + '" × ' + load.dimWidth + '" × ' + load.dimHeight + '"' : '—'],
        ['Rate',        '<span style="color:#ff9900;font-weight:800">' + rate + '</span>'],
        ['Driver',      esc(load.driverName || 'Unassigned')],
        ['Broker',      esc(load.brokerName || '—')],
        ['Broker Contact', esc(load.brokerContact || '—')],
        ['Reference #', esc(load.referenceNumber || '—')],
        ['Hazmat',      load.hazmat ? '⚠️ Yes' : 'No'],
    ];

    const gridHTML = rows.map(([label, val]) =>
        '<div class="rc-field"><span class="rc-field-label">' + label + '</span><span style="color:rgba(255,255,255,0.85)">' + val + '</span></div>'
    ).join('');

    const specialHTML = load.specialInstructions
        ? '<div style="margin-top:1rem;grid-column:1/-1"><span class="rc-field-label">Special Instructions</span><p style="color:rgba(255,255,255,0.7);margin-top:0.3rem;font-size:0.875rem">' + esc(load.specialInstructions) + '</p></div>'
        : '';

    const timelineHTML = load.statusHistory.map((entry, i) => {
        const isCurrent = i === load.statusHistory.length - 1;
        return '<div class="timeline-entry">' +
            '<div class="timeline-dot ' + (isCurrent ? 'current' : '') + '"></div>' +
            '<div class="timeline-content">' +
                '<div class="timeline-status">' + esc(entry.status) + '</div>' +
                '<div class="timeline-time">' + new Date(entry.timestamp).toLocaleString() + '</div>' +
                (entry.location ? '<div class="timeline-notes">📍 ' + esc(entry.location) + '</div>' : '') +
                (entry.notes    ? '<div class="timeline-notes">' + esc(entry.notes) + '</div>' : '') +
            '</div>' +
        '</div>';
    }).join('');

    if (contentEl) {
        contentEl.innerHTML =
            '<div class="rc-section">' +
                '<div class="rc-section-title">Load Information</div>' +
                '<div class="rc-grid">' + gridHTML + specialHTML + '</div>' +
            '</div>' +
            '<div class="rc-section">' +
                '<div class="rc-section-title">Status History</div>' +
                '<div class="load-timeline">' + timelineHTML + '</div>' +
            '</div>';
    }

    openModal('details-modal');
}

/* ---- Rate Confirmation ---- */

function openRateConfirmation(loadId) {
    const load   = getLoads().find(l => l.id === loadId);
    const driver = load?.driverId ? getDrivers().find(d => d.id === load.driverId) : null;
    if (!load) return;

    const titleEl = document.getElementById('rc-load-title');
    if (titleEl) titleEl.textContent = 'Rate Confirmation — ' + loadId;

    const rate  = load.rateType === 'per-mile' ? '$' + load.rate + ' per mile' : '$' + Number(load.rate).toLocaleString();
    const terms = load.rateType === 'per-mile' ? 'Rate per mile × total mileage' : 'Flat rate — as agreed';
    const dims  = (load.dimLength && load.dimWidth && load.dimHeight)
        ? load.dimLength + '" × ' + load.dimWidth + '" × ' + load.dimHeight + '"'
        : '—';

    const contentEl = document.getElementById('rc-content');
    if (!contentEl) return;

    contentEl.innerHTML =
        '<div class="rate-confirmation">' +
            '<div class="rc-header">' +
                '<div>' +
                    '<div class="rc-company-name">KEM LOGISTICS AND SOLUTIONS LLC</div>' +
                    '<div class="rc-company-sub">Freight Dispatching &amp; Logistics Coordination</div>' +
                    '<div class="rc-company-contact">Phone: (470) 836-3519<br>Email: admin.info@kemlogisticsnsolutions.com<br>MC# 123456 &nbsp;|&nbsp; DOT# 7654321</div>' +
                '</div>' +
                '<div style="text-align:right">' +
                    '<div class="rc-doc-title">Rate Confirmation</div>' +
                    '<div class="rc-load-number">Load #: ' + esc(load.id) + '</div>' +
                    '<div class="rc-load-number">Ref #: ' + esc(load.referenceNumber || 'N/A') + '</div>' +
                    '<div class="rc-load-number" style="margin-top:0.35rem">Date: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + '</div>' +
                '</div>' +
            '</div>' +

            '<div class="rc-rate-box">' +
                '<div>' +
                    '<div class="rc-rate-label">Agreed Rate</div>' +
                    '<div class="rc-rate-amount">' + rate + '</div>' +
                '</div>' +
                '<div style="text-align:right">' +
                    '<div class="rc-rate-label">Payment Terms</div>' +
                    '<div style="font-size:1rem;font-weight:700;color:#333">Net 30 / QuickPay Available</div>' +
                    '<div style="font-size:0.75rem;color:#888;margin-top:0.2rem">' + terms + '</div>' +
                '</div>' +
            '</div>' +

            '<div class="rc-section">' +
                '<div class="rc-section-title">Broker / Shipper Information</div>' +
                '<div class="rc-grid">' +
                    '<div class="rc-field"><span class="rc-field-label">Broker Name</span><span class="rc-field-value">' + esc(load.brokerName || '—') + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Contact</span><span class="rc-field-value">' + esc(load.brokerContact || '—') + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Reference Number</span><span class="rc-field-value">' + esc(load.referenceNumber || '—') + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Commodity</span><span class="rc-field-value">' + esc(load.commodity || '—') + '</span></div>' +
                '</div>' +
            '</div>' +

            '<div class="rc-section">' +
                '<div class="rc-section-title">Load Details</div>' +
                '<div class="rc-grid">' +
                    '<div class="rc-field"><span class="rc-field-label">Origin</span><span class="rc-field-value">' + esc(load.originCity) + ', ' + esc(load.originState) + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Destination</span><span class="rc-field-value">' + esc(load.destCity) + ', ' + esc(load.destState) + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Pickup Date &amp; Time</span><span class="rc-field-value">' + formatDT(load.pickupDate, load.pickupTime) + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Delivery Date &amp; Time</span><span class="rc-field-value">' + formatDT(load.deliveryDate, load.deliveryTime) + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Weight</span><span class="rc-field-value">' + (load.weight ? Number(load.weight).toLocaleString() + ' lbs' : '—') + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Equipment Type</span><span class="rc-field-value">' + esc(load.equipment || '—') + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Dimensions (L×W×H)</span><span class="rc-field-value">' + dims + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Hazmat</span><span class="rc-field-value">' + (load.hazmat ? '⚠️ YES — See Shipping Papers' : 'No') + '</span></div>' +
                '</div>' +
                (load.specialInstructions ? '<div style="margin-top:0.7rem"><span class="rc-field-label" style="font-size:0.67rem;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.07em">Special Instructions</span><p style="font-size:0.875rem;color:#333;margin-top:0.25rem">' + esc(load.specialInstructions) + '</p></div>' : '') +
            '</div>' +

            '<div class="rc-section">' +
                '<div class="rc-section-title">Carrier / Driver Information</div>' +
                '<div class="rc-grid">' +
                    '<div class="rc-field"><span class="rc-field-label">Driver Name</span><span class="rc-field-value">' + esc(driver ? driver.name : '—') + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Truck Number</span><span class="rc-field-value">' + esc(driver ? driver.truckNumber : '—') + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Equipment Type</span><span class="rc-field-value">' + esc(driver ? driver.truckType : '—') + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Driver Phone</span><span class="rc-field-value">' + esc(driver ? driver.phone : '—') + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Driver DOT #</span><span class="rc-field-value">' + esc(driver ? driver.dotNumber : '—') + '</span></div>' +
                    '<div class="rc-field"><span class="rc-field-label">Carrier MC #</span><span class="rc-field-value">' + esc(driver ? driver.mcNumber : '—') + '</span></div>' +
                '</div>' +
            '</div>' +

            '<div class="rc-signature-row">' +
                '<div class="rc-sig-field"><div class="rc-sig-line"></div><div class="rc-sig-label">Carrier Signature &amp; Date</div></div>' +
                '<div class="rc-sig-field"><div class="rc-sig-line"></div><div class="rc-sig-label">KEM Logistics Representative &amp; Date</div></div>' +
            '</div>' +

            '<div class="rc-terms"><strong>TERMS &amp; CONDITIONS:</strong> Carrier agrees to transport the described freight per the terms of this Rate Confirmation. Payment is contingent upon receipt of signed BOL and POD. Carrier must maintain minimum liability insurance of $1,000,000 and cargo insurance of $100,000. Detention beyond 2 hours must be documented and pre-approved by KEM Logistics. TONU requires 2-hour advance notice. Driver must call KEM dispatch at (470) 836-3519 upon pickup and delivery.</div>' +
        '</div>';

    openModal('rc-modal');
}

/* ---- Documents ---- */

function renderDocuments() {
    const listEl = document.getElementById('doc-list');
    if (!listEl) return;
    const docs = getDocs();
    if (!docs.length) {
        listEl.innerHTML = '<p style="color:rgba(255,255,255,0.3);font-size:0.875rem;text-align:center;padding:1rem 0">No documents uploaded yet.</p>';
        return;
    }
    listEl.innerHTML = docs.map(doc =>
        '<div class="doc-item">' +
            '<div class="doc-item-icon">' + docIcon(doc.mimeType) + '</div>' +
            '<div class="doc-item-info">' +
                '<div class="doc-item-name">' + esc(doc.name) + '</div>' +
                '<div class="doc-item-meta">' + esc(doc.docType) + ' &nbsp;·&nbsp; ' + esc(doc.size) + ' &nbsp;·&nbsp; ' + new Date(doc.uploadedAt).toLocaleDateString() + '</div>' +
            '</div>' +
            '<div class="doc-item-actions">' +
                '<button class="btn-dispatch btn-dispatch-danger btn-dispatch-sm" onclick="removeDoc(\'' + doc.id + '\')">Remove</button>' +
            '</div>' +
        '</div>'
    ).join('');
}

function docIcon(mimeType) {
    if (!mimeType) return '📎';
    if (mimeType === 'application/pdf')             return '📄';
    if (mimeType.startsWith('image/'))              return '🖼️';
    if (mimeType.includes('word'))                  return '📝';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    return '📎';
}

function initDocUploads() {
    document.querySelectorAll('.doc-upload-input').forEach(input => {
        input.addEventListener('change', e => {
            const file    = e.target.files[0];
            if (!file) return;
            const docType = input.dataset.docType;
            const card    = input.closest('.doc-upload-card');
            const docs    = getDocs();
            docs.push({
                id:         Date.now().toString(),
                name:       file.name,
                mimeType:   file.type,
                size:       fmtFileSize(file.size),
                docType:    docType,
                uploadedAt: new Date().toISOString()
            });
            saveDocs(docs);
            card.classList.add('has-file');
            const labelEl = card.querySelector('.doc-upload-label');
            if (labelEl) labelEl.textContent = '✓ ' + docType;
            showToast(docType + ' uploaded!');
            renderDocuments();
        });
    });
}

function removeDoc(id) {
    saveDocs(getDocs().filter(d => d.id !== id));
    renderDocuments();
    showToast('Document removed.');
}

/* ---- Stats update ---- */

function updateStats() {
    const loads   = getLoads();
    const drivers = getDrivers();
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('stat-active-loads',       loads.filter(l => l.status !== 'Delivered').length);
    set('stat-available-drivers',  drivers.filter(d => d.status === 'Available').length);
    set('stat-delivered',          loads.filter(l => l.status === 'Delivered').length);
    set('stat-on-load',            drivers.filter(d => d.status === 'On Load').length);
}

/* ---- Dashboard filters ---- */

function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderDashboard(btn.dataset.filter);
        });
    });
}

/* ---- Utility: status CSS classes ---- */

function loadStatusClass(status) {
    const m = { Pending: 'status-pending', Dispatched: 'status-dispatched', 'In Transit': 'status-in-transit', Delivered: 'status-delivered' };
    return m[status] || 'status-pending';
}

function driverStatusClass(status) {
    const m = { Available: 'status-available', 'On Load': 'status-on-load', 'Off Duty': 'status-off-duty' };
    return m[status] || 'status-off-duty';
}

/* ---- Utility: format date/time ---- */

function formatDT(date, time) {
    if (!date) return '—';
    const d = new Date(date + 'T' + (time || '00:00'));
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return time ? dateStr + ' ' + fmtTime(time) : dateStr;
}

function fmtTime(t) {
    if (!t) return '';
    const [hStr, mStr] = t.split(':');
    let h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + mStr + ' ' + ampm;
}

function fmtFileSize(bytes) {
    if (bytes < 1024)           return bytes + ' B';
    if (bytes < 1024 * 1024)    return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/* ---- Utility: HTML escape ---- */

function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/* ---- Init ---- */

document.addEventListener('DOMContentLoaded', () => {
    seedDrivers();
    initTabs();
    initLoadForm();
    initFilters();
    initDocUploads();
    updateStats();

    /* Wire modal close buttons */
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = btn.closest('.modal-overlay');
            if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
        });
    });

    /* Close on backdrop click */
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
        });
    });

    /* Assignment confirm buttons */
    document.getElementById('confirm-assign-driver-btn')?.addEventListener('click', confirmAssignFromDriver);
    document.getElementById('confirm-assign-load-btn')?.addEventListener('click', confirmAssignFromLoad);
    document.getElementById('submit-status-update-btn')?.addEventListener('click', submitStatusUpdate);

    /* Rate confirmation actions */
    document.getElementById('print-rc-btn')?.addEventListener('click', () => window.print());
    document.getElementById('download-rc-btn')?.addEventListener('click', () => {
        showToast('Use your browser\'s Print → Save as PDF to download.');
        window.print();
    });
});
