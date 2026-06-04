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
        { id: 'DRV001', name: 'Marcus Williams', initials: 'MW', truckType: 'Dry Van',  truckNumber: 'KEM-101', status: 'Available', location: 'Atlanta, GA',   dotNumber: '3421857', mcNumber: '987654', phone: '(470) 555-0101', currentLoadId: null },
        { id: 'DRV002', name: 'Angela Davis',    initials: 'AD', truckType: 'Flatbed',  truckNumber: 'KEM-102', status: 'Available', location: 'Dallas, TX',    dotNumber: '2983741', mcNumber: '765432', phone: '(214) 555-0102', currentLoadId: null },
        { id: 'DRV003', name: 'James Torres',    initials: 'JT', truckType: 'Reefer',   truckNumber: 'KEM-103', status: 'Off Duty',  location: 'Chicago, IL',   dotNumber: '4712984', mcNumber: '543210', phone: '(312) 555-0103', currentLoadId: null },
        { id: 'DRV004', name: 'Lisa Johnson',    initials: 'LJ', truckType: 'Box Truck',truckNumber: 'KEM-201', status: 'Available', location: 'Houston, TX',   dotNumber: '5621398', mcNumber: '321098', phone: '(713) 555-0104', currentLoadId: null },
        { id: 'DRV005', name: 'Robert Kim',      initials: 'RK', truckType: 'Step Deck',truckNumber: 'KEM-104', status: 'Available', location: 'Nashville, TN', dotNumber: '6734512', mcNumber: '210987', phone: '(615) 555-0105', currentLoadId: null },
    ]);
}

/* ---- Seed demo loads (only if storage is empty) ---- */

function seedDemoLoads() {
    if (getLoads().length) return;

    const now       = new Date();
    const todayStr  = now.toISOString().slice(0, 10);
    const yd        = new Date(now); yd.setDate(yd.getDate() - 1);
    const ydStr     = yd.toISOString().slice(0, 10);
    const tm        = new Date(now); tm.setDate(tm.getDate() + 1);
    const tmStr     = tm.toISOString().slice(0, 10);
    const ago = (ms) => new Date(now.getTime() - ms).toISOString();
    const todayAt   = (h, m) => { const d = new Date(now); d.setHours(h, m, 0, 0); return d.toISOString(); };

    saveLoads([
        {
            id: 'KEM0001', status: 'Pending',
            originCity: 'Atlanta',  originState: 'GA', destCity: 'Charlotte', destState: 'NC',
            pickupDate: todayStr, pickupTime: '10:00', deliveryDate: todayStr, deliveryTime: '18:00',
            commodity: 'Auto Parts', weight: '32000', equipment: 'Dry Van',
            rateType: 'flat', rate: '1850', hazmat: false, specialInstructions: '',
            brokerName: 'Echo Global Logistics', brokerContact: '(800) 354-7993', referenceNumber: 'ECH-885421',
            driverId: null, driverName: null,
            createdAt: ago(3600000),
            statusHistory: [{ status: 'Pending', timestamp: ago(3600000), location: 'Atlanta, GA', notes: 'Load submitted to board' }]
        },
        {
            id: 'KEM0002', status: 'Dispatched',
            originCity: 'Houston',  originState: 'TX', destCity: 'Nashville', destState: 'TN',
            pickupDate: todayStr, pickupTime: '12:00', deliveryDate: tmStr, deliveryTime: '08:00',
            commodity: 'Electronics', weight: '18500', equipment: 'Reefer',
            rateType: 'flat', rate: '2400', hazmat: false, specialInstructions: 'Temp: 35°F required',
            brokerName: 'Coyote Logistics', brokerContact: '(888) 264-9963', referenceNumber: 'COY-112233',
            driverId: 'DRV004', driverName: 'Lisa Johnson',
            createdAt: ago(7200000),
            statusHistory: [
                { status: 'Pending',    timestamp: ago(7200000), location: 'Houston, TX',  notes: 'Load submitted to board' },
                { status: 'Dispatched', timestamp: ago(5400000), location: 'Houston, TX',  notes: 'Driver assigned: Lisa Johnson' }
            ]
        },
        {
            id: 'KEM0003', status: 'In Transit',
            originCity: 'Dallas',   originState: 'TX', destCity: 'Chicago', destState: 'IL',
            pickupDate: ydStr,    pickupTime: '14:00', deliveryDate: tmStr, deliveryTime: '06:00',
            commodity: 'Steel Coils', weight: '44000', equipment: 'Flatbed',
            rateType: 'flat', rate: '3200', hazmat: false, specialInstructions: 'Tarps required',
            brokerName: 'C.H. Robinson', brokerContact: '(800) 323-7587', referenceNumber: 'CHR-778899',
            driverId: 'DRV002', driverName: 'Angela Davis',
            createdAt: ago(86400000),
            statusHistory: [
                { status: 'Pending',    timestamp: ago(86400000), location: 'Dallas, TX',     notes: 'Load submitted to board' },
                { status: 'Dispatched', timestamp: ago(82800000), location: 'Dallas, TX',     notes: 'Driver assigned: Angela Davis' },
                { status: 'In Transit', timestamp: ago(72000000), location: 'Oklahoma City, OK', notes: 'Picked up on time — running smooth' }
            ]
        },
        {
            id: 'KEM0004', status: 'Delivered',
            originCity: 'Memphis',  originState: 'TN', destCity: 'Atlanta', destState: 'GA',
            pickupDate: ydStr,    pickupTime: '20:00', deliveryDate: todayStr, deliveryTime: '06:00',
            commodity: 'Food Grade', weight: '38000', equipment: 'Reefer',
            rateType: 'flat', rate: '1600', hazmat: false, specialInstructions: '',
            brokerName: 'J.B. Hunt', brokerContact: '(800) 643-3622', referenceNumber: 'JBH-445566',
            driverId: 'DRV001', driverName: 'Marcus Williams',
            createdAt: ago(86400000 + 3600000),
            statusHistory: [
                { status: 'Pending',    timestamp: ago(90000000), location: 'Memphis, TN',    notes: 'Load submitted to board' },
                { status: 'Dispatched', timestamp: ago(86400000), location: 'Memphis, TN',    notes: 'Driver assigned: Marcus Williams' },
                { status: 'In Transit', timestamp: ago(79200000), location: 'Memphis, TN',    notes: 'Picked up — running on schedule' },
                { status: 'Delivered',  timestamp: todayAt(6, 15), location: 'Atlanta, GA',   notes: 'Delivered and signed — POD obtained ✓' }
            ]
        }
    ]);

    /* Update driver statuses to match demo loads */
    const drivers = getDrivers();
    const set = (id, status, loadId) => {
        const d = drivers.find(x => x.id === id);
        if (d) { d.status = status; d.currentLoadId = loadId; }
    };
    set('DRV004', 'On Load',   'KEM0002');  // Lisa — Dispatched
    set('DRV002', 'On Load',   'KEM0003');  // Angela — In Transit
    set('DRV001', 'Available', null);        // Marcus — back after delivery
    saveDrivers(drivers);
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
            if (target === 'trip')      runTripCalc();
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

function deliveredTodayCount(loads) {
    const todayStr = new Date().toISOString().slice(0, 10);
    return loads.filter(l => {
        if (l.status !== 'Delivered') return false;
        const entry = (l.statusHistory || []).slice().reverse().find(h => h.status === 'Delivered');
        return entry ? entry.timestamp.startsWith(todayStr) : false;
    }).length;
}

function updateStats() {
    const loads   = getLoads();
    const drivers = getDrivers();
    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.textContent !== String(val)) {
            el.textContent = val;
            el.classList.add('stat-bump');
            setTimeout(() => el.classList.remove('stat-bump'), 400);
        }
    };
    setText('stat-active-loads',      loads.filter(l => l.status !== 'Delivered').length);
    setText('stat-available-drivers', drivers.filter(d => d.status === 'Available').length);
    setText('stat-on-load',           drivers.filter(d => d.status === 'On Load').length);
    setText('stat-delivered',         deliveredTodayCount(loads));
}

