/**
 * BookingSystem - Main JavaScript
 * Système de gestion de réservations
 */

// ==================== DATA STRUCTURES ====================

// Sample data - In production, this would come from a backend API
let resources = [
    {
        id: 1,
        name: 'Salle de Conférence A',
        category: 'salle',
        capacity: 50,
        description: 'Grande salle équipée pour conférences et présentations',
        pricing: 'horaire',
        price: 75.00,
        equipments: 'Projecteur, Tableau blanc, WiFi, Système audio',
        status: 'available',
        image: 'https://via.placeholder.com/300x200/2563eb/ffffff?text=Salle+A',
        openingHours: { start: '08:00', end: '18:00' },
        maintenanceSchedule: []
    },
    {
        id: 2,
        name: 'Salle de Réunion B',
        category: 'salle',
        capacity: 15,
        description: 'Salle idéale pour réunions d\'équipe',
        pricing: 'horaire',
        price: 40.00,
        equipments: 'Écran TV, Tableau blanc, WiFi',
        status: 'available',
        image: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Salle+B',
        openingHours: { start: '08:00', end: '20:00' },
        maintenanceSchedule: []
    },
    {
        id: 3,
        name: 'Projecteur HD',
        category: 'equipement',
        capacity: 1,
        description: 'Projecteur haute définition portable',
        pricing: 'forfait',
        price: 25.00,
        equipments: 'Câbles HDMI, Télécommande',
        status: 'available',
        image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Projecteur',
        openingHours: { start: '00:00', end: '23:59' },
        maintenanceSchedule: [
            { startDate: '2025-11-15', endDate: '2025-11-16', reason: 'Maintenance préventive' }
        ]
    },
    {
        id: 4,
        name: 'Véhicule de Service',
        category: 'vehicule',
        capacity: 5,
        description: 'Véhicule pour déplacements professionnels',
        pricing: 'horaire',
        price: 30.00,
        equipments: 'GPS, Climatisation',
        status: 'busy',
        image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Vehicule',
        openingHours: { start: '07:00', end: '19:00' },
        maintenanceSchedule: []
    }
];

let bookings = [
    {
        id: 1,
        resourceId: 1,
        resourceName: 'Salle de Conférence A',
        user: 'Marie Dubois',
        date: '2025-11-05',
        startTime: '09:00',
        endTime: '12:00',
        duration: 3,
        status: 'approved',
        notes: 'Présentation trimestrielle',
        recurring: false
    },
    {
        id: 2,
        resourceId: 2,
        resourceName: 'Salle de Réunion B',
        user: 'Jean Martin',
        date: '2025-11-05',
        startTime: '14:00',
        endTime: '16:00',
        duration: 2,
        status: 'pending',
        notes: 'Réunion d\'équipe',
        recurring: false
    },
    {
        id: 3,
        resourceId: 1,
        resourceName: 'Salle de Conférence A',
        user: 'Sophie Laurent',
        date: '2025-11-06',
        startTime: '10:00',
        endTime: '11:30',
        duration: 1.5,
        status: 'approved',
        notes: 'Formation interne',
        recurring: true
    }
];

let users = [
    { id: 1, name: 'Marie Dubois', email: 'marie.dubois@example.com', group: 'Admin', quota: 10, status: 'active' },
    { id: 2, name: 'Jean Martin', email: 'jean.martin@example.com', group: 'Utilisateur', quota: 5, status: 'active' },
    { id: 3, name: 'Sophie Laurent', email: 'sophie.laurent@example.com', group: 'Manager', quota: 8, status: 'active' }
];

let currentView = 'dashboard';
let currentMonth = new Date();
let editingBookingId = null;
let editingResourceId = null;

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupModals();
    setupForms();
    setupFilters();
    loadDashboard();
    updateStatistics();
    
    // Set today's date as default in booking form
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').value = today;
}

