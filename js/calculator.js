'use strict';

/* ============================================================
   KEM Logistics — Trip Calculator Logic
   ============================================================ */

/* ---- US city coordinates (lat, lng) for distance estimation ---- */
const CITIES = {
    /* Alabama */ "Birmingham, AL":[33.520,-86.803],"Mobile, AL":[30.694,-88.043],"Montgomery, AL":[32.361,-86.279],
    /* Arizona */ "Phoenix, AZ":[33.448,-112.074],"Tucson, AZ":[32.254,-110.912],"Flagstaff, AZ":[35.198,-111.651],
    /* Arkansas */ "Little Rock, AR":[34.746,-92.289],"Fort Smith, AR":[35.386,-94.398],
    /* California */ "Los Angeles, CA":[34.052,-118.244],"San Francisco, CA":[37.774,-122.419],"San Diego, CA":[32.715,-117.157],"Sacramento, CA":[38.581,-121.494],"Fresno, CA":[36.737,-119.787],"Stockton, CA":[37.957,-121.291],"Bakersfield, CA":[35.373,-119.019],
    /* Colorado */ "Denver, CO":[39.739,-104.984],"Colorado Springs, CO":[38.834,-104.821],"Pueblo, CO":[38.255,-104.610],
    /* Connecticut */ "Hartford, CT":[41.763,-72.685],"Bridgeport, CT":[41.179,-73.190],
    /* Delaware */ "Wilmington, DE":[39.744,-75.547],
    /* Florida */ "Miami, FL":[25.775,-80.209],"Orlando, FL":[28.538,-81.381],"Tampa, FL":[27.947,-82.459],"Jacksonville, FL":[30.332,-81.656],"Fort Lauderdale, FL":[26.122,-80.143],"Tallahassee, FL":[30.437,-84.281],
    /* Georgia */ "Atlanta, GA":[33.749,-84.388],"Savannah, GA":[32.083,-81.100],"Augusta, GA":[33.471,-81.975],"Columbus, GA":[32.461,-84.987],"Macon, GA":[32.840,-83.632],
    /* Idaho */ "Boise, ID":[43.615,-116.202],"Pocatello, ID":[42.872,-112.446],
    /* Illinois */ "Chicago, IL":[41.878,-87.630],"Rockford, IL":[42.271,-89.094],"Springfield, IL":[39.798,-89.655],"Peoria, IL":[40.693,-89.589],
    /* Indiana */ "Indianapolis, IN":[39.768,-86.158],"Fort Wayne, IN":[41.130,-85.129],"Evansville, IN":[37.975,-87.556],"South Bend, IN":[41.684,-86.252],
    /* Iowa */ "Des Moines, IA":[41.600,-93.609],"Cedar Rapids, IA":[41.977,-91.666],"Davenport, IA":[41.524,-90.578],
    /* Kansas */ "Wichita, KS":[37.697,-97.337],"Kansas City, KS":[39.114,-94.627],"Topeka, KS":[39.048,-95.678],
    /* Kentucky */ "Louisville, KY":[38.252,-85.759],"Lexington, KY":[38.029,-84.495],"Bowling Green, KY":[36.991,-86.444],
    /* Louisiana */ "New Orleans, LA":[29.951,-90.072],"Baton Rouge, LA":[30.451,-91.154],"Shreveport, LA":[32.525,-93.750],
    /* Maine */ "Portland, ME":[43.661,-70.256],"Bangor, ME":[44.801,-68.778],
    /* Maryland */ "Baltimore, MD":[39.290,-76.612],"Frederick, MD":[39.414,-77.411],
    /* Massachusetts */ "Boston, MA":[42.360,-71.058],"Worcester, MA":[42.263,-71.802],"Springfield, MA":[42.101,-72.590],
    /* Michigan */ "Detroit, MI":[42.331,-83.046],"Grand Rapids, MI":[42.966,-85.656],"Flint, MI":[43.013,-83.688],"Lansing, MI":[42.732,-84.555],
    /* Minnesota */ "Minneapolis, MN":[44.977,-93.265],"Saint Paul, MN":[44.944,-93.093],"Duluth, MN":[46.786,-92.100],
    /* Mississippi */ "Jackson, MS":[32.299,-90.184],"Gulfport, MS":[30.367,-89.093],
    /* Missouri */ "Kansas City, MO":[39.099,-94.578],"Saint Louis, MO":[38.627,-90.199],"Springfield, MO":[37.215,-93.298],
    /* Montana */ "Billings, MT":[45.783,-108.501],"Missoula, MT":[46.872,-113.994],
    /* Nebraska */ "Omaha, NE":[41.258,-95.938],"Lincoln, NE":[40.813,-96.703],
    /* Nevada */ "Las Vegas, NV":[36.175,-115.137],"Reno, NV":[39.529,-119.814],
    /* New Hampshire */ "Manchester, NH":[42.995,-71.461],"Concord, NH":[43.207,-71.538],
    /* New Jersey */ "Newark, NJ":[40.735,-74.172],"Jersey City, NJ":[40.718,-74.044],"Trenton, NJ":[40.218,-74.756],
    /* New Mexico */ "Albuquerque, NM":[35.085,-106.651],"Santa Fe, NM":[35.687,-105.938],
    /* New York */ "New York, NY":[40.713,-74.006],"Buffalo, NY":[42.886,-78.879],"Rochester, NY":[43.157,-77.615],"Albany, NY":[42.652,-73.756],"Syracuse, NY":[43.048,-76.147],
    /* North Carolina */ "Charlotte, NC":[35.227,-80.843],"Raleigh, NC":[35.779,-78.638],"Greensboro, NC":[36.072,-79.792],"Winston-Salem, NC":[36.100,-80.244],"Durham, NC":[35.994,-78.899],
    /* North Dakota */ "Fargo, ND":[46.877,-96.789],"Bismarck, ND":[46.808,-100.784],
    /* Ohio */ "Columbus, OH":[39.961,-82.999],"Cleveland, OH":[41.499,-81.695],"Cincinnati, OH":[39.103,-84.512],"Toledo, OH":[41.664,-83.555],"Akron, OH":[41.081,-81.519],
    /* Oklahoma */ "Oklahoma City, OK":[35.467,-97.516],"Tulsa, OK":[36.154,-95.993],
    /* Oregon */ "Portland, OR":[45.523,-122.676],"Eugene, OR":[44.052,-123.087],"Salem, OR":[44.942,-123.036],
    /* Pennsylvania */ "Philadelphia, PA":[39.952,-75.164],"Pittsburgh, PA":[40.440,-79.996],"Allentown, PA":[40.608,-75.491],"Erie, PA":[42.129,-80.085],
    /* Rhode Island */ "Providence, RI":[41.823,-71.412],
    /* South Carolina */ "Columbia, SC":[34.000,-81.035],"Charleston, SC":[32.779,-79.931],"Greenville, SC":[34.852,-82.394],
    /* South Dakota */ "Sioux Falls, SD":[43.545,-96.731],"Rapid City, SD":[44.080,-103.231],
    /* Tennessee */ "Nashville, TN":[36.174,-86.767],"Memphis, TN":[35.149,-90.048],"Knoxville, TN":[35.961,-83.921],"Chattanooga, TN":[35.047,-85.309],"Clarksville, TN":[36.527,-87.359],
    /* Texas */ "Houston, TX":[29.760,-95.370],"Dallas, TX":[32.776,-96.797],"San Antonio, TX":[29.424,-98.494],"Austin, TX":[30.267,-97.743],"Fort Worth, TX":[32.753,-97.333],"El Paso, TX":[31.761,-106.487],"Amarillo, TX":[35.222,-101.831],"Lubbock, TX":[33.578,-101.856],"Laredo, TX":[27.506,-99.508],"Corpus Christi, TX":[27.801,-97.396],
    /* Utah */ "Salt Lake City, UT":[40.761,-111.891],"Provo, UT":[40.234,-111.659],
    /* Vermont */ "Burlington, VT":[44.480,-73.213],
    /* Virginia */ "Virginia Beach, VA":[36.853,-75.978],"Norfolk, VA":[36.851,-76.289],"Richmond, VA":[37.541,-77.434],"Roanoke, VA":[37.271,-79.941],
    /* Washington */ "Seattle, WA":[47.606,-122.332],"Spokane, WA":[47.659,-117.426],"Tacoma, WA":[47.253,-122.444],
    /* West Virginia */ "Charleston, WV":[38.350,-81.633],"Huntington, WV":[38.419,-82.445],
    /* Wisconsin */ "Milwaukee, WI":[43.039,-87.907],"Madison, WI":[43.073,-89.401],"Green Bay, WI":[44.519,-88.020],
    /* Wyoming */ "Cheyenne, WY":[41.140,-104.820],"Casper, WY":[42.867,-106.313],
    /* DC */ "Washington, DC":[38.907,-77.037],
};