/* ---- Make stat cards clickable — jump to filtered view ---- */

function initStatCards() {
    const map = [
        { id: 'stat-active-loads',      tab: 'dashboard', filter: 'all'       },
        { id: 'stat-available-drivers', tab: 'drivers',   filter: null         },
        { id: 'stat-on-load',           tab: 'drivers',   filter: null         },
        { id: 'stat-delivered',         tab: 'dashboard', filter: 'delivered'  },
    ];

    map.forEach(({ id, tab, filter }) => {
        const card = document.getElementById(id)?.closest('.dispatch-stat');
        if (!card) return;
        card.style.cursor = 'pointer';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.title = 'Click to view details';

        const go = () => {
            const tabBtn = document.querySelector('.tab-btn[data-tab="' + tab + '"]');
            tabBtn?.click();
            if (filter) {
                setTimeout(() => {
                    const filterBtn = document.querySelector('.filter-btn[data-filter="' + filter + '"]');
                    filterBtn?.click();
                }, 60);
            }
        };
        card.addEventListener('click', go);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
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

/* ============================================================
   AI Trip Analyzer Engine
   ============================================================ */

/* ---- City coordinate database (shared with calculator.js) ---- */
const AI_CITIES = {
    "Birmingham, AL":[33.520,-86.803],"Mobile, AL":[30.694,-88.043],"Montgomery, AL":[32.361,-86.279],
    "Phoenix, AZ":[33.448,-112.074],"Tucson, AZ":[32.254,-110.912],"Flagstaff, AZ":[35.198,-111.651],
    "Little Rock, AR":[34.746,-92.289],"Fort Smith, AR":[35.386,-94.398],
    "Los Angeles, CA":[34.052,-118.244],"San Francisco, CA":[37.774,-122.419],"San Diego, CA":[32.715,-117.157],"Sacramento, CA":[38.581,-121.494],"Fresno, CA":[36.737,-119.787],"Bakersfield, CA":[35.373,-119.019],
    "Denver, CO":[39.739,-104.984],"Colorado Springs, CO":[38.834,-104.821],
    "Hartford, CT":[41.763,-72.685],
    "Wilmington, DE":[39.744,-75.547],
    "Miami, FL":[25.775,-80.209],"Orlando, FL":[28.538,-81.381],"Tampa, FL":[27.947,-82.459],"Jacksonville, FL":[30.332,-81.656],"Fort Lauderdale, FL":[26.122,-80.143],"Tallahassee, FL":[30.437,-84.281],
    "Atlanta, GA":[33.749,-84.388],"Savannah, GA":[32.083,-81.100],"Augusta, GA":[33.471,-81.975],"Columbus, GA":[32.461,-84.987],"Macon, GA":[32.840,-83.632],
    "Boise, ID":[43.615,-116.202],
    "Chicago, IL":[41.878,-87.630],"Rockford, IL":[42.271,-89.094],"Springfield, IL":[39.798,-89.655],"Peoria, IL":[40.693,-89.589],
    "Indianapolis, IN":[39.768,-86.158],"Fort Wayne, IN":[41.130,-85.129],"Evansville, IN":[37.975,-87.556],
    "Des Moines, IA":[41.600,-93.609],"Cedar Rapids, IA":[41.977,-91.666],
    "Wichita, KS":[37.697,-97.337],"Kansas City, KS":[39.114,-94.627],
    "Louisville, KY":[38.252,-85.759],"Lexington, KY":[38.029,-84.495],
    "New Orleans, LA":[29.951,-90.072],"Baton Rouge, LA":[30.451,-91.154],"Shreveport, LA":[32.525,-93.750],
    "Baltimore, MD":[39.290,-76.612],
    "Boston, MA":[42.360,-71.058],"Worcester, MA":[42.263,-71.802],
    "Detroit, MI":[42.331,-83.046],"Grand Rapids, MI":[42.966,-85.656],"Flint, MI":[43.013,-83.688],"Lansing, MI":[42.732,-84.555],
    "Minneapolis, MN":[44.977,-93.265],"Saint Paul, MN":[44.944,-93.093],"Duluth, MN":[46.786,-92.100],
    "Jackson, MS":[32.299,-90.184],"Gulfport, MS":[30.367,-89.093],
    "Kansas City, MO":[39.099,-94.578],"Saint Louis, MO":[38.627,-90.199],"Springfield, MO":[37.215,-93.298],
    "Billings, MT":[45.783,-108.501],
    "Omaha, NE":[41.258,-95.938],"Lincoln, NE":[40.813,-96.703],
    "Las Vegas, NV":[36.175,-115.137],"Reno, NV":[39.529,-119.814],
    "Manchester, NH":[42.995,-71.461],
    "Newark, NJ":[40.735,-74.172],"Trenton, NJ":[40.218,-74.756],
    "Albuquerque, NM":[35.085,-106.651],
    "New York, NY":[40.713,-74.006],"Buffalo, NY":[42.886,-78.879],"Rochester, NY":[43.157,-77.615],"Albany, NY":[42.652,-73.756],
    "Charlotte, NC":[35.227,-80.843],"Raleigh, NC":[35.779,-78.638],"Greensboro, NC":[36.072,-79.792],"Durham, NC":[35.994,-78.899],
    "Fargo, ND":[46.877,-96.789],
    "Columbus, OH":[39.961,-82.999],"Cleveland, OH":[41.499,-81.695],"Cincinnati, OH":[39.103,-84.512],"Toledo, OH":[41.664,-83.555],
    "Oklahoma City, OK":[35.467,-97.516],"Tulsa, OK":[36.154,-95.993],
    "Portland, OR":[45.523,-122.676],"Eugene, OR":[44.052,-123.087],
    "Philadelphia, PA":[39.952,-75.164],"Pittsburgh, PA":[40.440,-79.996],"Allentown, PA":[40.608,-75.491],
    "Providence, RI":[41.823,-71.412],
    "Columbia, SC":[34.000,-81.035],"Charleston, SC":[32.779,-79.931],"Greenville, SC":[34.852,-82.394],
    "Sioux Falls, SD":[43.545,-96.731],
    "Nashville, TN":[36.174,-86.767],"Memphis, TN":[35.149,-90.048],"Knoxville, TN":[35.961,-83.921],"Chattanooga, TN":[35.047,-85.309],
    "Houston, TX":[29.760,-95.370],"Dallas, TX":[32.776,-96.797],"San Antonio, TX":[29.424,-98.494],"Austin, TX":[30.267,-97.743],"Fort Worth, TX":[32.753,-97.333],"El Paso, TX":[31.761,-106.487],"Amarillo, TX":[35.222,-101.831],"Lubbock, TX":[33.578,-101.856],"Corpus Christi, TX":[27.801,-97.396],"Laredo, TX":[27.506,-99.508],
    "Salt Lake City, UT":[40.761,-111.891],
    "Burlington, VT":[44.480,-73.213],
    "Virginia Beach, VA":[36.853,-75.978],"Norfolk, VA":[36.851,-76.289],"Richmond, VA":[37.541,-77.434],"Roanoke, VA":[37.271,-79.941],
    "Seattle, WA":[47.606,-122.332],"Spokane, WA":[47.659,-117.426],"Tacoma, WA":[47.253,-122.444],
    "Charleston, WV":[38.350,-81.633],
    "Milwaukee, WI":[43.039,-87.907],"Madison, WI":[43.073,-89.401],
    "Cheyenne, WY":[41.140,-104.820],
    "Washington, DC":[38.907,-77.037],
};

/* ---- Lane rate averages ($/mile) by state pair ---- */
const LANE_RATES = {
    'AL-FL':2.18,'AL-GA':2.08,'AL-TN':2.12,'AL-MS':2.05,'AL-TX':2.55,
    'AZ-CA':2.40,'AZ-TX':2.58,'AZ-NV':1.98,'AZ-NM':2.05,'AZ-UT':2.15,
    'CA-AZ':2.15,'CA-NV':1.88,'CA-OR':2.25,'CA-WA':2.38,'CA-TX':3.25,
    'CO-TX':2.48,'CO-KS':2.22,'CO-UT':2.12,'CO-NM':2.18,'CO-WY':2.05,
    'FL-GA':2.12,'FL-NC':2.38,'FL-VA':2.52,'FL-SC':2.20,'FL-AL':2.18,'FL-TX':2.75,
    'GA-FL':2.08,'GA-NC':2.32,'GA-TN':2.18,'GA-TX':2.88,'GA-OH':2.68,'GA-SC':2.05,'GA-AL':2.08,'GA-VA':2.42,
    'IL-IN':1.92,'IL-MO':2.12,'IL-WI':2.02,'IL-MI':2.18,'IL-TX':2.82,'IL-OH':2.10,'IL-KY':2.08,
    'IN-IL':1.92,'IN-OH':1.98,'IN-MI':2.08,'IN-KY':2.02,'IN-TN':2.18,
    'KY-IN':2.02,'KY-OH':2.08,'KY-TN':2.12,'KY-VA':2.20,'KY-IL':2.08,
    'LA-TX':2.22,'LA-MS':2.08,'LA-AL':2.12,'LA-GA':2.45,
    'MI-OH':2.02,'MI-IN':2.08,'MI-IL':2.18,'MI-WI':2.10,
    'MO-IL':2.12,'MO-KS':2.18,'MO-TN':2.28,'MO-AR':2.15,'MO-TX':2.65,
    'NC-VA':2.18,'NC-GA':2.32,'NC-SC':2.02,'NC-TN':2.25,'NC-FL':2.38,
    'NJ-NY':2.88,'NJ-PA':2.22,'NJ-CT':2.58,'NJ-MD':2.30,
    'NY-NJ':2.88,'NY-PA':2.32,'NY-CT':2.62,'NY-MA':2.55,'NY-FL':2.85,
    'OH-IN':1.98,'OH-PA':2.18,'OH-MI':2.02,'OH-KY':2.08,'OH-IL':2.10,'OH-TN':2.25,
    'PA-OH':2.18,'PA-NY':2.32,'PA-NJ':2.22,'PA-MD':2.28,'PA-VA':2.22,
    'SC-NC':2.02,'SC-GA':1.98,'SC-VA':2.18,'SC-FL':2.22,
    'TN-GA':2.18,'TN-KY':2.12,'TN-MS':2.08,'TN-NC':2.25,'TN-AL':2.12,'TN-TX':2.72,'TN-IL':2.38,
    'TX-LA':2.22,'TX-OK':2.18,'TX-NM':2.38,'TX-CA':3.22,'TX-IL':2.85,'TX-GA':2.92,'TX-FL':2.78,'TX-CO':2.48,'TX-TN':2.72,
    'VA-NC':2.18,'VA-MD':2.12,'VA-DC':2.32,'VA-WV':2.08,'VA-PA':2.22,'VA-GA':2.42,
    'WA-OR':2.12,'WA-CA':2.42,'WA-ID':2.08,
};

/* ---- MPG defaults ---- */
const TRIP_MPG = { 'Box Truck':10,'Dry Van':6.5,'Reefer':6,'Flatbed':6.5,'Step Deck':6.5,'Hot Shot':14,'RGN':5.5,'Tanker':6 };

/* ---- Haversine distance ---- */
function tripMiles(c1, c2) {
    const R = 3958.8, toR = Math.PI / 180;
    const dLat = (c2[0]-c1[0]) * toR, dLon = (c2[1]-c1[1]) * toR;
    const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*toR)*Math.cos(c2[0]*toR)*Math.sin(dLon/2)**2;
    return Math.round(3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 1.28);
}

/* ---- Fuzzy city search ---- */
function fuzzyCity(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase().trim();
    return Object.keys(AI_CITIES)
        .filter(c => c.toLowerCase().includes(q))
        .sort((a, b) => {
            const al = a.toLowerCase(), bl = b.toLowerCase();
            const aStarts = al.startsWith(q) ? 0 : 1;
            const bStarts = bl.startsWith(q) ? 0 : 1;
            return aStarts - bStarts || a.localeCompare(b);
        })
        .slice(0, 10);
}

/* ---- Load grade based on net $/mile ---- */
function loadGrade(netPerMile) {
    if (netPerMile >= 1.80) return { grade: 'A+', cls: 'grade-a-plus', label: 'Excellent Load' };
    if (netPerMile >= 1.20) return { grade: 'A',  cls: 'grade-a',      label: 'Great Load' };
    if (netPerMile >= 0.75) return { grade: 'B',  cls: 'grade-b',      label: 'Good Load' };
    if (netPerMile >= 0.40) return { grade: 'C',  cls: 'grade-c',      label: 'Fair Load' };
    if (netPerMile >= 0.10) return { grade: 'D',  cls: 'grade-d',      label: 'Marginal Load' };
    return                         { grade: 'F',  cls: 'grade-f',      label: 'Loss-Making Load' };
}

/* ---- Lane rate lookup ---- */
function laneRate(originCity, destCity) {
    const oState = (originCity.match(/,\s*([A-Z]{2})$/) || [])[1];
    const dState = (destCity.match(/,\s*([A-Z]{2})$/) || [])[1];
    if (!oState || !dState) return null;
    return LANE_RATES[oState + '-' + dState] || null;
}

/* ---- Format helpers ---- */
const ai$ = n => '$' + Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const aiN = (n,d) => n.toLocaleString('en-US',{minimumFractionDigits:d||0,maximumFractionDigits:d||0});

/* ---- Set result value with flash animation ---- */
function aiSet(id, val, colorClass) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = val;
    if (colorClass) el.className = 'ai-row-value ' + colorClass;
    el.classList.add('num-flash');
    setTimeout(() => el.classList.remove('num-flash'), 300);
}

/* ---- Show/hide results cards ---- */
function showTripCards(show) {
    ['ai-grade-card','ai-insights-card','ai-route-card','ai-revenue-card','ai-market-card','ai-proj-card'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = show ? '' : 'none';
    });
    const ph = document.getElementById('trip-placeholder');
    if (ph) ph.style.display = show ? 'none' : '';
}