// ==================== NAVIGATION ====================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = link.getAttribute('data-view');
            switchView(viewName);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Quick action buttons
    document.getElementById('newBookingBtn')?.addEventListener('click', () => {
        switchView('reservations');
        openBookingModal();
    });

    document.getElementById('viewCalendarBtn')?.addEventListener('click', () => {
        switchView('calendar');
    });

    document.getElementById('manageResourcesBtn')?.addEventListener('click', () => {
        switchView('resources');
    });

    // Admin tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
            
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function switchView(viewName) {
    currentView = viewName;
    
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');
        
        // Load view-specific content
        switch(viewName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'reservations':
                loadBookings();
                break;
            case 'resources':
                loadResources();
                break;
            case 'calendar':
                renderCalendar();
                break;
            case 'admin':
                loadAdminData();
                break;
        }
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.classList.add('active');
        
        if (tabName === 'users') {
            loadUsersTable();
        } else if (tabName === 'approvals') {
            loadApprovals();
        }
    }
}

// ==================== DASHBOARD ====================

function loadDashboard() {
    updateStatistics();
    loadRecentActivity();
}

function updateStatistics() {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.date === today).length;
    const availableResources = resources.filter(r => r.status === 'available').length;
    const pendingApprovals = bookings.filter(b => b.status === 'pending').length;
    
    // Calculate monthly revenue
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = bookings
        .filter(b => {
            const bookingMonth = new Date(b.date).getMonth();
            return bookingMonth === currentMonth && b.status === 'approved';
        })
        .reduce((total, booking) => {
            const resource = resources.find(r => r.id === booking.resourceId);
            if (resource) {
                return total + (resource.price * booking.duration);
            }
            return total;
        }, 0);

    document.getElementById('todayBookings').textContent = todayBookings;
    document.getElementById('availableResources').textContent = availableResources;
    document.getElementById('pendingApprovals').textContent = pendingApprovals;
    document.getElementById('monthlyRevenue').textContent = monthlyRevenue.toFixed(2);
}

function loadRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    const recentBookings = [...bookings].sort((a, b) => b.id - a.id).slice(0, 5);
    
    if (recentBookings.length === 0) {
        activityList.innerHTML = '<p class="text-center">Aucune activité récente</p>';
        return;
    }
    
    activityList.innerHTML = recentBookings.map(booking => `
        <div class="activity-item">
            <strong>${booking.user}</strong> a réservé <strong>${booking.resourceName}</strong>
            <br>
            <small class="activity-time">
                ${formatDate(booking.date)} de ${booking.startTime} à ${booking.endTime}
                - <span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span>
            </small>
        </div>
    `).join('');
}

// ==================== BOOKINGS MANAGEMENT ====================

function loadBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    const filteredBookings = getFilteredBookings();
    
    if (filteredBookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Aucune réservation trouvée</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredBookings.map(booking => `
        <tr>
            <td>#${booking.id}</td>
            <td>${booking.resourceName}</td>
            <td>${booking.user}</td>
            <td>${formatDate(booking.date)} ${booking.startTime}</td>
            <td>${booking.duration}h</td>
            <td><span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="viewBooking(${booking.id})">Voir</button>
                <button class="btn btn-warning btn-sm" onclick="editBooking(${booking.id})">Modifier</button>
                <button class="btn btn-danger btn-sm" onclick="cancelBooking(${booking.id})">Annuler</button>
            </td>
        </tr>
    `).join('');
}

function getFilteredBookings() {
    let filtered = [...bookings];
    
    const statusFilter = document.getElementById('statusFilter')?.value;
    if (statusFilter && statusFilter !== 'all') {
        filtered = filtered.filter(b => b.status === statusFilter);
    }
    
    const periodFilter = document.getElementById('periodFilter')?.value;
    if (periodFilter && periodFilter !== 'all') {
        const today = new Date();
        filtered = filtered.filter(b => {
            const bookingDate = new Date(b.date);
            switch(periodFilter) {
                case 'today':
                    return bookingDate.toDateString() === today.toDateString();
                case 'week':
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return bookingDate >= weekAgo;
                case 'month':
                    return bookingDate.getMonth() === today.getMonth();
                default:
                    return true;
            }
        });
    }
    
    const searchTerm = document.getElementById('searchBookings')?.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(b => 
            b.user.toLowerCase().includes(searchTerm) ||
            b.resourceName.toLowerCase().includes(searchTerm)
        );
    }
    
    return filtered;
}

