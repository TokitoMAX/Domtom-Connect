// Admin Dashboard for Leads Tracking

const ADMIN_PASSWORD = 'domtom2025'; // À changer en production

let allLeads = [];
let filteredLeads = [];

// Vérifier le mot de passe
function checkPassword() {
    const password = document.getElementById('admin-password').value;
    const errorMsg = document.getElementById('login-error');
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'block';
        loadLeads();
    } else {
        errorMsg.style.display = 'block';
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 3000);
    }
}

// Charger les leads depuis localStorage
function loadLeads() {
    const leadsData = localStorage.getItem('domtom_leads');
    allLeads = leadsData ? JSON.parse(leadsData) : [];
    filteredLeads = [...allLeads].reverse(); // Plus récents en premier
    updateStats();
    displayLeads();
}

// Mettre à jour les statistiques
function updateStats() {
    const total = allLeads.length;
    const quiz = allLeads.filter(l => l.source === 'quiz').length;
    const popup = allLeads.filter(l => l.source === 'exit-intent-popup').length;
    const landing = allLeads.filter(l => l.source && l.source.includes('landing')).length;
    
    document.getElementById('total-leads').textContent = total;
    document.getElementById('quiz-leads').textContent = quiz;
    document.getElementById('popup-leads').textContent = popup;
    document.getElementById('landing-leads').textContent = landing;
}

// Afficher les leads dans le tableau
function displayLeads() {
    const tbody = document.getElementById('leads-tbody');
    const noLeads = document.getElementById('no-leads');
    
    if (filteredLeads.length === 0) {
        tbody.innerHTML = '';
        noLeads.style.display = 'block';
        return;
    }
    
    noLeads.style.display = 'none';
    
    tbody.innerHTML = filteredLeads.map(lead => {
        const date = new Date(lead.timestamp);
        const dateStr = date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <tr>
                <td>${dateStr}</td>
                <td><span class="badge badge-${getSourceBadgeClass(lead.source)}">${formatSource(lead.source)}</span></td>
                <td>${lead.type || lead.profil || '-'}</td>
                <td>${lead.email || '-'}</td>
                <td>${lead.action || '-'}</td>
                <td>${lead.page || '-'}</td>
            </tr>
        `;
    }).join('');
}

// Formater la source pour l'affichage
function formatSource(source) {
    const sources = {
        'quiz': 'Quiz',
        'exit-intent-popup': 'Popup Exit',
        'landing-prestataires': 'Landing Prestataires',
        'landing-porteurs-projets': 'Landing Porteurs',
        'landing-entreprises': 'Landing Entreprises',
        'page-view': 'Vue de page'
    };
    return sources[source] || source;
}

// Obtenir la classe CSS pour le badge de source
function getSourceBadgeClass(source) {
    if (source === 'quiz') return 'primary';
    if (source === 'exit-intent-popup') return 'success';
    if (source && source.includes('landing')) return 'warning';
    return 'secondary';
}

// Appliquer les filtres
function applyFilters() {
    const sourceFilter = document.getElementById('filter-source').value;
    const typeFilter = document.getElementById('filter-type').value;
    const dateFilter = document.getElementById('filter-date').value;
    
    filteredLeads = allLeads.filter(lead => {
        if (sourceFilter && lead.source !== sourceFilter) return false;
        if (typeFilter && lead.type !== typeFilter && lead.profil !== typeFilter) return false;
        if (dateFilter) {
            const leadDate = new Date(lead.timestamp).toISOString().split('T')[0];
            if (leadDate !== dateFilter) return false;
        }
        return true;
    }).reverse();
    
    displayLeads();
}

// Réinitialiser les filtres
function clearFilters() {
    document.getElementById('filter-source').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-date').value = '';
    filteredLeads = [...allLeads].reverse();
    displayLeads();
}

// Exporter en JSON
function exportJSON() {
    const dataStr = JSON.stringify(filteredLeads.length > 0 ? filteredLeads : allLeads, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `domtom-leads-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Exporter en CSV
function exportCSV() {
    const leads = filteredLeads.length > 0 ? filteredLeads : allLeads;
    
    if (leads.length === 0) {
        alert('Aucune donnée à exporter');
        return;
    }
    
    const headers = ['Date', 'Source', 'Type', 'Email', 'Action', 'Page', 'Score', 'Timestamp'];
    const rows = leads.map(lead => {
        const date = new Date(lead.timestamp);
        return [
            date.toLocaleString('fr-FR'),
            lead.source || '',
            lead.type || lead.profil || '',
            lead.email || '',
            lead.action || '',
            lead.page || '',
            lead.score || lead.qualification_score || '',
            lead.timestamp || ''
        ];
    });
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `domtom-leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// Effacer toutes les données
function clearData() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données de tracking ? Cette action est irréversible.')) {
        localStorage.removeItem('domtom_leads');
        allLeads = [];
        filteredLeads = [];
        updateStats();
        displayLeads();
        alert('Données effacées avec succès');
    }
}

// Permettre l'accès avec Enter
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('admin-password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }
});

