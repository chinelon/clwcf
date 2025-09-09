// Gallery Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery functionality
    initializeGallery();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});

let allImages = [];
let currentImages = [];
let currentImageIndex = 0;
let imagesLoaded = 12; // Initially show 12 images
const imagesPerLoad = 6;

function initializeGallery() {
    // Get all gallery items
    allImages = Array.from(document.querySelectorAll('.gallery-item'));
    currentImages = [...allImages];
    
    // Initialize filters
    initializeFilters();
    
    // Initialize modal functionality
    initializeModal();
    
    // Initialize load more functionality
    initializeLoadMore();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize statistics counter
    initializeStatsCounter();
    
    // Show initial images
    showImages();
}

function initializeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active state
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter images
            const filter = this.getAttribute('data-filter');
            filterImages(filter);
        });
    });
}

function filterImages(filter) {
    if (filter === 'all') {
        currentImages = [...allImages];
    } else {
        currentImages = allImages.filter(item => {
            const categories = item.getAttribute('data-category').split(' ');
            return categories.includes(filter);
        });
    }
    
    // Reset load counter
    imagesLoaded = Math.min(12, currentImages.length);
    
    // Show filtered images with animation
    showImages(true);
}

function showImages(animated = false) {
    // Hide all images first
    allImages.forEach(item => {
        item.classList.add('filtered-out');
        item.style.display = 'none';
    });
    
    // Show current images up to the loaded count
    const imagesToShow = currentImages.slice(0, imagesLoaded);
    
    imagesToShow.forEach((item, index) => {
        item.classList.remove('filtered-out');
        item.classList.add('filtered-in');
        item.style.display = 'block';
        
        if (animated) {
            // Add staggered animation
            item.style.animationDelay = `${index * 0.1}s`;
        }
    });
    
    // Update load more button
    updateLoadMoreButton();
}

function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreImages();
        });
    }
}

function loadMoreImages() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    // Show loading state
    const originalText = loadMoreBtn.textContent;
    loadMoreBtn.innerHTML = '<span class="loading"></span> Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading delay
    setTimeout(() => {
        imagesLoaded = Math.min(imagesLoaded + imagesPerLoad, currentImages.length);
        showImages(true);
        
        // Reset button
        loadMoreBtn.textContent = originalText;
        loadMoreBtn.disabled = false;
    }, 1000);
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        if (imagesLoaded >= currentImages.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
            const remaining = currentImages.length - imagesLoaded;
            loadMoreBtn.textContent = `Load More Images (${remaining} remaining)`;
        }
    }
}

function initializeModal() {
    // Add click listeners to view buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-btn') || e.target.closest('.view-btn')) {
            e.preventDefault();
            const btn = e.target.classList.contains('view-btn') ? e.target : e.target.closest('.view-btn');
            openModal(btn);
        }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('imageModal');
        if (modal && modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    previousImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });
}

function openModal(btn) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    // Get image data
    const imageSrc = btn.getAttribute('data-image');
    const title = btn.getAttribute('data-title');
    const description = btn.getAttribute('data-description');
    
    // Find current image index in visible images
    const galleryItem = btn.closest('.gallery-item');
    const visibleImages = currentImages.slice(0, imagesLoaded);
    currentImageIndex = visibleImages.indexOf(galleryItem);
    
    // Set modal content
    modalImage.src = imageSrc;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    
    // Show modal with animation
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Track modal open event
    console.log('Image modal opened:', title);
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    
    // Restore body scroll
    document.body.style.overflow = '';
}

function previousImage() {
    const visibleImages = currentImages.slice(0, imagesLoaded);
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : visibleImages.length - 1;
    updateModalImage();
}

function nextImage() {
    const visibleImages = currentImages.slice(0, imagesLoaded);
    currentImageIndex = currentImageIndex < visibleImages.length - 1 ? currentImageIndex + 1 : 0;
    updateModalImage();
}

function updateModalImage() {
    const visibleImages = currentImages.slice(0, imagesLoaded);
    const currentItem = visibleImages[currentImageIndex];
    const viewBtn = currentItem.querySelector('.view-btn');
    
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    // Get image data
    const imageSrc = viewBtn.getAttribute('data-image');
    const title = viewBtn.getAttribute('data-title');
    const description = viewBtn.getAttribute('data-description');
    
    // Update modal content with fade effect
    modalImage.style.opacity = '0';
    setTimeout(() => {
        modalImage.src = imageSrc;
        modalImage.alt = title;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalImage.style.opacity = '1';
    }, 150);
}

function shareImage() {
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    
    if (navigator.share) {
        navigator.share({
            title: modalTitle.textContent,
            text: `Check out this image from Children Living With Cancer Foundation: ${modalTitle.textContent}`,
            url: window.location.href
        }).then(() => {
            showNotification('Image shared successfully!', 'success');
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    const modalTitle = document.getElementById('modalTitle');
    const shareText = `Check out this image from Children Living With Cancer Foundation: ${modalTitle.textContent} - ${window.location.href}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Share link copied to clipboard!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Share link copied to clipboard!', 'success');
    }
}

function downloadImage() {
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    
    // Create download link
    const link = document.createElement('a');
    link.href = modalImage.src;
    link.download = `${modalTitle.textContent.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Image download started!', 'success');
    
    // Track download event
    console.log('Image downloaded:', modalTitle.textContent);
}

function initializeAnimations() {
    // Intersection Observer for scroll animations
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
    
    // Observe gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
    });
    
    // Observe stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        observer.observe(card);
    });
}

function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                startCounters();
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.gallery-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    function startCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10001',
        maxWidth: '300px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Lazy loading for images
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
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

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    // Adjust images per load based on screen size
    if (window.innerWidth <= 768) {
        imagesPerLoad = 4;
    } else if (window.innerWidth <= 1024) {
        imagesPerLoad = 5;
    } else {
        imagesPerLoad = 6;
    }
});

// Track scroll depth for analytics
let maxScrollDepth = 0;
window.addEventListener('scroll', function() {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track milestone scroll depths
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
            console.log('User scrolled 25% of gallery page');
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
            console.log('User scrolled 50% of gallery page');
        } else if (maxScrollDepth >= 75) {
            console.log('User scrolled 75% of gallery page');
        }
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add touch/swipe support for mobile modal navigation
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    const modal = document.getElementById('imageModal');
    if (modal && modal.style.display === 'block') {
        touchStartX = e.changedTouches[0].screenX;
    }
});

document.addEventListener('touchend', function(e) {
    const modal = document.getElementById('imageModal');
    if (modal && modal.style.display === 'block') {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            nextImage();
        } else {
            // Swipe right - previous image
            previousImage();
        }
    }
}

// Initialize lazy loading when page loads
window.addEventListener('load', function() {
    initializeLazyLoading();
});

// Add error handling for image loading
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.log('Image failed to load:', e.target.src);
        // You could add a placeholder image here
        e.target.style.display = 'none';
    }
}, true);

// Add focus management for accessibility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
    
    // Focus first element
    firstElement.focus();
}

// Apply focus trap when modal opens
const originalOpenModal = openModal;
openModal = function(btn) {
    originalOpenModal(btn);
    const modal = document.getElementById('imageModal');
    trapFocus(modal);
};