function createBooking(bookingData) {
    // Check for conflicts
    if (hasConflict(bookingData)) {
        const resource = resources.find(r => r.id == bookingData.resourceId);
        const bookingDate = bookingData.date;
        const hasMaintenance = resource && resource.maintenanceSchedule && resource.maintenanceSchedule.some(m => {
            return m.startDate <= bookingDate && m.endDate >= bookingDate;
        });
        
        if (hasMaintenance) {
            alert('Conflit détecté ! Cette ressource est en maintenance pour cette date.');
        } else if (resource && resource.openingHours) {
            const bookingStart = bookingData.startTime;
            const bookingEnd = bookingData.endTime;
            if (bookingStart < resource.openingHours.start || bookingEnd > resource.openingHours.end) {
                alert(`Conflit détecté ! Cette ressource n'est disponible que de ${resource.openingHours.start} à ${resource.openingHours.end}.`);
            } else {
                alert('Conflit détecté ! Cette ressource est déjà réservée pour cet horaire.');
            }
        } else {
            alert('Conflit détecté ! Cette ressource est déjà réservée pour cet horaire.');
        }
        return false;
    }
    
    const newBooking = {
        id: bookings.length + 1,
        ...bookingData,
        resourceName: resources.find(r => r.id == bookingData.resourceId)?.name || 'Ressource inconnue',
        status: 'pending'
    };
    
    bookings.push(newBooking);
    
    // Handle recurring bookings
    if (bookingData.recurring && bookingData.recurringUntil) {
        createRecurringBookings(bookingData);
    }
    
    updateStatistics();
    loadBookings();
    alert('Réservation créée avec succès ! En attente d\'approbation.');
    return true;
}

function hasConflict(bookingData) {
    // Check if resource is in maintenance
    const resource = resources.find(r => r.id == bookingData.resourceId);
    if (resource) {
        const bookingDate = bookingData.date;
        const hasMaintenance = resource.maintenanceSchedule && resource.maintenanceSchedule.some(m => {
            return m.startDate <= bookingDate && m.endDate >= bookingDate;
        });
        if (hasMaintenance) {
            return true; // Conflict with maintenance
        }
        
        // Check opening hours
        if (resource.openingHours) {
            const bookingStart = bookingData.startTime;
            const bookingEnd = bookingData.endTime;
            if (bookingStart < resource.openingHours.start || bookingEnd > resource.openingHours.end) {
                return true; // Outside opening hours
            }
        }
    }
    
    // Check for time conflicts with other bookings
    return bookings.some(booking => {
        if (booking.id === editingBookingId) return false; // Skip the booking being edited
        if (booking.resourceId != bookingData.resourceId) return false;
        if (booking.date !== bookingData.date) return false;
        if (booking.status === 'cancelled' || booking.status === 'rejected') return false;
        
        const newStart = bookingData.startTime;
        const newEnd = bookingData.endTime;
        const existingStart = booking.startTime;
        const existingEnd = booking.endTime;
        
        return (newStart < existingEnd && newEnd > existingStart);
    });
}

function createRecurringBookings(baseBooking) {
    const startDate = new Date(baseBooking.date);
    const endDate = new Date(baseBooking.recurringUntil);
    const frequency = baseBooking.recurringFrequency;
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        // Move to next occurrence
        switch(frequency) {
            case 'daily':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
            case 'weekly':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
        }
        
        if (currentDate <= endDate) {
            const recurringBooking = {
                ...baseBooking,
                id: bookings.length + 1,
                date: currentDate.toISOString().split('T')[0],
                resourceName: resources.find(r => r.id == baseBooking.resourceId)?.name || 'Ressource inconnue',
                status: 'pending'
            };
            
            if (!hasConflict(recurringBooking)) {
                bookings.push(recurringBooking);
            }
        }
    }
}

function editBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    
    editingBookingId = id;
    
    document.getElementById('bookingModalTitle').textContent = 'Modifier la réservation';
    document.getElementById('bookingResource').value = booking.resourceId;
    document.getElementById('bookingUser').value = booking.user;
    document.getElementById('bookingDate').value = booking.date;
    document.getElementById('bookingStartTime').value = booking.startTime;
    document.getElementById('bookingEndTime').value = booking.endTime;
    document.getElementById('bookingNotes').value = booking.notes || '';
    
    openBookingModal();
}

function viewBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    
    alert(`Détails de la réservation #${booking.id}\n\nRessource: ${booking.resourceName}\nUtilisateur: ${booking.user}\nDate: ${formatDate(booking.date)}\nHeure: ${booking.startTime} - ${booking.endTime}\nDurée: ${booking.duration}h\nStatut: ${getStatusText(booking.status)}\nNotes: ${booking.notes || 'Aucune'}`);
}

function cancelBooking(id) {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
    
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'cancelled';
        updateStatistics();
        loadBookings();
        alert('Réservation annulée avec succès');
    }
}

function approveBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'approved';
        updateStatistics();
        loadApprovals();
        alert('Réservation approuvée');
    }
}

function rejectBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'rejected';
        updateStatistics();
        loadApprovals();
        alert('Réservation rejetée');
    }
}

// ==================== RESOURCES MANAGEMENT ====================

