// DOM Elements
const header = document.getElementById('header');
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const navLinks = document.querySelectorAll('.nav__link');
const backToTop = document.querySelector('.back-to-top');
const testimonials = document.querySelectorAll('.testimonial');
const prevButton = document.querySelector('.testimonial-btn.prev');
const nextButton = document.querySelector('.testimonial-btn.next');
const indicators = document.querySelectorAll('.indicator');
const statsNumbers = document.querySelectorAll('.stats__number');
const contactForm = document.getElementById('contactForm');

// Current testimonial index
let currentTestimonial = 0;

// Add scroll event listener
window.addEventListener('scroll', () => {
    // Toggle header background on scroll
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Toggle back to top button
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }

    // Animate stats numbers when in viewport
    animateStatsWhenVisible();
    
    // Add animation to sections when they come into view
    animateSectionsOnScroll();
});

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Remove active class from all links
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Testimonial carousel functions
function showTestimonial(index) {
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    testimonials[index].classList.add('active');
    indicators[index].classList.add('active');
    currentTestimonial = index;
}

// Next testimonial
nextButton.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
});

// Previous testimonial
prevButton.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
});

// Indicator click to show specific testimonial
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showTestimonial(index);
    });
});

// Auto rotate testimonials
let testimonialInterval = setInterval(() => {
    nextButton.click();
}, 5000);

// Pause auto rotate on hover
document.querySelector('.testimonials__carousel').addEventListener('mouseenter', () => {
    clearInterval(testimonialInterval);
});

// Resume auto rotate when mouse leaves
document.querySelector('.testimonials__carousel').addEventListener('mouseleave', () => {
    testimonialInterval = setInterval(() => {
        nextButton.click();
    }, 5000);
});

// Animate numbers in stats section
function animateValue(element, start, end, duration) {
    let startTime = null;
    const animationStep = timestamp => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.innerText = value;
        if (progress < 1) {
            window.requestAnimationFrame(animationStep);
        }
    };
    window.requestAnimationFrame(animationStep);
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Animate stats when they come into viewport
function animateStatsWhenVisible() {
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    
    if (isElementInViewport(statsSection) && !statsSection.classList.contains('animated')) {
        statsSection.classList.add('animated');
        statsNumbers.forEach(number => {
            const finalValue = parseInt(number.getAttribute('data-count'));
            animateValue(number, 0, finalValue, 2000);
        });
    }
}

// Add animation to sections when they come into view
function animateSectionsOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        if (isElementInViewport(section) && !section.classList.contains('animate-fade-in')) {
            section.classList.add('animate-fade-in');
        }
    });
}

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone')?.value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill out all required fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Phone validation (if provided)
        if (phone) {
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(phone)) {
                alert('Please enter a valid phone number');
                return;
            }
        }
        
        // In a real implementation, you would send the form data to a server
        // For now, we'll just simulate a successful submission
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Initialize page animations on load
window.addEventListener('DOMContentLoaded', () => {
    // Set active nav link based on current section
    updateActiveNavOnScroll();
    
    // Add animation to hero section
    document.querySelector('.hero').classList.add('animate-fade-in');
    
    // Start with first testimonial
    showTestimonial(0);
});

// Update active navigation link based on scroll position
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Newsletter form validation
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Simulate successful subscription
        alert('Thank you for subscribing to our newsletter!');
        form.reset();
    });
});

// Animate elements when they come into view
function animateOnScroll() {
    const elements = document.querySelectorAll('.program-card, .faculty-card, .life-card, .service-card, .faq-item');
    
    elements.forEach(element => {
        if (isElementInViewport(element) && !element.classList.contains('animate-fade-in')) {
            element.classList.add('animate-fade-in');
        }
    });
}

// Add scroll event listener for animations
window.addEventListener('scroll', animateOnScroll);

// Initialize animations on page load
window.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
});