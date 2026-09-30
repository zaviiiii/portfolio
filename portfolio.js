// Portfolio data with defaults
const DEFAULT_DATA = {
    name: "Your Name",
    age: "--",
    birthDate: "",
    place: "Your Place",
    about: "Hello! I'm a passionate developer who loves creating innovative solutions and building things that make a difference. With expertise in modern web technologies, I strive to deliver clean, efficient, and user-friendly applications. I'm constantly learning and exploring new technologies to stay ahead in this ever-evolving field. When I'm not coding, you'll find me reading, hiking, or experimenting with new ideas.",
    projects: [
        { title: "Project One", description: "A web application built with modern technologies to solve a real-world problem." },
        { title: "Project Two", description: "An interactive tool that enhances productivity and streamlines workflows." },
        { title: "Project Three", description: "A mobile-first solution designed for seamless user experience across all devices." }
    ],
    contact: {
        email: "your.email@example.com",
        phone: "+1 (555) 000-0000",
        location: "Your City, Country"
    }
};

let portfolioData = loadData();
let isEditing = false;

// Load data from localStorage or use defaults
function loadData() {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
        return JSON.parse(saved);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

// Save data to localStorage
function saveData(data) {
    localStorage.setItem('portfolioData', JSON.stringify(data));
}

// Calculate age from birth date
function calculateAge(birthDateString) {
    if (!birthDateString) return '--';
    const today = new Date();
    const birth = new Date(birthDateString);
    if (isNaN(birth.getTime())) return '--';
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Render portfolio
function renderPortfolio() {
    // Render personal info
    document.getElementById('nameDisplay').textContent = portfolioData.name || 'Add your name';
    document.getElementById('placeDisplay').textContent = portfolioData.place || 'Add your place';
    document.getElementById('birthDateDisplay').textContent = portfolioData.birthDate || '--';

    // Calculate and render age
    portfolioData.age = calculateAge(portfolioData.birthDate);
    document.getElementById('ageDisplay').textContent = portfolioData.age;

    // Render about
    document.getElementById('aboutText').textContent = portfolioData.about;

    // Render projects
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    if (portfolioData.projects.length === 0) {
        grid.innerHTML = `
            <div class="project-card">
                <div class="project-placeholder">
                    <i class="fas fa-plus"></i>
                    <p>Add Project</p>
                </div>
            </div>
        `;
    } else {
        portfolioData.projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="project-image">
                    <i class="fas fa-code" style="font-size: 2rem;"></i>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${escapeHtml(project.title)}</h3>
                    <p class="project-description">${escapeHtml(project.description)}</p>
                    ${project.link ? `<a href="${escapeHtml(project.link)}" class="project-link" target="_blank" rel="noopener">View Project</a>` : ''}
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Render contact
    document.getElementById('emailContact').textContent = portfolioData.contact.email || 'Add your email';
    document.getElementById('phoneContact').textContent = portfolioData.contact.phone || 'Add your phone';
    document.getElementById('locationContact').textContent = portfolioData.contact.location || 'Add your location';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Open edit modal
function openEditModal() {
    // Populate personal info
    document.getElementById('nameInput').value = portfolioData.name;
    document.getElementById('ageInput').value = portfolioData.age;
    document.getElementById('birthDateInput').value = portfolioData.birthDate;
    document.getElementById('placeInput').value = portfolioData.place;

    // Populate about
    document.getElementById('aboutTextarea').value = portfolioData.about;

    // Populate projects
    const container = document.getElementById('projectsEditContainer');
    container.innerHTML = '';

    if (portfolioData.projects.length === 0) {
        addProjectEditItem();
    } else {
        portfolioData.projects.forEach((project, index) => {
            const item = createProjectEditItem(project, index);
            container.appendChild(item);
        });
    }

    // Populate contact
    document.getElementById('emailInput').value = portfolioData.contact.email;
    document.getElementById('phoneInput').value = portfolioData.contact.phone;
    document.getElementById('locationInput').value = portfolioData.contact.location;

    // Reset to about tab
    switchTab('about');

    // Show modal
    document.getElementById('editModal').style.display = 'flex';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Create a project edit item element
function createProjectEditItem(project = null, index = 0) {
    const item = document.createElement('div');
    item.className = 'project-edit-item';
    item.innerHTML = `
        <input type="text" class="project-title" placeholder="Project Title" value="${project ? escapeHtml(project.title) : ''}">
        <input type="text" class="project-desc" placeholder="Project Description" value="${project ? escapeHtml(project.description) : ''}">
        <input type="url" class="project-link" placeholder="Project URL (optional)" value="${project && project.link ? escapeHtml(project.link) : ''}">
        <button class="remove-project-btn"><i class="fas fa-trash"></i></button>
    `;

    // Add remove functionality
    item.querySelector('.remove-project-btn').addEventListener('click', () => {
        if (document.querySelectorAll('.project-edit-item').length > 1) {
            item.remove();
        } else {
            // Clear fields if it's the last item
            item.querySelectorAll('input').forEach(input => input.value = '');
        }
    });

    return item;
}

// Add a new project edit item
function addProjectEditItem() {
    const container = document.getElementById('projectsEditContainer');
    const item = createProjectEditItem();
    container.appendChild(item);
}

// Switch tabs in edit modal
function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName + '-tab');
    });
}

// Save data from modal
function savePortfolio() {
    // Save personal info
    portfolioData.name = document.getElementById('nameInput').value.trim();
    portfolioData.age = document.getElementById('ageInput').value.trim();
    portfolioData.birthDate = document.getElementById('birthDateInput').value.trim();
    portfolioData.place = document.getElementById('placeInput').value.trim();

    // Save about
    portfolioData.about = document.getElementById('aboutTextarea').value;

    // Save projects
    const items = document.querySelectorAll('.project-edit-item');
    portfolioData.projects = [];
    items.forEach(item => {
        const title = item.querySelector('.project-title').value.trim();
        const desc = item.querySelector('.project-desc').value.trim();
        const link = item.querySelector('.project-link').value.trim();

        if (title || desc) {
            portfolioData.projects.push({ title, description: desc, link });
        }
    });

    // Save contact
    portfolioData.contact.email = document.getElementById('emailInput').value.trim();
    portfolioData.contact.phone = document.getElementById('phoneInput').value.trim();
    portfolioData.contact.location = document.getElementById('locationInput').value.trim();

    // Persist and render
    saveData(portfolioData);
    renderPortfolio();
    closeEditModal();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderPortfolio();

    // Edit button click
    document.getElementById('editToggle').addEventListener('click', openEditModal);

    // Modal close buttons
    document.getElementById('closeModal').addEventListener('click', closeEditModal);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);

    // Close modal when clicking outside
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('editModal')) {
            closeEditModal();
        }
    });

    // Save button
    document.getElementById('saveEdit').addEventListener('click', savePortfolio);

    // Add project button
    document.getElementById('addProjectBtn').addEventListener('click', addProjectEditItem);

    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Mobile nav toggle
    document.querySelector('.nav-toggle').addEventListener('click', () => {
        document.querySelector('.nav-menu').classList.toggle('active');
    });

    // Auto-calculate age from birth date
    document.getElementById('birthDateInput').addEventListener('change', (e) => {
        const birthDate = e.target.value;
        if (birthDate) {
            const today = new Date();
            const birth = new Date(birthDate);
            if (!isNaN(birth.getTime())) {
                let age = today.getFullYear() - birth.getFullYear();
                const monthDiff = today.getMonth() - birth.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                    age--;
                }
                document.getElementById('ageInput').value = age;
            }
        }
    });

    // Auto-fill birth date from age (approximate)
    document.getElementById('ageInput').addEventListener('change', (e) => {
        const age = parseInt(e.target.value);
        if (!isNaN(age) && age >= 0 && age <= 150) {
            const today = new Date();
            const birthYear = today.getFullYear() - age;
            // Set to Jan 1 of that birth year as approximation
            document.getElementById('birthDateInput').value = `${birthYear}-01-01`;
        }
    });

    // Smooth scrolling for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            // Close mobile menu
            document.querySelector('.nav-menu').classList.remove('active');
        });
    });
});