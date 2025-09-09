document.addEventListener('DOMContentLoaded', function () {
    // Initialize the collaborators carousel
    if (document.getElementById('collaborators-carousel')) {
        new Splide('#collaborators-carousel', {
            type: 'loop',
            perPage: 4,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 3000,
            pauseOnHover: true,
            breakpoints: {
                768: {
                    perPage: 2,
                    gap: '1rem',
                },
                480: {
                    perPage: 1,
                    gap: '0.5rem',
                }
            }
        }).mount();
    }

    // Initialize the mission & vision carousel
    if (document.getElementById('mission-carousel')) {
        new Splide('#mission-carousel', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 4000,
            pauseOnHover: true,
            pagination: true,
            arrows: false,
            breakpoints: {
                1024: {
                    perPage: 2,
                    gap: '1.5rem',
                },
                768: {
                    perPage: 1,
                    gap: '1rem',
                }
            }
        }).mount();
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll animations for mission cards
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

    // Observe mission cards for animation
    document.querySelectorAll('.mission-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
});