function loadResources() {
    const grid = document.getElementById('resourcesGrid');
    const filteredResources = getFilteredResources();
    
    if (filteredResources.length === 0) {
        grid.innerHTML = '<p class="text-center">Aucune ressource trouvée</p>';
        return;
    }
    
    grid.innerHTML = filteredResources.map(resource => {
        const hasMaintenance = resource.maintenanceSchedule && resource.maintenanceSchedule.some(m => {
            const today = new Date().toISOString().split('T')[0];
            return m.startDate <= today && m.endDate >= today;
        });
        const openingHours = resource.openingHours || { start: '00:00', end: '23:59' };
        const statusText = hasMaintenance ? 'En maintenance' : 
                          resource.status === 'available' ? 'Disponible' : 
                          resource.status === 'busy' ? 'Occupé' : 
                          resource.status === 'maintenance' ? 'En maintenance' : 'Indisponible';
        const statusClass = hasMaintenance ? 'status-maintenance' : 
                           resource.status === 'available' ? 'status-approved' : 'status-pending';
        
        return `
        <div class="resource-card">
            <div class="resource-image" style="position: relative; overflow: hidden;">
                ${resource.image ? 
                    `<img src="${resource.image}" alt="${resource.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                    `<div style="background: linear-gradient(135deg, ${getColorForCategory(resource.category)}); display:flex;align-items:center;justify-content:center;height:100%;font-size:4rem;">
                        ${getIconForCategory(resource.category)}
                    </div>`
                }
                ${hasMaintenance ? '<div style="position: absolute; top: 10px; right: 10px; background: #ef4444; color: white; padding: 5px 10px; border-radius: 5px; font-size: 0.8rem;">🔧 Maintenance</div>' : ''}
            </div>
            <div class="resource-info">
                <h3>${resource.name}</h3>
                <span class="resource-category">${getCategoryText(resource.category)}</span>
                <div class="resource-details">
                    <p><strong>Description:</strong> ${resource.description || 'Aucune description'}</p>
                    <p><strong>Capacité:</strong> ${resource.capacity} ${resource.category === 'salle' ? 'personnes' : 'unité(s)'}</p>
                    <p><strong>Tarif:</strong> ${resource.price > 0 ? resource.price + '$ / ' + (resource.pricing === 'horaire' ? 'heure' : 'forfait') : 'Gratuit'}</p>
                    <p><strong>Horaires d'ouverture:</strong> ${openingHours.start} - ${openingHours.end}</p>
                    <p><strong>Équipements:</strong> ${resource.equipments || 'Aucun'}</p>
                    <p><strong>Statut:</strong> <span class="status-badge ${statusClass}">${statusText}</span></p>
                    ${hasMaintenance ? `<p><strong>⚠️ Maintenance:</strong> ${resource.maintenanceSchedule.find(m => {
                        const today = new Date().toISOString().split('T')[0];
                        return m.startDate <= today && m.endDate >= today;
                    })?.reason || 'Maintenance planifiée'}</p>` : ''}
                </div>
                <div class="resource-actions">
                    <button class="btn btn-primary" onclick="bookResource(${resource.id})" ${hasMaintenance || resource.status === 'maintenance' ? 'disabled' : ''}>Réserver</button>
                    <button class="btn btn-secondary" onclick="editResource(${resource.id})">Modifier</button>
                    <button class="btn btn-warning" onclick="manageMaintenance(${resource.id})">🔧 Maintenance</button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function getFilteredResources() {
    let filtered = [...resources];
    
    const categoryFilter = document.getElementById('categoryFilter')?.value;
    if (categoryFilter && categoryFilter !== 'all') {
        filtered = filtered.filter(r => r.category === categoryFilter);
    }
    
    const availabilityFilter = document.getElementById('availabilityFilter')?.value;
    if (availabilityFilter && availabilityFilter !== 'all') {
        filtered = filtered.filter(r => r.status === availabilityFilter);
    }
    
    const searchTerm = document.getElementById('searchResources')?.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(searchTerm) ||
            r.description.toLowerCase().includes(searchTerm)
        );
    }
    
    return filtered;
}

function bookResource(resourceId) {
    switchView('reservations');
    openBookingModal();
    document.getElementById('bookingResource').value = resourceId;
}

function editResource(id) {
    const resource = resources.find(r => r.id === id);
    if (!resource) return;
    
    editingResourceId = id;
    document.getElementById('resourceModalTitle').textContent = 'Modifier la ressource';
    document.getElementById('resourceSubmitBtn').textContent = 'Modifier';
    
    document.getElementById('resourceName').value = resource.name;
    document.getElementById('resourceCategory').value = resource.category;
    document.getElementById('resourceCapacity').value = resource.capacity;
    document.getElementById('resourceDescription').value = resource.description || '';
    document.getElementById('resourcePricing').value = resource.pricing;
    document.getElementById('resourcePrice').value = resource.price;
    document.getElementById('resourceEquipments').value = resource.equipments || '';
    document.getElementById('resourceImageUrl').value = resource.image || '';
    document.getElementById('resourceOpeningStart').value = resource.openingHours?.start || '08:00';
    document.getElementById('resourceOpeningEnd').value = resource.openingHours?.end || '18:00';
    
    openResourceModal();
}

function manageMaintenance(id) {
    const resource = resources.find(r => r.id === id);
    if (!resource) return;
    
    const maintenanceList = resource.maintenanceSchedule || [];
    let maintenanceHTML = maintenanceList.length > 0 ? 
        maintenanceList.map((m, idx) => `
            <div style="padding: 10px; margin: 5px 0; background: #f3f4f6; border-radius: 5px;">
                <strong>${formatDate(m.startDate)} - ${formatDate(m.endDate)}</strong><br>
                <small>${m.reason || 'Maintenance planifiée'}</small>
                <button onclick="removeMaintenance(${id}, ${idx})" style="float: right; background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Supprimer</button>
            </div>
        `).join('') : '<p>Aucune maintenance planifiée</p>';
    
    const startDate = prompt('Date de début de maintenance (YYYY-MM-DD):');
    if (!startDate) return;
    
    const endDate = prompt('Date de fin de maintenance (YYYY-MM-DD):');
    if (!endDate) return;
    
    const reason = prompt('Raison de la maintenance:') || 'Maintenance planifiée';
    
    if (!resource.maintenanceSchedule) {
        resource.maintenanceSchedule = [];
    }
    
    resource.maintenanceSchedule.push({
        startDate: startDate,
        endDate: endDate,
        reason: reason
    });
    
    // Update status if maintenance is active
    const today = new Date().toISOString().split('T')[0];
    if (startDate <= today && endDate >= today) {
        resource.status = 'maintenance';
    }
    
    loadResources();
    alert('Maintenance planifiée avec succès');
}

function removeMaintenance(resourceId, maintenanceIndex) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource || !resource.maintenanceSchedule) return;
    
    resource.maintenanceSchedule.splice(maintenanceIndex, 1);
    
    // Check if still in maintenance
    const today = new Date().toISOString().split('T')[0];
    const hasActiveMaintenance = resource.maintenanceSchedule.some(m => 
        m.startDate <= today && m.endDate >= today
    );
    
    if (!hasActiveMaintenance && resource.status === 'maintenance') {
        resource.status = 'available';
    }
    
    loadResources();
}

// ==================== CALENDAR ====================

function renderCalendar() {
    const calendarContainer = document.getElementById('calendar');
    const monthYear = document.getElementById('currentMonth');
    
    monthYear.textContent = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    let calendarHTML = '<div class="calendar-grid">';
    
    // Day headers
    const dayHeaders = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    dayHeaders.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarHTML += '<div class="calendar-day other-month"></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        const dayBookings = bookings.filter(b => b.date === dateString && b.status === 'approved');
        
        calendarHTML += `
            <div class="calendar-day" onclick="selectCalendarDay('${dateString}')">
                <div class="day-number">${day}</div>
                ${dayBookings.map(booking => `
                    <div class="calendar-event status-${booking.status}" title="${booking.resourceName} - ${booking.user}">
                        ${booking.startTime} ${booking.resourceName}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    calendarHTML += '</div>';
    calendarContainer.innerHTML = calendarHTML;
}

function selectCalendarDay(dateString) {
    const dayBookings = bookings.filter(b => b.date === dateString);
    
    if (dayBookings.length === 0) {
        if (confirm('Aucune réservation pour cette date. Créer une nouvelle réservation ?')) {
            switchView('reservations');
            openBookingModal();
            document.getElementById('bookingDate').value = dateString;
        }
    } else {
        alert(`Réservations pour ${formatDate(dateString)}:\n\n` + 
            dayBookings.map(b => `${b.startTime}-${b.endTime}: ${b.resourceName} (${b.user})`).join('\n'));
    }
}

// Calendar navigation
document.getElementById('prevMonth')?.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth')?.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
});

document.getElementById('todayBtn')?.addEventListener('click', () => {
    currentMonth = new Date();
    renderCalendar();
});

// ==================== ADMIN ====================

function loadAdminData() {
    loadUsersTable();
    loadApprovals();
}

function loadUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.group}</td>
            <td>${user.quota} réservations/mois</td>
            <td><span class="status-badge status-approved">${user.status}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm">Modifier</button>
                <button class="btn btn-danger btn-sm">Supprimer</button>
            </td>
        </tr>
    `).join('');
}

function loadApprovals() {
    const approvalsList = document.getElementById('approvalsList');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    
    if (pendingBookings.length === 0) {
        approvalsList.innerHTML = '<p class="text-center">Aucune réservation en attente</p>';
        return;
    }
    
    approvalsList.innerHTML = pendingBookings.map(booking => `
        <div class="approval-card">
            <div class="approval-header">
                <div>
                    <h4>${booking.resourceName}</h4>
                    <p>${booking.user} - ${formatDate(booking.date)} de ${booking.startTime} à ${booking.endTime}</p>
                    <p><small>${booking.notes || 'Aucune note'}</small></p>
                </div>
                <div class="approval-actions">
                    <button class="btn btn-success" onclick="approveBooking(${booking.id})">✓ Approuver</button>
                    <button class="btn btn-danger" onclick="rejectBooking(${booking.id})">✗ Rejeter</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== MODALS ====================

function setupModals() {
    // Booking modal
    const bookingModal = document.getElementById('bookingModal');
    const closeBookingModal = document.getElementById('closeBookingModal');
    const cancelBookingBtn = document.getElementById('cancelBookingBtn');
    
    document.getElementById('createBookingBtn')?.addEventListener('click', openBookingModal);
    closeBookingModal?.addEventListener('click', closeBookingModalFunc);
    cancelBookingBtn?.addEventListener('click', closeBookingModalFunc);
    
    // Resource modal
    const resourceModal = document.getElementById('resourceModal');
    const closeResourceModal = document.getElementById('closeResourceModal');
    const cancelResourceBtn = document.getElementById('cancelResourceBtn');
    
    document.getElementById('addResourceBtn')?.addEventListener('click', openResourceModal);
    closeResourceModal?.addEventListener('click', closeResourceModalFunc);
    cancelResourceBtn?.addEventListener('click', closeResourceModalFunc);
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeBookingModalFunc();
        if (e.target === resourceModal) closeResourceModalFunc();
    });
}

function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('active');
    
    // Populate resource dropdown
    const resourceSelect = document.getElementById('bookingResource');
    resourceSelect.innerHTML = '<option value="">Sélectionner une ressource...</option>' +
        resources.map(r => `<option value="${r.id}">${r.name} (${getCategoryText(r.category)})</option>`).join('');
}

function closeBookingModalFunc() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('active');
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingModalTitle').textContent = 'Nouvelle Réservation';
    editingBookingId = null;
}

function openResourceModal() {
    const modal = document.getElementById('resourceModal');
    modal.classList.add('active');
    if (!editingResourceId) {
        document.getElementById('resourceModalTitle').textContent = 'Ajouter une ressource';
        document.getElementById('resourceSubmitBtn').textContent = 'Ajouter';
    }
}

function closeResourceModalFunc() {
    const modal = document.getElementById('resourceModal');
    modal.classList.remove('active');
    document.getElementById('resourceForm').reset();
    editingResourceId = null;
    document.getElementById('resourceModalTitle').textContent = 'Ajouter une ressource';
    document.getElementById('resourceSubmitBtn').textContent = 'Ajouter';
}

// ==================== FORMS ====================

function setupForms() {
    // Booking form
    const bookingForm = document.getElementById('bookingForm');
    bookingForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            resourceId: parseInt(document.getElementById('bookingResource').value),
            user: document.getElementById('bookingUser').value,
            date: document.getElementById('bookingDate').value,
            startTime: document.getElementById('bookingStartTime').value,
            endTime: document.getElementById('bookingEndTime').value,
            notes: document.getElementById('bookingNotes').value,
            recurring: document.getElementById('bookingRecurring').checked,
            recurringFrequency: document.getElementById('recurringFrequency').value,
            recurringUntil: document.getElementById('recurringUntil').value
        };
        
        // Calculate duration
        const start = new Date(`2000-01-01 ${formData.startTime}`);
        const end = new Date(`2000-01-01 ${formData.endTime}`);
        formData.duration = (end - start) / (1000 * 60 * 60);
        
        if (formData.duration <= 0) {
            alert('L\'heure de fin doit être après l\'heure de début');
            return;
        }
        
        if (editingBookingId) {
            const booking = bookings.find(b => b.id === editingBookingId);
            Object.assign(booking, formData);
            alert('Réservation modifiée avec succès');
        } else {
            if (createBooking(formData)) {
                closeBookingModalFunc();
            }
        }
        
        loadBookings();
        closeBookingModalFunc();
    });
    
    // Recurring checkbox toggle
    document.getElementById('bookingRecurring')?.addEventListener('change', (e) => {
        document.getElementById('recurringOptions').style.display = 
            e.target.checked ? 'block' : 'none';
    });
    
    // Resource form
    const resourceForm = document.getElementById('resourceForm');
    resourceForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Read values first
        const name = document.getElementById('resourceName').value;
        const category = document.getElementById('resourceCategory').value;
        const capacity = parseInt(document.getElementById('resourceCapacity').value) || 1;
        const description = document.getElementById('resourceDescription').value;
        const pricing = document.getElementById('resourcePricing').value;
        const price = parseFloat(document.getElementById('resourcePrice').value) || 0;
        const equipments = document.getElementById('resourceEquipments').value;
        const imageUrl = document.getElementById('resourceImageUrl').value;
        const openingStart = document.getElementById('resourceOpeningStart').value || '08:00';
        const openingEnd = document.getElementById('resourceOpeningEnd').value || '18:00';

        if (editingResourceId) {
            // Update existing resource
            const resource = resources.find(r => r.id === editingResourceId);
            if (resource) {
                resource.name = name;
                resource.category = category;
                resource.capacity = capacity;
                resource.description = description;
                resource.pricing = pricing;
                resource.price = price;
                resource.equipments = equipments;
                resource.image = imageUrl || `https://via.placeholder.com/300x200/${Math.random().toString(16).substr(2,6)}/ffffff?text=${encodeURIComponent(name)}`;
                resource.openingHours = { start: openingStart, end: openingEnd };
                if (!resource.maintenanceSchedule) {
                    resource.maintenanceSchedule = [];
                }
                alert('Ressource modifiée avec succès');
            }
            editingResourceId = null;
        } else {
            // Create new resource
            const formData = {
                id: resources.length + 1,
                name,
                category,
                capacity,
                description,
                pricing,
                price,
                equipments,
                status: 'available',
                image: imageUrl || `https://via.placeholder.com/300x200/${Math.random().toString(16).substr(2,6)}/ffffff?text=${encodeURIComponent(name)}`,
                openingHours: { start: openingStart, end: openingEnd },
                maintenanceSchedule: []
            };

            resources.push(formData);
            alert('Ressource ajoutée avec succès');
        }

        loadResources();
        closeResourceModalFunc();
        updateStatistics();
    });
    
    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    settingsForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Paramètres enregistrés avec succès');
    });
}