/* ---- Main calculation engine ---- */
function runTripCalc() {
    const g  = id => document.getElementById(id);
    const v  = id => parseFloat(g(id)?.value) || 0;
    const sv = id => g(id)?.value?.trim() || '';

    const originCity = sv('ai-origin');
    const destCity   = sv('ai-dest');
    const manMiles   = v('t-miles');
    const dhMiles    = v('t-deadhead');
    const mpg        = v('t-mpg');
    const dhMpg      = v('t-dh-mpg');
    const diesel     = v('t-diesel');
    const rateType   = sv('t-rate-type');
    const rate       = v('t-rate');
    const detention  = v('t-detention');
    const fsc        = v('t-fsc');
    const dispPct    = v('t-disp-pct');
    const tolls      = v('t-tolls');
    const lumper     = v('t-lumper');
    const scale      = v('t-scale');
    const other      = v('t-other');

    /* Distance */
    let miles = manMiles;
    let autoCalc = false;
    const hint = g('t-miles-hint');
    if (!miles && AI_CITIES[originCity] && AI_CITIES[destCity]) {
        miles = tripMiles(AI_CITIES[originCity], AI_CITIES[destCity]);
        autoCalc = true;
    }
    if (hint) {
        if (autoCalc) { hint.textContent = '≈ ' + aiN(miles) + ' mi (road estimate)'; hint.style.color = '#ff9900'; }
        else if (miles) { hint.textContent = ''; }
        else { hint.textContent = 'Type cities or enter miles manually'; hint.style.color = 'rgba(255,255,255,0.28)'; }
    }

    if (!miles || !rate) { showTripCards(false); return; }

    /* Revenue */
    const grossRev  = rateType === 'per-mile' ? rate * miles : rate;
    const totalRev  = grossRev + detention + fsc;
    const ratePerMi = miles > 0 ? grossRev / miles : 0;

    /* Fuel */
    const gallons    = mpg > 0 ? miles / mpg : 0;
    const dhGallons  = dhMpg > 0 ? dhMiles / dhMpg : 0;
    const loadedFuel = gallons * diesel;
    const dhFuel     = dhGallons * diesel;
    const totalFuel  = loadedFuel + dhFuel;

    /* Expenses */
    const dispFee   = totalRev * (dispPct / 100);
    const miscExp   = tolls + lumper + scale + other;
    const totalExp  = totalFuel + dispFee + miscExp;

    /* Net */
    const netProfit = totalRev - totalExp;
    const netPerMi  = miles > 0 ? netProfit / miles : 0;
    const expPerMi  = miles > 0 ? totalExp / miles : 0;
    const breakEven = miles > 0 ? totalExp / miles : 0;

    /* Drive time */
    const hrs  = miles / 55;
    const days = Math.floor(hrs / 11);
    const rem  = (hrs % 11).toFixed(1);
    const driveTime = days > 0 ? days + 'd ' + rem + 'h (HOS)' : hrs.toFixed(1) + 'h';

    /* Grade */
    const { grade, cls, label } = loadGrade(netPerMi);

    /* Lane average */
    const avgRate   = laneRate(originCity, destCity);
    const laneDiff  = avgRate ? ((ratePerMi - avgRate) / avgRate * 100) : null;

    /* Market needle position (0-100%) */
    const needlePct = avgRate
        ? Math.max(5, Math.min(95, 50 + (laneDiff / 2)))
        : 50;

    /* AI Insights */
    const insights = buildInsights({ miles, grossRev, totalRev, netProfit, netPerMi, ratePerMi, totalFuel, diesel, diesel, avgRate, laneDiff, dispPct, days, detention, dhMiles, breakEven });

    /* ---- Render ---- */
    showTripCards(true);

    /* Grade card */
    const gradeCard = g('ai-grade-card');
    if (gradeCard) {
        gradeCard.className = 'ai-grade-card ' + cls;
    }
    aiSet('ai-grade-val', grade);
    g('load-grade-label') && (g('load-grade-label').textContent = label);

    const netColor = netProfit >= 0 ? '#00d4aa' : '#ff6b6b';
    const netEl = g('ai-net-profit');
    if (netEl) { netEl.textContent = (netProfit < 0 ? '−' : '') + ai$(netProfit); netEl.style.color = netColor; }
    const netMiEl = g('ai-net-per-mile');
    if (netMiEl) { netMiEl.textContent = (netPerMi < 0 ? '−' : '') + ai$(Math.abs(netPerMi)) + '/mi net'; netMiEl.style.color = netColor; }

    const profitPct = totalRev > 0 ? Math.max(0, Math.min(100, (netProfit / totalRev) * 100)) : 0;
    const bar = g('ai-profit-bar');
    if (bar) { bar.style.width = profitPct + '%'; bar.style.background = netProfit >= 0 ? 'linear-gradient(90deg,#00d4aa,#00ff88)' : 'linear-gradient(90deg,#ff6b6b,#cc0000)'; }
    const barLbl = g('ai-profit-bar-label');
    if (barLbl) barLbl.textContent = netProfit >= 0 ? 'Profit margin: ' + profitPct.toFixed(1) + '%' : 'Operating at a loss';

    /* Insights */
    const insEl = g('ai-insights-list');
    if (insEl) insEl.innerHTML = insights.map(i => '<div class="ai-insight-item ' + i.type + '"><span class="ai-insight-icon">' + i.icon + '</span><span>' + i.text + '</span></div>').join('');

    /* Route & Fuel */
    aiSet('ai-miles',      aiN(miles) + ' mi', 'orange');
    aiSet('ai-dh-miles',   dhMiles > 0 ? aiN(dhMiles) + ' mi' : '—');
    aiSet('ai-drive-time', driveTime);
    aiSet('ai-gallons',    aiN(gallons, 1) + ' gal');
    aiSet('ai-dh-fuel',    dhFuel > 0 ? ai$(dhFuel) : '—');
    aiSet('ai-fuel-total', ai$(totalFuel), 'orange');
    aiSet('ai-fuel-per-mi',ai$(totalFuel / miles) + '/mi');

    /* Revenue */
    aiSet('ai-gross',     ai$(grossRev), 'orange');
    aiSet('ai-extras',    (detention + fsc) > 0 ? ai$(detention + fsc) : '—');
    aiSet('ai-total-rev', ai$(totalRev), 'orange');
    aiSet('ai-exp-fuel',  ai$(totalFuel));
    aiSet('ai-exp-disp',  ai$(dispFee));
    aiSet('ai-exp-misc',  ai$(miscExp));
    const netTotalEl = g('ai-net-total');
    if (netTotalEl) { netTotalEl.textContent = (netProfit < 0 ? '−' : '') + ai$(Math.abs(netProfit)); netTotalEl.style.color = netColor; }

    /* Market */
    aiSet('ai-your-rate',  ai$(ratePerMi) + '/mi', 'orange');
    aiSet('ai-lane-avg',   avgRate ? ai$(avgRate) + '/mi' : 'N/A');
    aiSet('ai-breakeven',  ai$(breakEven) + '/mi');
    const mktEl = g('ai-market-pos');
    if (mktEl) {
        if (laneDiff === null) { mktEl.textContent = 'N/A'; mktEl.className = 'ai-row-value'; }
        else if (laneDiff > 10)  { mktEl.textContent = '↑ ' + Math.abs(laneDiff).toFixed(0) + '% Above Market'; mktEl.className = 'ai-row-value green'; }
        else if (laneDiff < -10) { mktEl.textContent = '↓ ' + Math.abs(laneDiff).toFixed(0) + '% Below Market'; mktEl.className = 'ai-row-value red'; }
        else                      { mktEl.textContent = '≈ At Market Rate'; mktEl.className = 'ai-row-value'; }
    }
    const needle = g('ai-rate-needle');
    if (needle) needle.style.left = needlePct + '%';

    /* Projections */
    aiSet('ai-proj-per-mi',  ai$(netPerMi) + '/mi', netPerMi >= 0 ? 'green' : 'red');
    aiSet('ai-proj-weekly',  ai$(netProfit * 3));
    aiSet('ai-proj-monthly', ai$(netProfit * 12));
    aiSet('ai-proj-annual',  ai$(netProfit * 144), 'green');
}

