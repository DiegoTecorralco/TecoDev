// Variables globales
let cursorDot;
let cursorOutline;
let mouseX = 0;
let mouseY = 0;
let isDarkMode = false;

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    initCursor();
    initTheme();
    initMenu();
    initScrollEffects();
    initForm();
    initAnimations();
    initParticles();
    initCVDownload();
    initTestimonialsStats();
    initVisitCounter(); 
});

// Cursor personalizado
function initCursor() {
    cursorDot = document.querySelector('.cursor-dot');
    cursorOutline = document.querySelector('.cursor-outline');
    
    // Solo en desktop
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
            
            cursorOutline.animate({
                left: `${mouseX}px`,
                top: `${mouseY}px`
            }, { duration: 500, fill: 'forwards' });
        });
        
        // Efecto al pasar sobre enlaces y botones
        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .tech-category');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.width = '16px';
                cursorDot.style.height = '16px';
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.borderWidth = '3px';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorDot.style.width = '8px';
                cursorDot.style.height = '8px';
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.borderWidth = '2px';
            });
        });
    } else {
        // Ocultar cursor en móvil
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    }
}

// Sistema de tema claro/oscuro
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Verificar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    isDarkMode = prefersDark.matches;
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('tecodev-theme');
    if (savedTheme) {
        isDarkMode = savedTheme === 'dark';
    }
    
    applyTheme();
    
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        applyTheme();
        localStorage.setItem('tecodev-theme', isDarkMode ? 'dark' : 'light');
    });
    
    // Escuchar cambios en el sistema
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('tecodev-theme')) {
            isDarkMode = e.matches;
            applyTheme();
        }
    });
}

function applyTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
    }
}