// ==================== FILTERS ====================

function setupFilters() {
    document.getElementById('statusFilter')?.addEventListener('change', loadBookings);
    document.getElementById('periodFilter')?.addEventListener('change', loadBookings);
    document.getElementById('resourceFilter')?.addEventListener('change', loadBookings);
    document.getElementById('searchBookings')?.addEventListener('input', loadBookings);
    
    document.getElementById('categoryFilter')?.addEventListener('change', loadResources);
    document.getElementById('availabilityFilter')?.addEventListener('change', loadResources);
    document.getElementById('searchResources')?.addEventListener('input', loadResources);
    
    // Populate resource filter in bookings view
    const resourceFilter = document.getElementById('resourceFilter');
    if (resourceFilter) {
        resourceFilter.innerHTML = '<option value="all">Toutes les ressources</option>' +
            resources.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
    }
}

// ==================== UTILITY FUNCTIONS ====================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'En attente',
        'approved': 'Approuvé',
        'rejected': 'Rejeté',
        'cancelled': 'Annulé'
    };
    return statusMap[status] || status;
}

function getCategoryText(category) {
    const categoryMap = {
        'salle': 'Salle',
        'equipement': 'Équipement',
        'vehicule': 'Véhicule',
        'service': 'Service'
    };
    return categoryMap[category] || category;
}

function getIconForCategory(category) {
    const iconMap = {
        'salle': '🏢',
        'equipement': '🖥️',
        'vehicule': '🚗',
        'service': '⚙️'
    };
    return iconMap[category] || '📦';
}

function getColorForCategory(category) {
    const colorMap = {
        'salle': '#2563eb, #3b82f6',
        'equipement': '#10b981, #34d399',
        'vehicule': '#f59e0b, #fbbf24',
        'service': '#8b5cf6, #a78bfa'
    };
    return colorMap[category] || '#64748b, #94a3b8';
}

// ==================== NOTIFICATIONS ====================

document.getElementById('notificationBtn')?.addEventListener('click', () => {
    alert('Notifications:\n\n' +
        '• 3 nouvelles réservations en attente\n' +
        '• Rappel: Réunion à 14h00\n' +
        '• Maintenance planifiée demain');
});

// Export function for reports
document.getElementById('exportReportBtn')?.addEventListener('click', () => {
    alert('Fonctionnalité d\'export en cours de développement.\nFormats disponibles: PDF, Excel, CSV');
});

console.log('BookingSystem initialized successfully!');