/* ---- Haversine distance (straight line) × 1.28 road factor ---- */
function calcMiles(c1, c2) {
    const [lat1, lon1] = c1;
    const [lat2, lon2] = c2;
    const R    = 3958.8;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a    = Math.sin(dLat / 2) ** 2 +
                 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                 Math.sin(dLon / 2) ** 2;
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(dist * 1.28);
}

/* ---- MPG defaults per equipment type ---- */
const MPG_DEFAULTS = {
    'Box Truck': 10, 'Dry Van': 6.5, 'Reefer': 6,
    'Flatbed': 6.5, 'Step Deck': 6.5, 'Hot Shot': 14,
    'RGN': 5.5, 'Tanker': 6,
};

/* ---- Populate city datalists ---- */
function populateCities() {
    const list1 = document.getElementById('origin-city-list');
    const list2 = document.getElementById('dest-city-list');
    if (!list1 || !list2) return;
    const opts = Object.keys(CITIES).sort().map(c => '<option value="' + c + '">').join('');
    list1.innerHTML = opts;
    list2.innerHTML = opts;
}

/* ---- Format currency ---- */
const fmt$ = (n) => '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtN = (n, d) => n.toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });

/* ---- Main calculation ---- */
function calculate() {
    const get  = (id) => document.getElementById(id);
    const val  = (id) => parseFloat(get(id)?.value) || 0;
    const sval = (id) => get(id)?.value?.trim() || '';

    const originCity  = sval('origin-city');
    const destCity    = sval('dest-city');
    const manualMiles = val('manual-miles');
    const equipment   = sval('equipment-type');
    const mpg         = val('truck-mpg');
    const dieselPrice = val('diesel-price');
    const rateType    = sval('rate-type');
    const rateAmt     = val('rate-amount');
    const dispPct     = val('dispatcher-fee');
    const tolls       = val('tolls');
    const lumper      = val('lumper-fees');
    const scale       = val('scale-fees');
    const other       = val('other-costs');

    /* --- Determine miles --- */
    let miles = manualMiles;
    let autoMiles = 0;
    if (!miles && CITIES[originCity] && CITIES[destCity]) {
        autoMiles = calcMiles(CITIES[originCity], CITIES[destCity]);
        miles = autoMiles;
    }

    /* Show auto-calculated distance hint */
    const distHint = get('distance-hint');
    if (distHint) {
        if (autoMiles && !manualMiles) {
            distHint.textContent = '~ ' + fmtN(autoMiles) + ' mi estimated from coordinates';
            distHint.style.color = '#ff9900';
        } else if (miles) {
            distHint.textContent = '';
        } else {
            distHint.textContent = 'Enter both cities or type distance manually';
            distHint.style.color = 'rgba(255,255,255,0.35)';
        }
    }

    if (!miles) { showEmpty(); return; }

    /* --- Drive time estimate --- */
    const driveHours = miles / 55;
    const days       = Math.floor(driveHours / 11);
    const remHours   = (driveHours % 11).toFixed(1);
    const driveTime  = days > 0
        ? days + 'd ' + remHours + 'h (@ 55 mph / 11h HOS)'
        : driveHours.toFixed(1) + 'h (@ 55 mph)';

    /* --- Fuel --- */
    const gallons    = mpg > 0 ? miles / mpg : 0;
    const fuelCost   = gallons * dieselPrice;
    const fuelPerMi  = miles > 0 ? fuelCost / miles : 0;

    /* --- Revenue --- */
    const grossRev   = rateType === 'per-mile' ? rateAmt * miles : rateAmt;
    const ratePerMi  = miles > 0 ? grossRev / miles : 0;

    /* --- Expenses --- */
    const dispFee    = grossRev * (dispPct / 100);
    const totalExp   = fuelCost + dispFee + tolls + lumper + scale + other;
    const expPerMi   = miles > 0 ? totalExp / miles : 0;

    /* --- Net profit --- */
    const netProfit  = grossRev - totalExp;
    const netPerMi   = miles > 0 ? netProfit / miles : 0;
    const breakEven  = miles > 0 ? totalExp / miles : 0;

    /* --- Update results --- */
    const netStr   = (netProfit >= 0 ? '' : '− ') + fmt$(netProfit);
    const netMiStr = (netPerMi  >= 0 ? '' : '− ') + fmt$(netPerMi)  + '/mi';
    const netColor = netProfit >= 0 ? '#00d4aa' : '#ff6b6b';

    set('res-miles',          fmtN(miles) + ' mi');
    set('res-drive-time',     driveTime);
    set('res-gallons',        fmtN(gallons, 1) + ' gal');
    set('res-fuel-cost',      fmt$(fuelCost));
    set('res-fuel-per-mi',    fmt$(fuelPerMi) + '/mi');
    set('res-fuel-cost-exp',  fmt$(fuelCost));
    set('res-gross',          fmt$(grossRev));
    set('res-rate-per-mi',    fmt$(ratePerMi) + '/mi');
    set('res-disp-fee',       fmt$(dispFee));
    set('res-tolls',          fmt$(tolls));
    set('res-lumper',         fmt$(lumper));
    set('res-scale',          fmt$(scale));
    set('res-other',          fmt$(other));
    set('res-total-exp',      fmt$(totalExp));
    set('res-exp-per-mi',     fmt$(expPerMi) + '/mi');
    set('res-net-banner',     netStr);
    set('res-net-per-mi-banner', netMiStr);
    set('res-net',            netStr);
    set('res-net-per-mi',     netMiStr);
    set('res-breakeven',      fmt$(breakEven) + '/mi');

    /* Color net profit elements */
    ['res-net-banner', 'res-net-per-mi-banner', 'res-net', 'res-net-per-mi'].forEach(id => {
        const el = get(id);
        if (el) el.style.color = netColor;
    });

    /* Show results panel */
    const panel = get('results-panel');
    if (panel) panel.classList.add('active');

    /* Profit meter */
    updateMeter(grossRev > 0 ? Math.max(0, Math.min(100, (netProfit / grossRev) * 100)) : 0, netProfit >= 0);
}

