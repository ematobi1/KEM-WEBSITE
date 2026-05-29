'use strict';

(function () {

    // ── Company Knowledge Base ────────────────────────────────────────────────
    const KB = {
        company: {
            name:    'KEM Logistics & Solutions LLC',
            phone:   '1-470-836-3519',
            email:   'admin.info@kemlogisticsnsolutions.com',
            address: '972 Holly Meadow Dr, Buford, GA 30518',
            hours:   'Mon – Fri: 8 AM – 6 PM EST · Emergency support 24/7',
            website: 'kemlogisticsnsolutions.com',
        },
        services: [
            { name: 'Full Truckload (FTL)',          desc: 'Dedicated trucks for large shipments (24,000+ lbs). Best for time-sensitive, high-volume freight across the country.' },
            { name: 'Less-Than-Truckload (LTL)',     desc: 'Share truck space for smaller loads (150 – 24,000 lbs). Cost-effective when you don\'t need a full trailer.' },
            { name: 'Expedited Shipping',            desc: 'Priority freight for time-critical deliveries. Guaranteed pick-up and delivery windows with real-time updates.' },
            { name: 'Intermodal / Rail',             desc: 'Combines truck and rail transport for long-haul shipments. Lower cost and reduced carbon footprint.' },
            { name: 'Warehousing & Distribution',   desc: 'Short and long-term storage, fulfillment, cross-docking, and inventory management from our Georgia facility.' },
        ],
        faqs: [
            {
                keywords: ['track', 'tracking', 'where is', 'shipment status', 'order status'],
                answer: 'You can track your shipment in real time on our <a href="tracking.html" style="color:#ff9900">Tracking page</a>. Just enter your KEM tracking number (starts with KEM…). Need help? Call <a href="tel:+14708363519" style="color:#ff9900">1-470-836-3519</a>.',
            },
            {
                keywords: ['quote', 'price', 'cost', 'rate', 'how much', 'pricing'],
                answer: 'Get a free instant quote on our <a href="quote.html" style="color:#ff9900">Quote page</a>. Fill in your origin, destination, weight, and service type and we\'ll give you a competitive rate right away.',
            },
            {
                keywords: ['ftl', 'full truckload', 'full truck'],
                answer: '<strong>Full Truckload (FTL)</strong> — A dedicated truck for your freight. Ideal for loads of 24,000 lbs or more, or when you need guaranteed space and faster transit. We cover all 48 contiguous states.',
            },
            {
                keywords: ['ltl', 'less than truckload', 'less-than-truckload', 'partial load'],
                answer: '<strong>Less-Than-Truckload (LTL)</strong> — Share truck space with other shippers for loads between 150 – 24,000 lbs. A cost-effective option when you don\'t need the full trailer.',
            },
            {
                keywords: ['expedited', 'urgent', 'rush', 'same day', 'next day', 'emergency'],
                answer: '<strong>Expedited Shipping</strong> — We handle time-critical freight with guaranteed pick-up windows and real-time tracking. Call us directly at <a href="tel:+14708363519" style="color:#ff9900">1-470-836-3519</a> for same-day arrangements.',
            },
            {
                keywords: ['intermodal', 'rail', 'train'],
                answer: '<strong>Intermodal / Rail</strong> — We combine truck and rail transport for long-distance shipments, reducing costs by up to 20% compared to over-the-road only. Great for coast-to-coast freight.',
            },
            {
                keywords: ['warehouse', 'storage', 'distribution', 'fulfillment', 'inventory'],
                answer: '<strong>Warehousing & Distribution</strong> — Our Buford, GA facility offers short and long-term storage, pick-and-pack fulfillment, cross-docking, and inventory management.',
            },
            {
                keywords: ['contact', 'phone', 'call', 'email', 'reach', 'address', 'location'],
                answer: `<strong>Contact KEM Logistics</strong><br>📞 <a href="tel:+14708363519" style="color:#ff9900">1-470-836-3519</a><br>✉️ <a href="mailto:admin.info@kemlogisticsnsolutions.com" style="color:#ff9900">admin.info@kemlogisticsnsolutions.com</a><br>📍 972 Holly Meadow Dr, Buford, GA 30518`,
            },
            {
                keywords: ['hours', 'open', 'business hours', 'when', 'available'],
                answer: 'Our office is open <strong>Monday – Friday, 8 AM – 6 PM EST</strong>. Emergency freight support is available <strong>24/7</strong>. Call <a href="tel:+14708363519" style="color:#ff9900">1-470-836-3519</a> anytime.',
            },
            {
                keywords: ['area', 'coverage', 'states', 'where', 'deliver', 'nationwide', 'national'],
                answer: 'We provide <strong>nationwide coverage across all 48 contiguous U.S. states</strong>. Our network of carriers ensures reliable pick-up and delivery coast to coast.',
            },
            {
                keywords: ['about', 'who are you', 'company', 'kem', 'what do you do'],
                answer: '<strong>KEM Logistics & Solutions LLC</strong> is a full-service freight brokerage and logistics company based in Buford, GA. We connect shippers with a vetted carrier network for FTL, LTL, expedited, intermodal, and warehousing services nationwide.',
            },
            {
                keywords: ['insurance', 'liability', 'damage', 'claim', 'lost'],
                answer: 'All shipments moved through KEM Logistics are covered by carrier liability. For high-value freight, we recommend additional cargo insurance. Contact us to discuss coverage options for your specific shipment.',
            },
            {
                keywords: ['transit time', 'how long', 'delivery time', 'eta'],
                answer: 'Transit times vary by route and service type:<br>• <strong>FTL</strong>: 1–5 days nationwide<br>• <strong>LTL</strong>: 2–7 business days<br>• <strong>Expedited</strong>: Same-day to 48 hours<br>• <strong>Intermodal</strong>: 3–10 days<br>Get an accurate ETA with a <a href="quote.html" style="color:#ff9900">free quote</a>.',
            },
        ],
        quickReplies: [
            { label: '🚚  Our Services',        msg: 'What services do you offer?' },
            { label: '💰  Get a Quote',          msg: 'How do I get a quote?' },
            { label: '📦  Track a Shipment',     msg: 'How do I track my shipment?' },
            { label: '📞  Contact Us',           msg: 'How can I contact you?' },
            { label: '⏱  Transit Times',        msg: 'How long does delivery take?' },
            { label: '🏢  About KEM',            msg: 'Tell me about your company.' },
        ],
    };

    // ── Find best FAQ match ───────────────────────────────────────────────────
    function findAnswer(input) {
        const q = input.toLowerCase();
        let bestMatch = null, bestScore = 0;
        KB.faqs.forEach(faq => {
            const score = faq.keywords.filter(kw => q.includes(kw)).length;
            if (score > bestScore) { bestScore = score; bestMatch = faq; }
        });
        return bestScore > 0 ? bestMatch.answer : null;
    }

    function allServicesHtml() {
        return KB.services.map(s =>
            `<div style="margin-bottom:0.75rem"><strong style="color:#232f3e">${s.name}</strong><br><span style="color:#555;font-size:0.85rem">${s.desc}</span></div>`
        ).join('') +
        `<br><a href="quote.html" style="color:#ff9900;font-weight:700">→ Get a free quote</a>`;
    }

    // ── Inject CSS ────────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        #kem-chat-btn {
            position: fixed; bottom: 2rem; right: 2rem;
            width: 58px; height: 58px; border-radius: 50%;
            background: #ff9900; border: none; cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            display: flex; align-items: center; justify-content: center;
            z-index: 9000; transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        #kem-chat-btn:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(0,0,0,0.3); }
        #kem-chat-btn svg { pointer-events: none; }

        #kem-chat-badge {
            position: absolute; top: -4px; right: -4px;
            width: 18px; height: 18px; background: #e53935;
            border-radius: 50%; font-size: 10px; font-weight: 700;
            color: white; display: flex; align-items: center;
            justify-content: center; border: 2px solid white;
        }

        #kem-chat-panel {
            position: fixed; bottom: 6.5rem; right: 2rem; width: 360px;
            background: #fff; border-radius: 16px;
            box-shadow: 0 8px 40px rgba(0,0,0,0.18);
            z-index: 9001; display: none; flex-direction: column;
            overflow: hidden; font-family: inherit; max-height: 580px;
        }
        #kem-chat-panel.open { display: flex; }

        #kem-chat-header {
            background: linear-gradient(135deg, #232f3e 0%, #1a2b3c 100%);
            color: white; padding: 1rem 1.25rem;
            display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;
        }
        .chat-avatar {
            width: 40px; height: 40px; border-radius: 50%;
            background: #ff9900; display: flex; align-items: center;
            justify-content: center; font-weight: 700; font-size: 0.95rem;
            flex-shrink: 0; color: #232f3e;
        }
        .chat-info h4 { margin: 0 0 2px; font-size: 0.95rem; color: white; }
        .chat-info span {
            font-size: 0.75rem; color: #ff9900;
            display: flex; align-items: center; gap: 4px;
        }
        .chat-info span::before {
            content: ''; width: 7px; height: 7px;
            background: #4caf50; border-radius: 50%; display: inline-block;
        }
        #kem-chat-close {
            margin-left: auto; background: none; border: none;
            color: rgba(255,255,255,0.7); font-size: 1.4rem;
            cursor: pointer; line-height: 1; padding: 0 0 0 0.5rem;
        }
        #kem-chat-close:hover { color: white; }

        #kem-chat-messages {
            flex: 1; overflow-y: auto; padding: 1rem 1rem 0.5rem;
            display: flex; flex-direction: column; gap: 0.75rem;
        }

        .msg-bot, .msg-user {
            max-width: 88%; font-size: 0.875rem; line-height: 1.55;
            padding: 0.65rem 0.9rem; border-radius: 12px;
            word-break: break-word;
        }
        .msg-bot {
            background: #f0f4f8; color: #333;
            border-radius: 4px 12px 12px 12px; align-self: flex-start;
        }
        .msg-user {
            background: #ff9900; color: #232f3e; font-weight: 600;
            border-radius: 12px 12px 4px 12px; align-self: flex-end;
        }
        .msg-bot a { color: #ff9900; }

        .chat-quick-replies {
            display: flex; flex-wrap: wrap; gap: 0.5rem;
            padding: 0.25rem 0 0.5rem; align-self: flex-start;
        }
        .chat-qr-btn {
            background: white; border: 1.5px solid #ff9900;
            color: #ff9900; border-radius: 20px;
            padding: 0.3rem 0.75rem; font-size: 0.78rem;
            font-weight: 600; cursor: pointer;
            transition: background 0.15s, color 0.15s;
            font-family: inherit;
        }
        .chat-qr-btn:hover { background: #ff9900; color: #232f3e; }

        .chat-typing {
            display: flex; gap: 4px; align-items: center;
            padding: 0.6rem 0.9rem; background: #f0f4f8;
            border-radius: 4px 12px 12px 12px;
            align-self: flex-start; width: fit-content;
        }
        .chat-typing span {
            width: 7px; height: 7px; background: #aaa;
            border-radius: 50%; animation: typing-dot 1.2s infinite;
        }
        .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
        .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing-dot {
            0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
            40% { transform: scale(1.3); opacity: 1; }
        }

        #kem-chat-input-row {
            display: flex; gap: 0.5rem; padding: 0.75rem 1rem;
            border-top: 1px solid #eee; background: #fff; flex-shrink: 0;
        }
        #kem-chat-input {
            flex: 1; padding: 0.55rem 0.85rem;
            border: 1.5px solid #ddd; border-radius: 20px;
            font-size: 0.875rem; font-family: inherit; outline: none;
            transition: border-color 0.2s;
        }
        #kem-chat-input:focus { border-color: #ff9900; }
        #kem-chat-send {
            width: 36px; height: 36px; border-radius: 50%;
            background: #ff9900; border: none; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; transition: opacity 0.2s;
        }
        #kem-chat-send:hover { opacity: 0.85; }

        #kem-chat-footer {
            padding: 0.45rem 1rem; text-align: center;
            font-size: 0.7rem; color: #bbb;
            border-top: 1px solid #f0f0f0; background: #fafafa; flex-shrink: 0;
        }
        #kem-chat-footer a { color: #bbb; }

        @media (max-width: 480px) {
            #kem-chat-panel { right: 0.75rem; left: 0.75rem; width: auto; bottom: 5.5rem; }
            #kem-chat-btn  { bottom: 1.25rem; right: 1.25rem; }
        }
    `;
    document.head.appendChild(style);

    // ── Inject HTML ───────────────────────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <button id="kem-chat-btn" aria-label="Open chat" title="Chat with us">
            <svg id="kem-icon-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#232f3e" stroke-width="2.2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <svg id="kem-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#232f3e" stroke-width="2.5" style="display:none">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span id="kem-chat-badge">1</span>
        </button>

        <div id="kem-chat-panel" role="dialog" aria-label="KEM Logistics chat">
            <div id="kem-chat-header">
                <div class="chat-avatar">KEM</div>
                <div class="chat-info">
                    <h4>KEM Logistics Support</h4>
                    <span>Online now</span>
                </div>
                <button id="kem-chat-close" aria-label="Close chat">&times;</button>
            </div>

            <div id="kem-chat-messages"></div>

            <div id="kem-chat-input-row">
                <input id="kem-chat-input" type="text" placeholder="Ask a question…" autocomplete="off">
                <button id="kem-chat-send" aria-label="Send">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#232f3e" stroke-width="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>

            <div id="kem-chat-footer">Powered by <a href="index.html">KEM Logistics & Solutions</a></div>
        </div>
    `;
    document.body.appendChild(wrapper);

    // ── Chat Logic ────────────────────────────────────────────────────────────
    const btn      = document.getElementById('kem-chat-btn');
    const panel    = document.getElementById('kem-chat-panel');
    const closeBtn = document.getElementById('kem-chat-close');
    const badge    = document.getElementById('kem-chat-badge');
    const messages = document.getElementById('kem-chat-messages');
    const input    = document.getElementById('kem-chat-input');
    const send     = document.getElementById('kem-chat-send');
    const iconChat  = document.getElementById('kem-icon-chat');
    const iconClose = document.getElementById('kem-icon-close');

    let greeted = false;

    function scrollBottom() {
        messages.scrollTop = messages.scrollHeight;
    }

    function addBubble(html, type) {
        const div = document.createElement('div');
        div.className = type === 'user' ? 'msg-user' : 'msg-bot';
        div.innerHTML = html;
        messages.appendChild(div);
        scrollBottom();
        return div;
    }

    function addQuickReplies(replies) {
        const row = document.createElement('div');
        row.className = 'chat-quick-replies';
        replies.forEach(r => {
            const btn = document.createElement('button');
            btn.className = 'chat-qr-btn';
            btn.textContent = r.label;
            btn.addEventListener('click', () => {
                row.remove();
                handleUserMessage(r.msg);
            });
            row.appendChild(btn);
        });
        messages.appendChild(row);
        scrollBottom();
    }

    function showTyping(ms) {
        return new Promise(resolve => {
            const dot = document.createElement('div');
            dot.className = 'chat-typing';
            dot.innerHTML = '<span></span><span></span><span></span>';
            messages.appendChild(dot);
            scrollBottom();
            setTimeout(() => { dot.remove(); resolve(); }, ms);
        });
    }

    async function botReply(html, delay, quickReplies) {
        await showTyping(delay || 700);
        addBubble(html, 'bot');
        if (quickReplies) addQuickReplies(quickReplies);
    }

    function greet() {
        if (greeted) return;
        greeted = true;
        addBubble(
            `Hi there! 👋 I'm the <strong>KEM Logistics</strong> virtual assistant. I can answer questions about our services, rates, tracking, and more — or connect you to our team. What can I help you with?`,
            'bot'
        );
        addQuickReplies(KB.quickReplies);
    }

    async function handleUserMessage(text) {
        const q = text.trim();
        if (!q) return;
        addBubble(q, 'user');

        // Remove lingering quick-reply rows
        document.querySelectorAll('.chat-quick-replies').forEach(el => el.remove());

        const lower = q.toLowerCase();

        // "All services" intent
        if (lower.includes('service') && (lower.includes('all') || lower.includes('what') || lower.includes('offer') || lower.includes('list'))) {
            await botReply(allServicesHtml(), 800, [
                { label: '💰 Get a Quote', msg: 'How do I get a quote?' },
                { label: '📞 Talk to Someone', msg: 'I want to talk to a person.' },
            ]);
            return;
        }

        // "Human / agent" intent
        if (['human', 'person', 'agent', 'representative', 'speak', 'talk to'].some(w => lower.includes(w))) {
            await botReply(
                `Of course! Here's how to reach our team:<br><br>📞 <a href="tel:+14708363519"><strong>1-470-836-3519</strong></a><br>✉️ <a href="mailto:admin.info@kemlogisticsnsolutions.com">admin.info@kemlogisticsnsolutions.com</a><br><br>Hours: <strong>Mon–Fri, 8 AM – 6 PM EST</strong> · Emergency: 24/7`,
                700
            );
            return;
        }

        // FAQ match
        const answer = findAnswer(lower);
        if (answer) {
            await botReply(answer, 700, [
                { label: '🔙 Main Menu', msg: 'show menu' },
                { label: '📞 Contact Us', msg: 'How can I contact you?' },
            ]);
            return;
        }

        // Main menu request
        if (lower.includes('menu') || lower.includes('help') || lower.includes('start') || lower.includes('hi') || lower.includes('hello')) {
            await botReply('Here\'s what I can help you with:', 400);
            addQuickReplies(KB.quickReplies);
            return;
        }

        // Fallback
        await botReply(
            `I'm not sure about that one. Let me connect you with our team for a precise answer:<br><br>📞 <a href="tel:+14708363519"><strong>1-470-836-3519</strong></a><br>✉️ <a href="mailto:admin.info@kemlogisticsnsolutions.com">admin.info@kemlogisticsnsolutions.com</a>`,
            800,
            [
                { label: '🔙 Main Menu', msg: 'show menu' },
                { label: '🚚 Our Services', msg: 'What services do you offer?' },
            ]
        );
    }

    function openChat() {
        panel.classList.add('open');
        badge.style.display = 'none';
        iconChat.style.display  = 'none';
        iconClose.style.display = 'block';
        greet();
        input.focus();
    }

    function closeChat() {
        panel.classList.remove('open');
        iconChat.style.display  = 'block';
        iconClose.style.display = 'none';
    }

    btn.addEventListener('click', () => panel.classList.contains('open') ? closeChat() : openChat());
    closeBtn.addEventListener('click', closeChat);
    document.addEventListener('click', e => { if (!panel.contains(e.target) && e.target !== btn) closeChat(); });

    send.addEventListener('click', () => { handleUserMessage(input.value); input.value = ''; });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { handleUserMessage(input.value); input.value = ''; } });

})();