/* ---- Build AI insight bullets ---- */
function buildInsights({ miles, grossRev, totalRev, netProfit, netPerMi, ratePerMi, totalFuel, diesel, avgRate, laneDiff, dispPct, days, detention, dhMiles, breakEven }) {
    const tips = [];
    const fuelPct = totalRev > 0 ? (totalFuel / totalRev * 100) : 0;

    /* Grade assessment */
    if (netPerMi >= 1.8)  tips.push({ type:'good', icon:'🏆', text:'Outstanding margin — this is an A+ load. Accept immediately.' });
    else if (netPerMi >= 1.2) tips.push({ type:'good', icon:'✅', text:'Strong margin at ' + ai$(netPerMi) + '/mi net. Good load to accept.' });
    else if (netPerMi >= 0.75) tips.push({ type:'info', icon:'👍', text:'Decent margin. Solid load — look for opportunities to negotiate higher.' });
    else if (netPerMi >= 0.4)  tips.push({ type:'warn', icon:'⚠️', text:'Thin margin at ' + ai$(netPerMi) + '/mi. Consider negotiating rate up.' });
    else if (netPerMi >= 0.1)  tips.push({ type:'bad',  icon:'🔴', text:'Very low margin. Only accept if necessary to reposition.' });
    else                        tips.push({ type:'bad',  icon:'🚫', text:'Operating at a loss. Do not accept without renegotiating to at least ' + ai$(breakEven) + '/mi.' });

    /* Lane rate comparison */
    if (laneDiff !== null) {
        if (laneDiff > 20)       tips.push({ type:'good', icon:'💰', text:'Rate is ' + Math.abs(laneDiff).toFixed(0) + '% above lane average. Excellent negotiation!' });
        else if (laneDiff > 5)   tips.push({ type:'good', icon:'📈', text:'Rate is slightly above the ' + ai$(avgRate || 0) + '/mi lane average. Good rate.' });
        else if (laneDiff > -5)  tips.push({ type:'info', icon:'📊', text:'Rate matches the lane average of ' + ai$(avgRate || 0) + '/mi for this corridor.' });
        else if (laneDiff > -20) tips.push({ type:'warn', icon:'📉', text:'Rate is below lane average (' + ai$(avgRate || 0) + '/mi). Try negotiating to ' + ai$(avgRate || 0) + '/mi.' });
        else                     tips.push({ type:'bad',  icon:'❌', text:'Rate is significantly below market (' + ai$(avgRate || 0) + '/mi). Push for a higher rate before accepting.' });
    }

    /* Fuel impact */
    if (fuelPct > 40)      tips.push({ type:'bad',  icon:'⛽', text:'Fuel is ' + fuelPct.toFixed(0) + '% of revenue — very high. Negotiate a fuel surcharge (FSC) or deadhead cost coverage.' });
    else if (fuelPct > 28) tips.push({ type:'warn', icon:'⛽', text:'Fuel is ' + fuelPct.toFixed(0) + '% of revenue. Ask broker about FSC on this lane.' });
    else                   tips.push({ type:'good', icon:'⛽', text:'Fuel is ' + fuelPct.toFixed(0) + '% of revenue — healthy fuel-to-revenue ratio.' });

    /* Drive time */
    if (days > 2)    tips.push({ type:'info', icon:'🕒', text:days + '-day trip at 11h HOS. Confirm delivery window matches your schedule.' });
    else if (days > 0) tips.push({ type:'info', icon:'🕒', text:'Approximately ' + days + '-day run — manageable for a team or solo driver.' });
    else             tips.push({ type:'good', icon:'🕒', text:'Short run — completable in one HOS shift. Good turnaround load.' });

    /* Deadhead */
    if (dhMiles > miles * 0.3) tips.push({ type:'warn', icon:'🔄', text:'Deadhead (' + aiN(dhMiles) + ' mi) is over 30% of loaded miles. Consider nearby loads to reduce repositioning cost.' });
    else if (dhMiles > 0)      tips.push({ type:'info', icon:'🔄', text:'Deadhead of ' + aiN(dhMiles) + ' mi factored into calculations.' });

    /* Dispatcher fee note */
    if (dispPct > 10) tips.push({ type:'warn', icon:'💼', text:'Dispatcher fee is ' + dispPct + '%. Standard is 6-10%. Confirm your agreement.' });

    return tips.slice(0, 6);
}

