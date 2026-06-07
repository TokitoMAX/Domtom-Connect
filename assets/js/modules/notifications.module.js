/**
 * NotifSystem – Notifications In-App pour Domtom Connect
 * Cloche avec badge rouge + panneau déroulant + realtime Supabase
 */
window.NotifSystem = {
    db: null,
    userId: null,
    isOpen: false,
    realtimeChannel: null,

    // Initialiser le système (appelé après connexion)
    init: async function(supabaseClient, userId) {
        this.db = supabaseClient;
        this.userId = userId;

        await this.loadNotifications();
        this.subscribeRealtime();
        this.setupClickOutside();
    },

    // Charger les notifications depuis Supabase
    loadNotifications: async function() {
        if (!this.db || !this.userId) return;

        const { data, error } = await this.db
            .from('notifications')
            .select('*')
            .eq('user_id', this.userId)
            .order('created_at', { ascending: false })
            .limit(30);

        if (error) {
            console.warn('[NotifSystem] Erreur chargement:', error.message);
            return;
        }

        this.renderNotifications(data || []);
        this.updateBadge(data || []);
    },

    // Afficher les notifications dans le panneau
    renderNotifications: function(notifications) {
        const list = document.getElementById('notif-list');
        if (!list) return;

        if (!notifications.length) {
            list.innerHTML = `
                <div style="padding: 40px; text-align: center; color: #94a3b8;">
                    <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 12px; display: block; color: #10b981; opacity: 0.6;"></i>
                    <p style="margin: 0; font-size: 0.9rem; font-weight: 600;">Tout est à jour !</p>
                    <p style="margin: 8px 0 0; font-size: 0.8rem;">Vous n'avez aucune notification.</p>
                </div>`;
            return;
        }

        const icons = {
            'comment':          { icon: 'fa-comment', color: '#3b82f6' },
            'follower':         { icon: 'fa-user-plus', color: '#10b981' },
            'project_approved': { icon: 'fa-check-circle', color: '#10b981' },
            'contribution':     { icon: 'fa-hand-holding-heart', color: '#f59e0b' },
            'job_offer':        { icon: 'fa-briefcase', color: '#8b5cf6' },
            'mastermind':       { icon: 'fa-crown', color: '#fbbf24' },
        };

        list.innerHTML = notifications.map(n => {
            const ico = icons[n.type] || { icon: 'fa-bell', color: '#64748b' };
            const timeStr = this.timeAgo(n.created_at);
            const unreadStyle = n.is_read ? '' : 'background: rgba(16, 185, 129, 0.03); border-left: 4px solid #10b981;';
            const fontUnreadWeight = n.is_read ? '600' : '800';

            return `
                <div onclick="window.NotifSystem.handleClick('${n.id}', '${n.link || ''}')"
                     style="display: flex; gap: 16px; padding: 16px 24px; cursor: pointer; transition: all 0.2s ease; ${unreadStyle}"
                     onmouseover="this.style.background='rgba(241, 245, 249, 0.6)'; this.style.paddingLeft='28px';" onmouseout="this.style.background='${n.is_read ? '' : 'rgba(16, 185, 129, 0.03)'}'; this.style.paddingLeft='24px';">
                    <div style="width: 40px; height: 40px; border-radius: 12px; background: ${ico.color}10; color: ${ico.color}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1rem; border: 1px solid ${ico.color}20;">
                        <i class="fas ${ico.icon}"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <p style="margin: 0 0 3px; font-size: 0.875rem; font-weight: ${fontUnreadWeight}; color: #0f172a; line-height: 1.4; font-family: 'Plus Jakarta Sans', sans-serif;">${n.title}</p>
                        <p style="margin: 0 0 6px; font-size: 0.8rem; color: #475569; line-height: 1.4; font-family: 'Inter', sans-serif;">${n.message}</p>
                        <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;"><i class="far fa-clock" style="font-size:0.7rem;"></i> ${timeStr}</span>
                    </div>
                    ${!n.is_read ? '<div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; flex-shrink: 0; margin-top: 6px; box-shadow: 0 0 6px #10b981;"></div>' : ''}
                </div>
                <div style="height: 1px; background: #f1f5f9; margin: 0;"></div>
            `;
        }).join('');
    },

    // Mettre à jour le badge rouge
    updateBadge: function(notifications) {
        const badge = document.getElementById('notif-badge');
        if (!badge) return;

        const unreadCount = notifications.filter(n => !n.is_read).length;

        if (unreadCount > 0) {
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    },

    // Clic sur une notification → marquer lue + naviguer
    handleClick: async function(notifId, link) {
        // Marquer comme lue en base
        await this.db
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notifId)
            .eq('user_id', this.userId);

        // Fermer le panneau
        this.close();

        // Naviguer si un lien existe
        if (link && window.Router) {
            window.Router.navigate(link);
        }

        // Recharger les notifications
        await this.loadNotifications();
    },

    // Marquer tout comme lu
    markAllRead: async function() {
        if (!this.db || !this.userId) return;

        await this.db
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', this.userId)
            .eq('is_read', false);

        await this.loadNotifications();
    },

    // Ouvrir/Fermer le panneau
    toggle: function() {
        this.isOpen ? this.close() : this.open();
    },

    open: function() {
        const panel = document.getElementById('notif-panel');
        const btn   = document.getElementById('notif-bell-btn');
        if (!panel) return;

        panel.style.display = 'block';
        panel.style.animation = 'notifFadeIn 0.2s ease-out';
        if (btn) btn.style.background = '#e2e8f0';
        this.isOpen = true;

        // Recharger à l'ouverture
        this.loadNotifications();
    },

    close: function() {
        const panel = document.getElementById('notif-panel');
        const btn   = document.getElementById('notif-bell-btn');
        if (!panel) return;

        panel.style.display = 'none';
        if (btn) btn.style.background = '#f1f5f9';
        this.isOpen = false;
    },

    // Fermer si clic en dehors
    setupClickOutside: function() {
        document.addEventListener('click', (e) => {
            const wrapper = document.getElementById('notif-bell-wrapper');
            if (wrapper && !wrapper.contains(e.target) && this.isOpen) {
                this.close();
            }
        });
    },

    // Realtime : recevoir les nouvelles notifs instantanément
    subscribeRealtime: function() {
        if (!this.db || !this.userId) return;
        if (this.realtimeChannel) this.realtimeChannel.unsubscribe();

        this.realtimeChannel = this.db
            .channel(`notifications-${this.userId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${this.userId}`
            }, (payload) => {
                // Petite animation sur la cloche
                this.animateBell();
                // Recharger les notifs
                this.loadNotifications();
            })
            .subscribe();
    },

    // Animation de la cloche quand une notif arrive
    animateBell: function() {
        const btn = document.getElementById('notif-bell-btn');
        if (!btn) return;
        btn.style.animation = 'none';
        btn.offsetHeight; // Force reflow
        btn.style.animation = 'bellShake 0.5s ease-out';
    },

    // Utilitaire : temps relatif
    timeAgo: function(dateStr) {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins  = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days  = Math.floor(diff / 86400000);

        if (mins < 1)   return 'À l\'instant';
        if (mins < 60)  return `Il y a ${mins} min`;
        if (hours < 24) return `Il y a ${hours}h`;
        if (days < 7)   return `Il y a ${days}j`;
        return new Date(dateStr).toLocaleDateString('fr-FR');
    }
};

// Styles CSS pour les animations
(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes notifFadeIn {
            from { opacity: 0; transform: translateY(-8px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bellShake {
            0%  { transform: rotate(0deg); }
            20% { transform: rotate(-15deg); }
            40% { transform: rotate(15deg); }
            60% { transform: rotate(-10deg); }
            80% { transform: rotate(10deg); }
            100%{ transform: rotate(0deg); }
        }
        #notif-list::-webkit-scrollbar { width: 4px; }
        #notif-list::-webkit-scrollbar-track { background: transparent; }
        #notif-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
    `;
    document.head.appendChild(style);
})();
