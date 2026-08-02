document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Set Current Year in Footer
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 3. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // 4. Mobile Navigation Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    function toggleMobileMenu() {
        const isOpen = mobileNavDrawer.classList.contains('open');
        if (isOpen) {
            mobileNavDrawer.classList.remove('open');
            mobileMenuBtn.querySelector('.menu-icon').style.display = 'block';
            mobileMenuBtn.querySelector('.close-icon').style.display = 'none';
        } else {
            mobileNavDrawer.classList.add('open');
            mobileMenuBtn.querySelector('.menu-icon').style.display = 'none';
            mobileMenuBtn.querySelector('.close-icon').style.display = 'block';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavDrawer.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // 5. Typing Animation in Hero
    const typingTextEl = document.getElementById('typing-text');
    const roles = ["Full-Stack Developer", "AI Enthusiast", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typingTextEl) {
        setTimeout(typeEffect, 1000);
    }

    // 6. Intersection Observer for Scroll Reveals
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 7. Skill Progress Bar Animation on Scroll
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    // Set initial widths to 0 for animation transition
    skillProgressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        bar.dataset.targetWidth = targetWidth;
    });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillProgressBars.forEach(bar => {
                        bar.style.width = bar.dataset.targetWidth;
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        skillsObserver.observe(skillsSection);
    }

    // 8. Navbar Active Section Tracking on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // Offset for header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 9. Contact Form AJAX Submission with Formspree
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Show sending state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span><i data-lucide="loader-2" class="animate-spin"></i>`;
            if (window.lucide) window.lucide.createIcons();

            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    formFeedback.textContent = "Thank you! Your message has been sent successfully.";
                    formFeedback.className = "form-feedback-message success";
                    contactForm.reset();
                } else {
                    // Error
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formFeedback.textContent = data.errors.map(error => error.message).join(", ");
                    } else {
                        formFeedback.textContent = "Oops! There was a problem submitting your form. Please try again.";
                    }
                    formFeedback.className = "form-feedback-message error";
                }
            } catch (error) {
                formFeedback.textContent = "Oops! There was a network issue. Please check your connection and try again.";
                formFeedback.className = "form-feedback-message error";
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                if (window.lucide) window.lucide.createIcons();
                
                // Clear feedback after 5 seconds
                setTimeout(() => {
                    formFeedback.textContent = "";
                    formFeedback.className = "form-feedback-message";
                }, 5000);
            }
        });
    }
});