// Menú móvil
function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Efectos de scroll
function initScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');
    const header = document.getElementById('header');
    
    // Mostrar/ocultar botón scroll top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            scrollTopBtn.classList.remove('visible');
            header.style.boxShadow = 'var(--shadow-sm)';
        }
        
        // Efecto parallax en hero
        const scrolled = window.scrollY;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.05}px)`;
        }
    });
    
    // Scroll suave a secciones
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Botón scroll top
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animación de aparición al scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    document.querySelectorAll('.tech-category, .project-card, .timeline-content, .contact-card, .about-card, .testimonial-card, .detail-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ===================================
// ESTADÍSTICAS REALES DE GITHUB
// ===================================
async function fetchGitHubStats() {
    try {
        // Mostrar estado de carga
        const reposElement = document.getElementById('github-repos');
        const starsElement = document.getElementById('github-stars');
        
        if (!reposElement) return; // Si no existe, salir
        
        reposElement.textContent = '...';
        starsElement.textContent = '...';
        
        // Fetch de repositorios públicos
        const userResponse = await fetch('https://api.github.com/users/DiegoTecorralco');
        if (!userResponse.ok) throw new Error('Error fetching user');
        const userData = await userResponse.json();
        
        // Fetch de todos los repos para calcular estrellas
        const reposResponse = await fetch('https://api.github.com/users/DiegoTecorralco/repos?per_page=100');
        if (!reposResponse.ok) throw new Error('Error fetching repos');
        const reposData = await reposResponse.json();
        
        // Calcular total de estrellas
        const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        
        // Actualizar DOM con animación
        animateCounter(reposElement, userData.public_repos || 5);
        animateCounter(starsElement, totalStars || 3);
        
        // Guardar en localStorage para caché
        localStorage.setItem('github_repos', userData.public_repos);
        localStorage.setItem('github_stars', totalStars);
        localStorage.setItem('github_last_fetch', Date.now());
        
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        
        // Intentar cargar desde caché
        const cachedRepos = localStorage.getItem('github_repos');
        const cachedStars = localStorage.getItem('github_stars');
        const lastFetch = localStorage.getItem('github_last_fetch');
        
        const reposElement = document.getElementById('github-repos');
        const starsElement = document.getElementById('github-stars');
        
        if (cachedRepos && cachedStars && reposElement && starsElement) {
            reposElement.textContent = cachedRepos;
            starsElement.textContent = cachedStars;
            
            // Mostrar notificación si los datos son viejos (más de 24 horas)
            if (lastFetch && (Date.now() - parseInt(lastFetch) > 86400000)) {
                showNotification('Mostrando datos en caché. Conecta a GitHub para ver estadísticas actualizadas.', 'info');
            }
        } else {
            // Valores por defecto
            if (reposElement) reposElement.textContent = '5';
            if (starsElement) starsElement.textContent = '3';
        }
    }
}

// ===================================
// DESCARGA DE CV - VERSIÓN PDF REAL
// ===================================
function initCVDownload() {
    const downloadBtn = document.getElementById('downloadCvBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Ruta a el archivo PDF
            const pdfPath = './assets/Curriculum Diego Salvador Tecorralco Martinez.pdf'; 
            
            // Crear un enlace temporal para descargar
            const link = document.createElement('a');
            link.href = pdfPath;
            link.download = 'Diego_Tecorralco_CV.pdf'; // Nombre con el que se descargará
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('CV descargado correctamente', 'success');
        });
    }
}

// ===================================
// ANIMACIÓN PARA ESTADÍSTICAS DE TESTIMONIOS
// ===================================
function initTestimonialsStats() {
    const statNumbers = document.querySelectorAll('.testimonial-stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const number = element.textContent;
                
                if (number.includes('+')) {
                    const value = parseInt(number.replace('+', ''));
                    animateCounterWithPlus(element, value);
                } else if (number.includes('%')) {
                    const value = parseInt(number.replace('%', ''));
                    animateCounterWithPercent(element, value);
                } else {
                    const value = parseInt(number);
                    if (!isNaN(value)) {
                        animateCounter(element, value);
                    }
                }
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounterWithPlus(element, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            clearInterval(timer);
            element.textContent = `+${target}`;
        } else {
            element.textContent = `+${Math.floor(current)}`;
        }
    }, 16);
}

function animateCounterWithPercent(element, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            clearInterval(timer);
            element.textContent = `${target}%`;
        } else {
            element.textContent = `${Math.floor(current)}%`;
        }
    }, 16);
}

// Formulario de contacto
function initForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validación básica
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const userSubject = this.querySelector('#subject').value.trim();
            const message = this.querySelector('#message').value.trim();
            
            if (!name || !email || !userSubject || !message) {
                showNotification('Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Mostrar loading
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            try {
                // Crear FormData y modificar el asunto
                const formData = new FormData(this);
                
                // Cambiar el valor de _subject para combinar
                formData.set('_subject', `Nuevo mensaje desde TecoDev: ${userSubject}`);
                
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showNotification('¡Mensaje enviado con éxito! Te responderé pronto.', 'success');
                    this.reset();
                    createConfetti();
                } else {
                    throw new Error('Error al enviar el mensaje');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.', 'error');
            } finally {
                // Restaurar botón
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

function showNotification(message, type) {
    // Tipos: success, error, info
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Ocultar después de 5 segundos
    const removeNotification = () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    };
    
    setTimeout(removeNotification, 5000);
    
    // Cerrar al hacer clic
    notification.addEventListener('click', removeNotification);
}

function createConfetti() {
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            top: -20px;
            left: ${Math.random() * 100}vw;
            z-index: 9998;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        // Animación
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Animaciones de contadores
function initAnimations() {
    // Contadores originales (excluyendo los de GitHub que se manejan aparte)
    const statNumbers = document.querySelectorAll('.stat-number:not(#github-repos):not(#github-stars)');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                if (!isNaN(count)) {
                    animateCounter(target, count);
                }
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
    
    // Iniciar estadísticas de GitHub
    fetchGitHubStats();
}

function animateCounter(element, target) {
    const duration = 2000;
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Partículas en background
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición aleatoria
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Tamaño aleatorio
        const size = Math.random() * 4 + 1;
        
        // Duración y delay aleatorios
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--primary);
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            opacity: ${Math.random() * 0.3 + 0.1};
            animation: particle-float ${duration}s linear infinite;
            animation-delay: ${delay}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    // Agregar keyframes para partículas si no existen
    if (!document.querySelector('#particle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'particle-keyframes';
        style.textContent = `
            @keyframes particle-float {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0.1;
                }
                25% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
                    opacity: 0.3;
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                    opacity: 0.1;
                }
                75% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
                    opacity: 0.3;
                }
                100% {
                    transform: translate(0, 0) rotate(360deg);
                    opacity: 0.1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Efecto de escritura en el título
function initTypingEffect() {
    const titleHighlight = document.querySelector('.title-highlight');
    if (!titleHighlight) return;
    
    const originalText = titleHighlight.textContent;
    // No hacer nada, ya se muestra el texto completo
    // Esto es solo para mantener la función si se quiere usar después
}

// Cargar efectos cuando la página esté completamente cargada
window.addEventListener('load', () => {
    initTypingEffect();
    
    // Añadir clase loaded para transiciones
    document.body.classList.add('loaded');
    
    // Estilos para transición de carga
    if (!document.querySelector('#load-styles')) {
        const style = document.createElement('style');
        style.id = 'load-styles';
        style.textContent = `
            body {
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            
            body.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
});

// Manejo de redimensionamiento de ventana
window.addEventListener('resize', () => {
    // Re-inicializar cursor si cambiamos de móvil a desktop o viceversa
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (window.innerWidth <= 768) {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    } else {
        if (cursorDot) {
            cursorDot.style.display = 'block';
            cursorOutline.style.display = 'block';
        }
    }
});

// Efecto de sonido para interacciones (opcional)
function playSound(type) {
    // Solo efecto visual por ahora
    if (type === 'click') {
        const el = event.target;
        el.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (el) el.style.transform = '';
        }, 150);
    }
}

// Añadir efecto a botones
document.querySelectorAll('button, .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        playSound('click');
    });
});

// ===================================
// FUNCIONES ADICIONALES PARA MEJORAR UX
// ===================================

// Detectar sección activa en el menú
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').replace('#', '');
            if (href === current) {
                link.classList.add('active');
            }
        });
    });
}

// Iniciar detección de sección activa
setTimeout(updateActiveNavLink, 500);

// Preloader (opcional)
function showPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = '<div class="spinner"></div>';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--light);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 500);
    });
}

// Descomentar si se quiere usar preloader
// showPreloader();

// Estadísticas en tiempo real cada hora (para mantener actualizado)
setInterval(() => {
    // Verificar si ha pasado más de 1 hora desde la última actualización
    const lastFetch = localStorage.getItem('github_last_fetch');
    if (lastFetch && (Date.now() - parseInt(lastFetch) > 3600000)) { // 1 hora
        fetchGitHubStats();
    }
}, 3600000); // Revisar cada hora

// ===================================
// SOPORTE PARA TECLADO Y ACCESIBILIDAD
// ===================================

// Navegación por teclado
document.addEventListener('keydown', (e) => {
    // Tecla Escape para cerrar menú móvil
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.getElementById('menuToggle');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
    
    // Tecla Tab para mejorar focus visible
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remover clase de navegación por teclado al hacer clic con mouse
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ===================================
// INICIALIZACIÓN DE TOOLTIPS (si se necesitan)
// ===================================
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltipText = element.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = tooltipText;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--dark);
                color: white;
                padding: 5px 10px;
                border-radius: var(--radius-sm);
                font-size: 0.8rem;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            
            element.addEventListener('mouseleave', () => {
                tooltip.remove();
            }, { once: true });
        });
    });
}

// ===================================
// CONTADOR DE VISITAS - VERSIÓN CON API CONFIABLE
// ===================================

const initVisitCounter = async () => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    // No duplicar
    if (document.querySelector('.visit-counter')) return;
    
    const counterDiv = document.createElement('div');
    counterDiv.className = 'visit-counter';
    counterDiv.style.cssText = `
        text-align: center;
        margin-top: 30px;
        padding: 15px;
        font-size: 0.9rem;
        opacity: 0.7;
        border-top: 1px solid rgba(99, 102, 241, 0.2);
        transition: opacity 0.3s ease;
    `;
    
    counterDiv.innerHTML = `
        <i class="fas fa-eye" style="margin-right: 8px; color: var(--primary);"></i>
        <span id="visitCount" style="font-weight: 600;">...</span>
        <span> visitas totales</span>
    `;
    
    footer.appendChild(counterDiv);
    
    // Usar una API diferente y más confiable
    const updateCounter = async () => {
        try {
            const today = new Date().toDateString();
            const lastVisit = localStorage.getItem('teco_last_visit');
            const isNewDay = lastVisit !== today;
            
            let visitCount;
            
            if (isNewDay) {
                // Incrementar contador usando HitCounter (API confiable)
                const response = await fetch('https://api.viewcounter.com/hit/tecodev-portfolio', {
                    method: 'GET',
                    mode: 'cors'
                });
                
                if (!response.ok) throw new Error('Error al incrementar');
                const data = await response.json();
                visitCount = data.count || data.value || 1;
                localStorage.setItem('teco_last_visit', today);
            } else {
                // Obtener valor actual
                const response = await fetch('https://api.viewcounter.com/get/tecodev-portfolio');
                if (!response.ok) throw new Error('Error al obtener');
                const data = await response.json();
                visitCount = data.count || data.value || 0;
            }
            
            const visitSpan = document.getElementById('visitCount');
            if (visitSpan) {
                visitSpan.textContent = visitCount;
            }
            
        } catch (error) {
            console.error('Error en contador:', error);
            // Usar contador local como fallback
            useLocalCounter();
        }
    };
    
    // Función de respaldo con localStorage
    const useLocalCounter = () => {
        let visits = localStorage.getItem('teco_local_visits');
        if (visits === null) {
            visits = 1;
        } else {
            visits = parseInt(visits) + 1;
        }
        localStorage.setItem('teco_local_visits', visits);
        
        const visitSpan = document.getElementById('visitCount');
        if (visitSpan) {
            visitSpan.textContent = visits;
            // Agregar indicador de que es local
            const parent = visitSpan.parentElement;
            if (parent && !parent.querySelector('.local-badge')) {
                const badge = document.createElement('span');
                badge.className = 'local-badge';
                badge.style.cssText = 'font-size:0.7rem;margin-left:5px;opacity:0.5';
                badge.textContent = '(local)';
                parent.appendChild(badge);
            }
        }
    };
    
    // Intentar con la API principal
    updateCounter();
    
    // Actualizar cada hora
    setInterval(updateCounter, 3600000);
};

// Inicializar tooltips después de un pequeño retraso
setTimeout(initTooltips, 1000);