function set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function showEmpty() {
    const panel = document.getElementById('results-panel');
    if (panel) panel.classList.remove('active');
}

function updateMeter(pct, positive) {
    const bar  = document.getElementById('profit-meter-bar');
    const label= document.getElementById('profit-meter-label');
    if (!bar) return;
    bar.style.width = pct + '%';
    bar.style.background = positive
        ? 'linear-gradient(90deg,#00d4aa,#00ff88)'
        : 'linear-gradient(90deg,#ff6b6b,#cc0000)';
    if (label) label.textContent = positive
        ? 'Profit margin: ' + pct.toFixed(1) + '%'
        : 'Operating at a loss';
}

/* ---- Equipment type → auto-fill MPG ---- */
function onEquipmentChange() {
    const eq  = document.getElementById('equipment-type')?.value;
    const mpgEl = document.getElementById('truck-mpg');
    if (mpgEl && MPG_DEFAULTS[eq]) {
        mpgEl.value = MPG_DEFAULTS[eq];
    }
    calculate();
}

/* ---- Save / Load history ---- */
const HISTORY_KEY = 'kem_calc_history';

function saveCalc() {
    const get  = (id) => document.getElementById(id);
    const sval = (id) => get(id)?.value?.trim() || '';
    const val  = (id) => parseFloat(get(id)?.value) || 0;

    const entry = {
        id:          Date.now(),
        date:        new Date().toLocaleDateString(),
        origin:      sval('origin-city'),
        dest:        sval('dest-city'),
        miles:       val('manual-miles') || document.getElementById('res-miles')?.textContent?.replace(' mi','').replace(',',''),
        gross:       document.getElementById('res-gross')?.textContent || '—',
        net:         document.getElementById('res-net')?.textContent || '—',
        equipment:   sval('equipment-type'),
        rateType:    sval('rate-type'),
        rate:        val('rate-amount'),
    };

    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    history.unshift(entry);
    if (history.length > 20) history.pop();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
    showToast('Calculation saved!');
}

