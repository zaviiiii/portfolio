document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const cursorDot = document.querySelector('.cursor-dot');

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';

        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateFollower);
    }

    animateFollower();

    // Cursor effects on click
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicked');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicked');
    });

    // Enhanced cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, .tab-btn, .link-card, .social-link, .project-card, .nav-link'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.background = 'rgba(102, 126, 234, 0.3)';
            cursor.style.borderColor = 'var(--accent)';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.background = 'transparent';
            cursor.style.borderColor = 'var(--primary)';
        });
    });

    // Page Navigation System
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageDots = document.querySelectorAll('.page-dot');
    const linksGrid = document.querySelectorAll('.links-grid a');

    function showPage(pageId) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
            page.classList.remove('prev');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        targetPage.classList.add('active');

        // Update navigation
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === pageId) {
                link.classList.add('active');
            }
        });

        // Update page dots
        pageDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-page') === pageId) {
                dot.classList.add('active');
            }
        });
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // Handle page dots
    pageDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const pageId = dot.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // Handle links in grid
    linksGrid.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            const activeDot = document.querySelector('.page-dot.active');
            if (activeDot) {
                const dots = Array.from(pageDots);
                const currentIndex = dots.indexOf(activeDot);
                const nextIndex = (currentIndex + 1) % dots.length;
                if (nextIndex !== currentIndex) {
                    showPage(dots[nextIndex].getAttribute('data-page'));
                }
            }
        }

        if (e.key === 'ArrowLeft') {
            const activeDot = document.querySelector('.page-dot.active');
            if (activeDot) {
                const dots = Array.from(pageDots);
                const currentIndex = dots.indexOf(activeDot);
                const prevIndex = (currentIndex - 1 + dots.length) % dots.length;
                if (prevIndex !== currentIndex) {
                    showPage(dots[prevIndex].getAttribute('data-page'));
                }
            }
        }

        // Escape key goes to about page
        if (e.key === 'Escape') {
            showPage('about');
        }
    });

    // Edit Page Functionality
    const editTabBtns = document.querySelectorAll('.edit-tabs .tab-btn');
    const editTabContents = document.querySelectorAll('.edit-section .tab-content');

    editTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update tabs
            editTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update content
            const tabName = btn.getAttribute('data-tab');
            editTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('id') === tabName + '-tab') {
                    content.classList.add('active');
                }
            });
        });
    });

    // Add Project Button
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectsEditContainer = document.getElementById('projectsEditContainer');

    if (addProjectBtn && projectsEditContainer) {
        addProjectBtn.addEventListener('click', () => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-edit-item';
            projectItem.innerHTML = `
                <input type="text" class="project-title" placeholder="Project Title">
                <textarea class="project-desc" placeholder="Project Description" rows="2"></textarea>
                <input type="url" class="project-link" placeholder="Project URL (optional)">
                <button type="button" class="remove-project-btn" onclick="this.closest('.project-edit-item').remove()">
                    <i class="fas fa-trash"></i> Remove
                </button>
            `;
            projectsEditContainer.appendChild(projectItem);
        });
    }

    // Save Button
    const saveEditBtn = document.getElementById('saveEdit');
    const cancelEditBtn = document.getElementById('cancelEdit');

    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', () => {
            // Get form data
            const name = document.getElementById('editName').value;
            const age = document.getElementById('editAge').value;
            const birthDate = document.getElementById('editBirthDate').value;
            const place = document.getElementById('editPlace').value;
            const about = document.getElementById('editAbout').value;
            const email = document.getElementById('editEmail').value;
            const phone = document.getElementById('editPhone').value;
            const location = document.getElementById('editLocation').value;

            // Update page content
            document.getElementById('nameDisplay').textContent = name;
            document.getElementById('ageDisplay').textContent = age;
            document.getElementById('birthDateDisplay').textContent = birthDate;
            document.getElementById('placeDisplay').textContent = place;
            document.getElementById('locationContact').textContent = location;
            document.getElementById('emailContact').textContent = email;
            document.getElementById('phoneContact').textContent = phone;
            document.getElementById('birthDateContact').textContent = birthDate;

            document.getElementById('aboutText').textContent = about;

            // Update hero stats
            function calculateAgeFromDate(dateStr) {
                if (!dateStr) return age;
                const today = new Date();
                const birth = new Date(dateStr);
                if (isNaN(birth.getTime())) return age;
                let calcAge = today.getFullYear() - birth.getFullYear();
                const monthDiff = today.getMonth() - birth.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                    calcAge--;
                }
                return calcAge;
            }

            const calculatedAge = calculateAgeFromDate(birthDate);
            document.getElementById('ageDisplay').textContent = calculatedAge;
            document.getElementById('heroAge').textContent = calculatedAge;

            // Update projects
            const projectItems = document.querySelectorAll('.project-edit-item');
            const projectsArray = [];

            projectItems.forEach(item => {
                const title = item.querySelector('.project-title').value;
                const desc = item.querySelector('.project-desc').value;
                const link = item.querySelector('.project-link').value;

                if (title || desc) {
                    projectsArray.push({ title, description: desc, link });
                }
            });

            // Show feedback
            alert('Portfolio updated successfully!');

            // Optional: Go back to about page
            // showPage('about');
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            showPage('about');
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            alert(`Thank you ${name}! Your message has been sent. I'll get back to you soon.`);
            contactForm.reset();
        });
    }

    // Scroll to section when clicking nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#about' || targetId === '#projects' ||
                targetId === '#contact' || targetId === '#edit') {

                // For internal page navigation, use our page system
                const pageId = targetId.substring(1);
                showPage(pageId);
            }
        });
    });

    // Scroll event for navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initialize particles
    function createParticles() {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random position
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';

            // Random size
            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            // Random animation delay and duration
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';

            particlesContainer.appendChild(particle);
        }
    }

    // Add particles container to body
    const particlesDiv = document.createElement('div');
    particlesDiv.className = 'particles';
    document.body.appendChild(particlesDiv);
    createParticles();

    // Intersection Observer for fade-in effects
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for fade-in
    const fadeElements = document.querySelectorAll(
        '.section-title, .info-card, .project-card, .contact-item, .social-link'
    );

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Set initial state
    showPage('about');
});