/* ---- AI City Search Autocomplete ---- */
function initAiSearch() {
    setupCityInput('ai-origin', 'ai-origin-drop', id => { document.getElementById(id) && runTripCalc(); });
    setupCityInput('ai-dest',   'ai-dest-drop',   id => { document.getElementById(id) && runTripCalc(); });

    /* Swap button */
    document.getElementById('ai-swap-btn')?.addEventListener('click', () => {
        const o = document.getElementById('ai-origin');
        const d = document.getElementById('ai-dest');
        if (!o || !d) return;
        [o.value, d.value] = [d.value, o.value];
        runTripCalc();
    });

    /* Quick lane buttons */
    document.querySelectorAll('.quick-lane-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const o = document.getElementById('ai-origin');
            const d = document.getElementById('ai-dest');
            if (o) o.value = btn.dataset.origin;
            if (d) d.value = btn.dataset.dest;
            runTripCalc();
        });
    });

    /* Equipment → MPG auto-fill */
    document.getElementById('t-equipment')?.addEventListener('change', e => {
        const mpgEl = document.getElementById('t-mpg');
        if (mpgEl && TRIP_MPG[e.target.value]) mpgEl.value = TRIP_MPG[e.target.value];
        runTripCalc();
    });

    /* Live recalc on all trip inputs */
    document.getElementById('panel-trip')?.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', runTripCalc);
        el.addEventListener('change', runTripCalc);
    });
}