function renderHistory() {
    const el = document.getElementById('calc-history');
    if (!el) return;
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    if (!history.length) {
        el.innerHTML = '<p class="no-history">No saved calculations yet.</p>';
        return;
    }
    el.innerHTML = history.map(h => '<div class="history-card">' +
        '<div class="history-route">' + (h.origin || '?') + ' → ' + (h.dest || '?') + '</div>' +
        '<div class="history-meta">' + h.date + ' &nbsp;·&nbsp; ' + (h.equipment || '—') + ' &nbsp;·&nbsp; ' + h.miles + ' mi</div>' +
        '<div class="history-financials">' +
            '<span class="history-gross">Gross: ' + h.gross + '</span>' +
            '<span class="history-net" style="color:' + (h.net && h.net.includes('−') ? '#ff6b6b' : '#00d4aa') + '">Net: ' + h.net + '</span>' +
        '</div>' +
        '<button class="btn-calc-sm" onclick="deleteHistory(' + h.id + ')">Remove</button>' +
    '</div>').join('');
}

function deleteHistory(id) {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]').filter(h => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
}

/* ---- Reset form ---- */
function resetCalc() {
    document.getElementById('calc-form')?.reset();
    document.getElementById('truck-mpg').value = '6.5';
    document.getElementById('diesel-price').value = '3.89';
    document.getElementById('dispatcher-fee').value = '8';
    showEmpty();
    document.getElementById('distance-hint').textContent = '';
}

/* ---- Toast ---- */
function showToast(msg) {
    let t = document.getElementById('calc-toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'calc-toast';
        t.className = 'dispatch-toast';
        document.body.appendChild(t);
    }
    t.textContent = '✓  ' + msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ---- Print ---- */
function printCalc() { window.print(); }

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
    populateCities();
    renderHistory();

    /* Live recalculate on any input change */
    document.getElementById('calc-form')?.addEventListener('input', calculate);
    document.getElementById('equipment-type')?.addEventListener('change', onEquipmentChange);

    /* Buttons */
    document.getElementById('save-calc-btn')?.addEventListener('click', saveCalc);
    document.getElementById('reset-calc-btn')?.addEventListener('click', resetCalc);
    document.getElementById('print-calc-btn')?.addEventListener('click', printCalc);
    document.getElementById('clear-history-btn')?.addEventListener('click', clearHistory);
});
