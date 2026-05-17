document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle (Simplified interaction)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(5, 5, 5, 0.95)';
            navLinks.style.padding = '2rem';
            navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        });
    }

    // Form submission via Gmail Web Compose
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Construct Gmail Web parameters
            const toEmail = 'aribaibrahim71@gmail.com';
            const subject = encodeURIComponent(`New Project Inquiry from ${name}`);
            const body = encodeURIComponent(
                `Hi Areeba,\n\nI have submitted a new project inquiry through your portfolio.\n\n` +
                `Here are my details:\n` +
                `-----------------------------------------\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `-----------------------------------------\n\n` +
                `Project Details:\n${message}\n\n` +
                `Best regards,\n${name}`
            );
            
            // Direct Gmail Web Compose link
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${toEmail}&su=${subject}&body=${body}`;
            
            btn.innerText = 'Opening Gmail...';
            btn.style.background = 'linear-gradient(45deg, #10b981, #059669)';
            btn.style.pointerEvents = 'none';
            
            // Open Gmail Web Compose in a new tab
            window.open(gmailUrl, '_blank');
            
            // Reset form and restore button state
            setTimeout(() => {
                contactForm.reset();
                btn.innerText = originalText;
                btn.style.background = '';
                btn.style.pointerEvents = 'auto';
            }, 2000);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // close mobile menu if open
                if (window.innerWidth <= 768 && navLinks) {
                    navLinks.style.display = 'none';
                }

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Count Up Animation
    const countUpElements = document.querySelectorAll('.count-up');
    let hasCounted = false;

    const runCountUp = () => {
        countUpElements.forEach(el => {
            const target = +el.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    el.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    el.innerText = target;
                }
            };
            updateCount();
        });
        hasCounted = true;
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                runCountUp();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Testimonials Slider
    const slider = document.getElementById('testimonialsSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');

    if (slider && prevBtn && nextBtn && dotsContainer) {
        const cards = slider.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;
        let currentIndex = 0;

        const getVisibleCardsCount = () => {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        };

        const updateSlider = () => {
            const visibleCards = getVisibleCardsCount();
            const maxIndex = totalCards - visibleCards;

            // Boundary checks
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            if (currentIndex < 0) {
                currentIndex = 0;
            }

            // Calculate exact shift based on card width + gap
            const cardWidth = cards[0].offsetWidth;
            const gap = parseFloat(getComputedStyle(slider).gap) || 0;
            const shiftAmount = currentIndex * (cardWidth + gap);
            slider.style.transform = `translateX(-${shiftAmount}px)`;

            // Update Dots
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            // Disable buttons if at boundary
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

            nextBtn.style.opacity = currentIndex === maxIndex ? '0.3' : '1';
            nextBtn.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
        };

        const createDots = () => {
            dotsContainer.innerHTML = '';
            const visibleCards = getVisibleCardsCount();
            const dotsCount = totalCards - visibleCards + 1;

            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
        };

        nextBtn.addEventListener('click', () => {
            const visibleCards = getVisibleCardsCount();
            const maxIndex = totalCards - visibleCards;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        // Touch Swipe Support for mobile devices
        let startX = 0;
        let endX = 0;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            const threshold = 50; // minimum distance to count as swipe

            const visibleCards = getVisibleCardsCount();
            const maxIndex = totalCards - visibleCards;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    // Swiped left -> Next card
                    if (currentIndex < maxIndex) {
                        currentIndex++;
                        updateSlider();
                    }
                } else {
                    // Swiped right -> Previous card
                    if (currentIndex > 0) {
                        currentIndex--;
                        updateSlider();
                    }
                }
            }
        }, { passive: true });

        // Initialize slider
        createDots();
        updateSlider();

        // Re-calculate slider dimensions on window resize
        window.addEventListener('resize', () => {
            createDots();
            updateSlider();
        });
    }

    // TextType Vanilla Implementation
    class TextType {
        constructor(element, options = {}) {
            this.element = element;
            this.words = options.words || JSON.parse(element.getAttribute('data-words')) || [];
            this.typingSpeed = options.typingSpeed || 100;
            this.deletingSpeed = options.deletingSpeed || 50;
            this.pauseDuration = options.pauseDuration || 2000;
            this.loop = options.loop !== undefined ? options.loop : true;
            this.showCursor = options.showCursor !== false;

            this.txt = '';
            this.wordIndex = 0;
            this.isDeleting = false;

            // Add cursor if requested
            if (this.showCursor) {
                this.cursor = document.createElement('span');
                this.cursor.className = 'text-type__cursor';
                this.cursor.innerText = options.cursorCharacter || '|';
                this.element.parentNode.insertBefore(this.cursor, this.element.nextSibling);
            }

            this.type();
        }

        type() {
            const currentWord = this.words[this.wordIndex];

            if (this.isDeleting) {
                this.txt = currentWord.substring(0, this.txt.length - 1);
            } else {
                this.txt = currentWord.substring(0, this.txt.length + 1);
            }

            this.element.innerText = this.txt;

            let typeSpeed = this.typingSpeed;

            if (this.isDeleting) {
                typeSpeed = this.deletingSpeed;
            }

            // Word completed typing
            if (!this.isDeleting && this.txt === currentWord) {
                typeSpeed = this.pauseDuration;

                if (this.loop || this.wordIndex < this.words.length - 1) {
                    this.isDeleting = true;
                } else {
                    // Stop on final word and hide cursor after a short delay
                    if (this.cursor) {
                        setTimeout(() => {
                            this.cursor.classList.add('text-type__cursor--hidden');
                        }, 2500);
                    }
                    return;
                }
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.wordIndex = (this.wordIndex + 1) % this.words.length;
                typeSpeed = 400; // brief pause before starting next word
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

    // Initialize Hero TextType Typing Effect
    const heroTextTypeEl = document.getElementById('heroTextType');
    if (heroTextTypeEl) {
        new TextType(heroTextTypeEl, {
            typingSpeed: 80,
            deletingSpeed: 40,
            pauseDuration: 1800,
            loop: true
        });
    }

    // Initialize Header Logo TextType Typing Effect (Single type, no loop, looks clean!)
    const logoTextTypeEl = document.getElementById('logoTextType');
    if (logoTextTypeEl) {
        new TextType(logoTextTypeEl, {
            typingSpeed: 150,
            loop: false,
            showCursor: true
        });
    }
});
