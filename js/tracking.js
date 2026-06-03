'use strict';

/**
 * Tracking Page — pulls live data from dispatch localStorage when
 * a matching KEM load number is found, otherwise shows simulated data.
 */

document.addEventListener('DOMContentLoaded', function () {

    const trackingForm     = document.querySelector('.futuristic-tracking-form');
    const trackingInput    = document.getElementById('tracking-input');
    const resultsContainer = document.querySelector('.tracking-results');
    const timelineDisplay  = document.getElementById('timeline-display');

    if (!trackingForm) return;

    trackingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const trackingNumber = (trackingInput?.value || '').trim().toUpperCase();
        if (!trackingNumber) return;
        showLoadingState();
        setTimeout(() => {
            const load = findLoad(trackingNumber);
            if (load) {
                showRealTrackingResults(load);
            } else {
                showSimulatedResults(trackingNumber);
            }
        }, 1200);
    });

    /* ---- localStorage lookup ---- */

    function findLoad(id) {
        try {
            const loads = JSON.parse(localStorage.getItem('kem_loads') || '[]');
            return loads.find(l => l.id === id) || null;
        } catch (_) { return null; }
    }

    /* ---- Loading state ---- */

    function showLoadingState() {
        resultsContainer.innerHTML =
            '<div class="results-placeholder">' +
                '<div class="scanner-animation">' +
                    '<div class="scan-line"></div>' +
                    '<svg width="120" height="120" viewBox="0 0 120 120">' +
                        '<circle cx="60" cy="60" r="50" class="scan-circle scan-circle-1"/>' +
                        '<circle cx="60" cy="60" r="40" class="scan-circle scan-circle-2"/>' +
                        '<circle cx="60" cy="60" r="30" class="scan-circle scan-circle-3"/>' +
                    '</svg>' +
                '</div>' +
                '<p>Scanning logistics network...</p>' +
            '</div>';
        if (timelineDisplay) timelineDisplay.style.display = 'none';
    }

    /* ---- Real load data from dispatch system ---- */

    function showRealTrackingResults(load) {
        const statusColors = {
            Pending:     '#f0c14b',
            Dispatched:  '#00a8e1',
            'In Transit':'#ff9900',
            Delivered:   '#00d4aa'
        };
        const color   = statusColors[load.status] || '#ff9900';
        const latest  = load.statusHistory?.[load.statusHistory.length - 1];
        const location = latest?.location || load.originCity + ', ' + load.originState;

        resultsContainer.innerHTML =
            '<div style="text-align:left">' +
                '<div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">' +
                    '<h3 style="color:#fff;font-size:1.4rem;margin:0">Load #' + esc(load.id) + '</h3>' +
                    '<span style="background:rgba(' + hexToRgb(color) + ',0.15);color:' + color + ';border:1px solid rgba(' + hexToRgb(color) + ',0.3);padding:0.3rem 0.9rem;border-radius:100px;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em">' + esc(load.status) + '</span>' +
                '</div>' +
                '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1.5rem;margin-bottom:2rem">' +
                    infoBlock('Origin',       load.originCity + ', ' + load.originState, '#fff') +
                    infoBlock('Destination',  load.destCity   + ', ' + load.destState,   '#fff') +
                    infoBlock('Current Location', location, '#00a8e1') +
                    infoBlock('Driver',       load.driverName || 'Unassigned', '#ff9900') +
                    infoBlock('Equipment',    load.equipment  || '—', '#fff') +
                    infoBlock('Delivery ETA', fmtDT(load.deliveryDate, load.deliveryTime), '#00d4aa') +
                '</div>' +
                (load.hazmat ? '<div style="background:rgba(240,193,75,0.1);border:1px solid rgba(240,193,75,0.3);border-radius:8px;padding:0.75rem 1rem;color:#f0c14b;font-size:0.85rem;font-weight:600;margin-bottom:1.5rem">⚠️ Hazmat Shipment — Handle per shipping papers</div>' : '') +
                '<div style="padding-top:1.5rem;border-top:1px solid rgba(255,255,255,0.08)">' +
                    '<p style="color:rgba(255,255,255,0.6);font-size:0.8rem">Reference: ' + esc(load.referenceNumber || 'N/A') + ' &nbsp;|&nbsp; Broker: ' + esc(load.brokerName || 'N/A') + '</p>' +
                '</div>' +
            '</div>';

        /* Build timeline from statusHistory */
        if (timelineDisplay) {
            const history = load.statusHistory || [];
            const allSteps = ['Pending', 'Dispatched', 'In Transit', 'Delivered'];
            const currentIdx = allSteps.indexOf(load.status);

            const nodes = allSteps.map((step, i) => {
                const entry     = history.find(h => h.status === step);
                const completed = i < currentIdx;
                const active    = i === currentIdx;
                const nodeClass = completed ? 'completed' : active ? 'active' : 'pending';

                const checkSVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
                const truckSVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>';
                const circleSVG= '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';

                const icon = completed ? checkSVG : active ? truckSVG : circleSVG;
                const pulseRing = active ? '<div class="pulse-ring"></div>' : '';

                return '<div class="timeline-node ' + nodeClass + '">' +
                    '<div class="node-icon">' + pulseRing + icon + '</div>' +
                    '<div class="node-content">' +
                        '<h4>' + esc(step) + '</h4>' +
                        '<p class="node-location">' + (entry?.location ? esc(entry.location) : '—') + '</p>' +
                        '<p class="node-time">' + (entry ? new Date(entry.timestamp).toLocaleString() : 'Pending') + '</p>' +
                        (entry?.notes ? '<p style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-top:0.2rem">' + esc(entry.notes) + '</p>' : '') +
                    '</div>' +
                '</div>';
            }).join('');

            timelineDisplay.querySelector('.timeline-track').innerHTML = nodes;
            timelineDisplay.style.display = 'block';
            setTimeout(() => timelineDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
        }
    }

    /* ---- Simulated fallback results ---- */

    function showSimulatedResults(trackingNumber) {
        resultsContainer.innerHTML =
            '<div style="text-align:left">' +
                '<div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">' +
                    '<h3 style="color:#fff;font-size:1.4rem;margin:0">Tracking: ' + esc(trackingNumber) + '</h3>' +
                    '<span style="background:rgba(255,153,0,0.15);color:#ff9900;border:1px solid rgba(255,153,0,0.3);padding:0.3rem 0.9rem;border-radius:100px;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em">In Transit</span>' +
                '</div>' +
                '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1.5rem">' +
                    infoBlock('Origin',          'Atlanta, GA', '#fff') +
                    infoBlock('Destination',     'Washington, DC', '#fff') +
                    infoBlock('Current Location','Richmond, VA', '#00a8e1') +
                    infoBlock('Estimated Delivery','Jan 16, 2025 3:00 PM', '#00d4aa') +
                '</div>' +
                '<div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.08)">' +
                    '<p style="color:rgba(255,255,255,0.4);font-size:0.8rem">💡 Submit loads via the <a href="dispatch.html" style="color:#ff9900">Dispatch Portal</a> to see live data here.</p>' +
                '</div>' +
            '</div>';

        if (timelineDisplay) {
            timelineDisplay.style.display = 'block';
            setTimeout(() => timelineDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
        }
    }

    /* ---- Dispatcher status update panel ---- */

    const dispatcherToggle = document.getElementById('dispatcher-toggle');
    const dispatcherBody   = document.getElementById('dispatcher-form-body');

    if (dispatcherToggle && dispatcherBody) {
        dispatcherToggle.addEventListener('click', () => {
            const isOpen = dispatcherBody.classList.toggle('open');
            dispatcherToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    const dispatcherForm = document.getElementById('dispatcher-update-form');
    if (dispatcherForm) {
        dispatcherForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const fd       = new FormData(dispatcherForm);
            const loadId   = (fd.get('d-load-id')  || '').trim().toUpperCase();
            const newStatus= fd.get('d-status')     || '';
            const location = (fd.get('d-location')  || '').trim();
            const notes    = (fd.get('d-notes')     || '').trim();

            if (!loadId || !newStatus) {
                showDispatcherMsg('Please enter a Load ID and select a status.', 'error');
                return;
            }

            try {
                const loads  = JSON.parse(localStorage.getItem('kem_loads') || '[]');
                const drivers= JSON.parse(localStorage.getItem('kem_drivers') || '[]');
                const load   = loads.find(l => l.id === loadId);
                if (!load) { showDispatcherMsg('Load ' + loadId + ' not found.', 'error'); return; }

                load.status = newStatus;
                load.statusHistory = load.statusHistory || [];
                load.statusHistory.push({ status: newStatus, timestamp: new Date().toISOString(), location: location, notes: notes });

                if (newStatus === 'Delivered' && load.driverId) {
                    const driver = drivers.find(d => d.id === load.driverId);
                    if (driver) { driver.status = 'Available'; driver.currentLoadId = null; }
                    localStorage.setItem('kem_drivers', JSON.stringify(drivers));
                }

                localStorage.setItem('kem_loads', JSON.stringify(loads));
                showDispatcherMsg('Load ' + loadId + ' updated to ' + newStatus + '.', 'success');
                dispatcherForm.reset();
            } catch (_) {
                showDispatcherMsg('Error updating load. Please try again.', 'error');
            }
        });
    }

    function showDispatcherMsg(msg, type) {
        let el = document.getElementById('dispatcher-msg');
        if (!el) {
            el = document.createElement('p');
            el.id = 'dispatcher-msg';
            el.style.cssText = 'margin-top:0.75rem;font-size:0.875rem;font-weight:600;padding:0.5rem 0';
            dispatcherForm?.after(el);
        }
        el.style.color = type === 'error' ? '#ff7070' : '#00d4aa';
        el.textContent = (type === 'error' ? '✕  ' : '✓  ') + msg;
        setTimeout(() => { if (el) el.textContent = ''; }, 4000);
    }

    /* ---- Helpers ---- */

    function infoBlock(label, value, valueColor) {
        return '<div>' +
            '<p style="color:rgba(255,255,255,0.55);font-size:0.78rem;margin-bottom:0.3rem;text-transform:uppercase;letter-spacing:0.07em">' + label + '</p>' +
            '<p style="color:' + valueColor + ';font-weight:700;font-size:1rem">' + esc(value || '—') + '</p>' +
        '</div>';
    }

    function fmtDT(date, time) {
        if (!date) return '—';
        const d = new Date(date + 'T' + (time || '00:00'));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + (time ? ' ' + fmtTime(time) : '');
    }

    function fmtTime(t) {
        const [hStr, mStr] = t.split(':');
        let h = parseInt(hStr, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + mStr + ' ' + ampm;
    }

    function esc(str) {
        if (!str) return '';
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function hexToRgb(hex) {
        const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        return m ? parseInt(m[1],16) + ',' + parseInt(m[2],16) + ',' + parseInt(m[3],16) : '255,153,0';
    }
});
