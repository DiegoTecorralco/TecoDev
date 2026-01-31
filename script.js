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
    
    // Scroll suave a seccionesF
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
    document.querySelectorAll('.tech-category, .project-card, .timeline-content, .contact-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Agregar estilos CSS para animaciones
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Formulario de contacto - Opción con Formspree
function initForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validación básica
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const userSubject = this.querySelector('#subject').value.trim(); // Asunto del usuario
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
    
    // Resto del código...
    
    // Formulario de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value.trim();
            
            if (email) {
                showNotification('¡Gracias por suscribirte!', 'success');
                this.reset();
            }
        });
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
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
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                animateCounter(target, count);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
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
    
    // Agregar keyframes para partículas
    const style = document.createElement('style');
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

// Efecto de escritura en el título
function initTypingEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    const text = "TecoDev";
    let index = 0;
    
    function type() {
        if (index < text.length) {
            title.textContent += text.charAt(index);
            index++;
            setTimeout(type, 150);
        }
    }
    
    // Solo si la página acaba de cargar
    if (document.readyState === 'complete') {
        title.textContent = "";
        setTimeout(type, 1000);
    }
}

// Cargar efectos cuando la página esté completamente cargada
window.addEventListener('load', () => {
    initTypingEffect();
    
    // Añadir clase loaded para transiciones
    document.body.classList.add('loaded');
    
    // Estilos para transición de carga
    const style = document.createElement('style');
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
});

// Manejo de redimensionamiento de ventana
window.addEventListener('resize', () => {
    // Re-inicializar cursor si cambiamos de móvil a desktop o viceversa
    if (window.innerWidth <= 768) {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    } else {
        if (cursorDot) cursorDot.style.display = 'block';
        if (cursorOutline) cursorOutline.style.display = 'block';
    }
});

// Efecto de sonido para interacciones (opcional)
function playSound(type) {
    // En una implementación real, aquí cargarías archivos de audio
    // Por ahora solo creamos un efecto visual
    if (type === 'click') {
        const el = event.target;
        el.style.transform = 'scale(0.95)';
        setTimeout(() => el.style.transform = '', 150);
    }
}

// Añadir sonido a botones
document.querySelectorAll('button, .btn').forEach(btn => {
    btn.addEventListener('click', () => playSound('click'));
});