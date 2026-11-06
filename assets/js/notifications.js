// ============================================================
// notifications.js – Domtom Connect
// Système de notification globale en temps réel (messages)
// ============================================================

(function () {
    'use strict';

    const STORAGE_KEY = 'dc_unread_count';
    let _notifChannel = null;
    let _userId = null;

    // ── Inject global CSS ──────────────────────────────────────
    function injectStyles() {
        if (document.getElementById('dc-notif-styles')) return;
        const style = document.createElement('style');
        style.id = 'dc-notif-styles';
        style.textContent = `
            /* Badge on nav */
            .dc-msg-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 18px;
                height: 18px;
                padding: 0 5px;
                background: #ef4444;
                color: white;
                border-radius: 100px;
                font-size: 0.65rem;
                font-weight: 800;
                line-height: 1;
                position: absolute;
                top: -6px;
                right: -8px;
                box-shadow: 0 2px 6px rgba(239,68,68,0.5);
                animation: dc-badge-pop 0.3s cubic-bezier(0.68,-0.55,0.27,1.55);
                pointer-events: none;
                z-index: 9999;
            }
            .dc-msg-badge.hidden { display: none; }

            @keyframes dc-badge-pop {
                from { transform: scale(0); }
                to   { transform: scale(1); }
            }

            /* Toast notification */
            #dc-toast-container {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            }
            .dc-toast {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                background: #0e1311;
                color: white;
                border-radius: 16px;
                padding: 16px 18px;
                min-width: 300px;
                max-width: 380px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                cursor: pointer;
                pointer-events: all;
                animation: dc-slide-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
                position: relative;
                border: 1px solid rgba(255,255,255,0.05);
            }
            .dc-toast.dc-toast-out {
                animation: dc-slide-out 0.3s ease forwards;
            }
            .dc-toast-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(16,185,129,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .dc-toast-body { flex: 1; }
            .dc-toast-title {
                font-size: 0.85rem;
                font-weight: 700;
                margin: 0 0 3px 0;
                color: white;
            }
            .dc-toast-msg {
                font-size: 0.78rem;
                color: rgba(255,255,255,0.6);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 220px;
            }
            .dc-toast-close {
                position: absolute;
                top: 10px;
                right: 12px;
                background: none;
                border: none;
                color: rgba(255,255,255,0.3);
                font-size: 1rem;
                cursor: pointer;
                line-height: 1;
                padding: 0;
            }
            .dc-toast-close:hover { color: white; }

            @keyframes dc-slide-in {
                from { opacity: 0; transform: translateX(100%); }
                to   { opacity: 1; transform: translateX(0); }
            }
            @keyframes dc-slide-out {
                from { opacity: 1; transform: translateX(0); }
                to   { opacity: 0; transform: translateX(100%); }
            }

            /* Sidebar badge (for mon-espace sidebar) */
            .sidebar-notif-dot {
                width: 8px;
                height: 8px;
                background: #ef4444;
                border-radius: 50%;
                display: inline-block;
                box-shadow: 0 0 0 2px rgba(239,68,68,0.3);
                flex-shrink: 0;
            }
        `;
        document.head.appendChild(style);
    }

    // ── Toast container ────────────────────────────────────────
    function getToastContainer() {
        let el = document.getElementById('dc-toast-container');
        if (!el) {
            el = document.createElement('div');
            el.id = 'dc-toast-container';
            document.body.appendChild(el);
        }
        return el;
    }

    // ── Show toast notification ────────────────────────────────
    function showToast(senderName, messagePreview) {
        const container = getToastContainer();
        const toast = document.createElement('div');
        toast.className = 'dc-toast';
        toast.innerHTML = `
            <div class="dc-toast-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            </div>
            <div class="dc-toast-body">
                <p class="dc-toast-title">Nouveau message de ${escapeHtml(senderName)}</p>
                <p class="dc-toast-msg">${escapeHtml(messagePreview)}</p>
            </div>
            <button class="dc-toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        toast.addEventListener('click', (e) => {
            if (e.target.classList.contains('dc-toast-close')) return;
            window.location.href = 'mon-espace.html#messages';
        });

        container.appendChild(toast);

        // Auto-dismiss after 6s
        setTimeout(() => {
            if (!toast.parentElement) return;
            toast.classList.add('dc-toast-out');
            setTimeout(() => toast.remove(), 320);
        }, 6000);

        // Play subtle notification sound (if supported)
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        } catch (_) {}
    }

    // ── Unread count management ────────────────────────────────
    function getUnreadCount() {
        return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    }

    function incrementUnread() {
        const count = getUnreadCount() + 1;
        localStorage.setItem(STORAGE_KEY, count);
        updateBadge(count);
        updateSidebarDot(true);
        return count;
    }

    function resetUnread() {
        localStorage.setItem(STORAGE_KEY, '0');
        updateBadge(0);
        updateSidebarDot(false);
    }

    // ── Update nav badge ───────────────────────────────────────
    function updateBadge(count) {
        // Find or create badge on "Mon Espace" button in nav
        const monEspaceLinks = document.querySelectorAll('a[href="/mon-espace"]');
        monEspaceLinks.forEach(link => {
            if (!link.style.position || link.style.position === 'static') {
                link.style.position = 'relative';
            }
            let badge = link.querySelector('.dc-msg-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'dc-msg-badge';
                link.appendChild(badge);
            }
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        });
    }

    // ── Update sidebar dot for messages ───────────────────────
    function updateSidebarDot(show) {
        // On dashboard pages, find the messages sidebar link
        const msgLinks = document.querySelectorAll('a[href="/messages"], a[href="../messages"], a.sidebar-link[href*="messages"]');
        msgLinks.forEach(link => {
            let dot = link.querySelector('.sidebar-notif-dot');
            if (show) {
                if (!dot) {
                    dot = document.createElement('span');
                    dot.className = 'sidebar-notif-dot';
                    link.appendChild(dot);
                }
            } else {
                if (dot) dot.remove();
            }
        });
    }

    // ── Fetch sender name from profiles ─────────────────────
    async function getSenderName(senderId) {
        try {
            const { data } = await window._supabase
                .from('profiles')
                .select('full_name')
                .eq('id', senderId)
                .single();
            return data?.full_name || 'Quelqu\'un';
        } catch (_) {
            return 'Quelqu\'un';
        }
    }

    // ── Get all user conversations ────────────────────────────
    async function getUserConversationIds(userId) {
        try {
            const { data } = await window._supabase
                .from('conversation_participants')
                .select('conversation_id')
                .eq('user_id', userId);
            return data ? data.map(c => c.conversation_id) : [];
        } catch (_) {
            return [];
        }
    }

    // ── Start global real-time subscription ───────────────────
    async function startNotificationSubscription(userId) {
        if (_notifChannel) {
            window._supabase.removeChannel(_notifChannel);
        }

        const convIds = await getUserConversationIds(userId);
        if (!convIds.length) return;

        // Subscribe to all messages in user's conversations
        _notifChannel = window._supabase
            .channel('dc_global_notifications_' + userId)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages'
            }, async (payload) => {
                const msg = payload.new;
                // Ignore if not in user's conversation or sent by self
                if (msg.sender_id === userId) return;
                if (!convIds.includes(msg.conversation_id)) return;

                // Skip if user is currently on the messages page and viewing this conv
                const onMessagesPage = window.location.pathname.includes('messages') ||
                    window.location.hash.includes('messages');
                if (onMessagesPage) return;

                const senderName = await getSenderName(msg.sender_id);
                const preview = msg.content || '';

                incrementUnread();
                showToast(senderName, preview);
            })
            .subscribe();
    }

    // ── Reset counter when user visits /messages ──────────────
    function setupAutoReset() {
        const checkReset = () => {
            const onMessagesPage = window.location.pathname.includes('messages') ||
                window.location.hash.includes('messages');
            if (onMessagesPage) {
                resetUnread();
            }
        };

        checkReset();
        window.addEventListener('hashchange', checkReset);
    }

    // ── Escape HTML ─────────────────────────────────────────
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ── Init ───────────────────────────────────────────────────
    async function init() {
        // Wait for auth.js globals
        if (typeof window._supabase === 'undefined' || typeof getSession === 'undefined') {
            setTimeout(init, 300);
            return;
        }

        injectStyles();
        setupAutoReset();

        const session = await getSession();
        if (!session) return;

        _userId = session.user.id;

        // Restore badge from localStorage
        const savedCount = getUnreadCount();
        if (savedCount > 0) {
            // Small delay to let navbar render
            setTimeout(() => {
                updateBadge(savedCount);
                updateSidebarDot(true);
            }, 500);
        }

        await startNotificationSubscription(_userId);

        // Re-check convs periodically in case new conversations started
        setInterval(async () => {
            if (_userId) await startNotificationSubscription(_userId);
        }, 60000);
    }

    // ── Expose API globally ────────────────────────────────────
    window.dcNotifications = {
        reset: resetUnread,
        getCount: getUnreadCount,
        show: showToast
    };

    // Start when DOM + scripts are ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();