function setupCityInput(inputId, dropId, onSelect) {
    const input = document.getElementById(inputId);
    const drop  = document.getElementById(dropId);
    if (!input || !drop) return;

    let activeIdx = -1;

    input.addEventListener('input', () => {
        const results = fuzzyCity(input.value);
        activeIdx = -1;
        if (!results.length) {
            drop.innerHTML = '<div class="ai-dropdown-empty">No cities found</div>';
        } else {
            drop.innerHTML = results.map((c, i) => {
                const [city, state] = c.split(', ');
                const qLow = input.value.toLowerCase();
                const highlighted = city.replace(new RegExp('(' + qLow.replace(/[^a-z]/gi,'') + ')', 'gi'), '<strong>$1</strong>');
                return '<div class="ai-dropdown-item" data-idx="' + i + '" data-city="' + esc(c) + '">' +
                    '<span class="city-name">' + highlighted + '</span>' +
                    '<span class="city-state">' + state + '</span>' +
                '</div>';
            }).join('');
        }
        drop.classList.add('open');
        runTripCalc();

        drop.querySelectorAll('.ai-dropdown-item').forEach(item => {
            item.addEventListener('mousedown', e => {
                e.preventDefault();
                input.value = item.dataset.city;
                drop.classList.remove('open');
                runTripCalc();
            });
        });
    });

    input.addEventListener('keydown', e => {
        const items = drop.querySelectorAll('.ai-dropdown-item');
        if (e.key === 'ArrowDown')  { e.preventDefault(); activeIdx = Math.min(activeIdx+1, items.length-1); }
        if (e.key === 'ArrowUp')    { e.preventDefault(); activeIdx = Math.max(activeIdx-1, 0); }
        if (e.key === 'Enter' && activeIdx >= 0) { input.value = items[activeIdx]?.dataset.city || input.value; drop.classList.remove('open'); runTripCalc(); }
        if (e.key === 'Escape')     { drop.classList.remove('open'); }
        items.forEach((item, i) => item.classList.toggle('selected', i === activeIdx));
    });

    input.addEventListener('blur', () => setTimeout(() => drop.classList.remove('open'), 180));
    input.addEventListener('focus', () => { if (input.value.length >= 2) input.dispatchEvent(new Event('input')); });
}

/* ---- Init ---- */

document.addEventListener('DOMContentLoaded', () => {
    seedDrivers();
    seedDemoLoads();
    initTabs();
    initLoadForm();
    initFilters();
    initDocUploads();
    initStatCards();
    initAiSearch();
    updateStats();

    /* Cross-tab live sync — stats and active panel refresh when another tab changes data */
    window.addEventListener('storage', e => {
        if (e.key === LOADS_KEY || e.key === DRIVERS_KEY) {
            updateStats();
            const active = document.querySelector('.tab-panel.active');
            if (active?.id === 'panel-dashboard') renderDashboard();
            if (active?.id === 'panel-drivers')   renderDrivers();
        }
    });

    /* Auto-refresh stats every 60 seconds */
    setInterval(updateStats, 60000);

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
