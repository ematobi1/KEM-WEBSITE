'use strict';

(function () {
    // ── Inject CSS ────────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        #kem-chat-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 58px;
            height: 58px;
            border-radius: 50%;
            background: #ff9900;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9000;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        #kem-chat-btn:hover {
            transform: scale(1.08);
            box-shadow: 0 6px 28px rgba(0,0,0,0.3);
        }
        #kem-chat-btn svg { pointer-events: none; }

        #kem-chat-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 18px;
            height: 18px;
            background: #e53935;
            border-radius: 50%;
            font-size: 10px;
            font-weight: 700;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
        }

        #kem-chat-panel {
            position: fixed;
            bottom: 6.5rem;
            right: 2rem;
            width: 340px;
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 8px 40px rgba(0,0,0,0.18);
            z-index: 9001;
            display: none;
            flex-direction: column;
            overflow: hidden;
            font-family: inherit;
            max-height: 560px;
        }
        #kem-chat-panel.open { display: flex; }

        #kem-chat-header {
            background: linear-gradient(135deg, #232f3e 0%, #1a2b3c 100%);
            color: white;
            padding: 1rem 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        #kem-chat-header .chat-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #ff9900;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1rem;
            flex-shrink: 0;
            color: #232f3e;
        }
        #kem-chat-header .chat-info h4 {
            margin: 0 0 2px;
            font-size: 0.95rem;
            color: white;
        }
        #kem-chat-header .chat-info span {
            font-size: 0.75rem;
            color: #ff9900;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        #kem-chat-header .chat-info span::before {
            content: '';
            width: 7px;
            height: 7px;
            background: #4caf50;
            border-radius: 50%;
            display: inline-block;
        }
        #kem-chat-close {
            margin-left: auto;
            background: none;
            border: none;
            color: rgba(255,255,255,0.7);
            font-size: 1.4rem;
            cursor: pointer;
            line-height: 1;
            padding: 0 0 0 0.5rem;
        }
        #kem-chat-close:hover { color: white; }

        #kem-chat-body {
            padding: 1.25rem;
            overflow-y: auto;
            flex: 1;
        }
        .chat-bubble {
            background: #f0f4f8;
            border-radius: 0 12px 12px 12px;
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
            color: #333;
            line-height: 1.5;
            margin-bottom: 1.25rem;
            max-width: 90%;
        }
        .chat-bubble strong { display: block; margin-bottom: 0.25rem; font-size: 0.8rem; color: #888; }

        #kem-chat-form .chat-field {
            margin-bottom: 0.75rem;
        }
        #kem-chat-form label {
            display: block;
            font-size: 0.8rem;
            font-weight: 600;
            color: #555;
            margin-bottom: 0.3rem;
        }
        #kem-chat-form input,
        #kem-chat-form textarea {
            width: 100%;
            box-sizing: border-box;
            padding: 0.6rem 0.75rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 0.9rem;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
        }
        #kem-chat-form input:focus,
        #kem-chat-form textarea:focus { border-color: #ff9900; }
        #kem-chat-form textarea { resize: none; height: 80px; }

        #kem-chat-submit {
            width: 100%;
            padding: 0.7rem;
            background: #ff9900;
            color: #232f3e;
            font-weight: 700;
            font-size: 0.95rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: opacity 0.2s;
            margin-top: 0.25rem;
        }
        #kem-chat-submit:hover { opacity: 0.88; }
        #kem-chat-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        #kem-chat-success {
            text-align: center;
            padding: 1.5rem 1rem;
            display: none;
        }
        #kem-chat-success .success-icon {
            font-size: 2.5rem;
            margin-bottom: 0.75rem;
        }
        #kem-chat-success h4 { margin: 0 0 0.5rem; color: #232f3e; }
        #kem-chat-success p  { color: #666; font-size: 0.9rem; margin: 0; }

        #kem-chat-footer {
            padding: 0.6rem 1.25rem;
            text-align: center;
            font-size: 0.72rem;
            color: #aaa;
            border-top: 1px solid #f0f0f0;
            background: #fafafa;
        }
        #kem-chat-footer a { color: #aaa; }

        @media (max-width: 480px) {
            #kem-chat-panel {
                right: 1rem;
                left: 1rem;
                width: auto;
                bottom: 5.5rem;
            }
            #kem-chat-btn { bottom: 1.25rem; right: 1.25rem; }
        }
    `;
    document.head.appendChild(style);

    // ── Inject HTML ───────────────────────────────────────────────────────────
    const html = `
        <button id="kem-chat-btn" aria-label="Open chat" title="Chat with us">
            <svg id="kem-icon-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#232f3e" stroke-width="2.2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <svg id="kem-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#232f3e" stroke-width="2.5" style="display:none">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span id="kem-chat-badge">1</span>
        </button>

        <div id="kem-chat-panel" role="dialog" aria-label="Live chat">
            <div id="kem-chat-header">
                <div class="chat-avatar">KEM</div>
                <div class="chat-info">
                    <h4>KEM Logistics Support</h4>
                    <span>Online now</span>
                </div>
                <button id="kem-chat-close" aria-label="Close chat">&times;</button>
            </div>

            <div id="kem-chat-body">
                <div class="chat-bubble">
                    <strong>KEM Support</strong>
                    Hi there! 👋 How can we help you today? Send us a message and we'll get back to you shortly.
                </div>

                <form id="kem-chat-form">
                    <input type="hidden" name="access_key" value="cc3d43b2-a0c7-4524-ad65-7da59ecb4929">
                    <input type="hidden" name="subject" value="New Chat Message - KEM Logistics Website">
                    <input type="hidden" name="from_name" value="KEM Logistics Chat Widget">
                    <div class="chat-field">
                        <label for="chat-name">Your Name</label>
                        <input type="text" id="chat-name" name="name" placeholder="John Smith" required>
                    </div>
                    <div class="chat-field">
                        <label for="chat-email">Email Address</label>
                        <input type="email" id="chat-email" name="email" placeholder="you@example.com" required>
                    </div>
                    <div class="chat-field">
                        <label for="chat-message">Message</label>
                        <textarea id="chat-message" name="message" placeholder="How can we help you?" required></textarea>
                    </div>
                    <button type="submit" id="kem-chat-submit">Send Message</button>
                </form>

                <div id="kem-chat-success">
                    <div class="success-icon">✅</div>
                    <h4>Message Sent!</h4>
                    <p>We'll reply to your email within a few hours. For urgent matters call <a href="tel:+14708363519">1-470-836-3519</a>.</p>
                </div>
            </div>

            <div id="kem-chat-footer">
                Powered by <a href="index.html">KEM Logistics</a>
            </div>
        </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);

    // ── Logic ─────────────────────────────────────────────────────────────────
    const btn    = document.getElementById('kem-chat-btn');
    const panel  = document.getElementById('kem-chat-panel');
    const close  = document.getElementById('kem-chat-close');
    const badge  = document.getElementById('kem-chat-badge');
    const form   = document.getElementById('kem-chat-form');
    const submit = document.getElementById('kem-chat-submit');
    const iconChat  = document.getElementById('kem-icon-chat');
    const iconClose = document.getElementById('kem-icon-close');
    const success   = document.getElementById('kem-chat-success');

    function openChat() {
        panel.classList.add('open');
        badge.style.display = 'none';
        iconChat.style.display  = 'none';
        iconClose.style.display = 'block';
        document.getElementById('chat-name').focus();
    }

    function closeChat() {
        panel.classList.remove('open');
        iconChat.style.display  = 'block';
        iconClose.style.display = 'none';
    }

    btn.addEventListener('click', () => panel.classList.contains('open') ? closeChat() : openChat());
    close.addEventListener('click', closeChat);

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== btn) closeChat();
    });

    // Form submit via Web3Forms
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submit.textContent = 'Sending...';
        submit.disabled = true;

        try {
            const data = new FormData(form);
            const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
            const json = await res.json();

            if (json.success) {
                form.style.display    = 'none';
                success.style.display = 'block';
            } else {
                throw new Error('Submission failed');
            }
        } catch {
            submit.textContent = 'Send Message';
            submit.disabled = false;
            alert('Could not send message. Please call us at 1-470-836-3519.');
        }
    });
})();
