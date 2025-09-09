// Posts Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize posts page functionality
    initializePostsPage();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});

let allPosts = [];
let currentPosts = [];
let postsPerPage = 9;
let currentPage = 1;

function initializePostsPage() {
    // Get all posts and store them
    allPosts = Array.from(document.querySelectorAll('.post-card'));
    currentPosts = [...allPosts];
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize category filters
    initializeCategoryFilters();
    
    // Initialize sorting
    initializeSorting();
    
    // Initialize load more functionality
    initializeLoadMore();
    
    // Initialize newsletter form
    initializeNewsletterForm();
    
    // Show initial posts
    showPosts();
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 300);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }
}

function performSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
        currentPosts = [...allPosts];
    } else {
        currentPosts = allPosts.filter(post => {
            const title = post.querySelector('h3').textContent.toLowerCase();
            const content = post.querySelector('p').textContent.toLowerCase();
            const category = post.querySelector('.post-category').textContent.toLowerCase();
            
            return title.includes(searchTerm) || 
                   content.includes(searchTerm) || 
                   category.includes(searchTerm);
        });
    }
    
    currentPage = 1;
    showPosts();
    updateResultsCount();
}

function initializeCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
}

function filterByCategory(category) {
    if (category === 'all') {
        currentPosts = [...allPosts];
    } else {
        currentPosts = allPosts.filter(post => {
            return post.getAttribute('data-category') === category;
        });
    }
    
    currentPage = 1;
    showPosts();
    updateResultsCount();
}

function initializeSorting() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortPosts(this.value);
        });
    }
}

function sortPosts(sortBy) {
    switch (sortBy) {
        case 'newest':
            currentPosts.sort((a, b) => {
                const dateA = new Date(a.getAttribute('data-date'));
                const dateB = new Date(b.getAttribute('data-date'));
                return dateB - dateA;
            });
            break;
            
        case 'oldest':
            currentPosts.sort((a, b) => {
                const dateA = new Date(a.getAttribute('data-date'));
                const dateB = new Date(b.getAttribute('data-date'));
                return dateA - dateB;
            });
            break;
            
        case 'popular':
            currentPosts.sort((a, b) => {
                const viewsA = parseInt(a.getAttribute('data-views')) || 0;
                const viewsB = parseInt(b.getAttribute('data-views')) || 0;
                return viewsB - viewsA;
            });
            break;
            
        case 'commented':
            currentPosts.sort((a, b) => {
                const commentsA = parseInt(a.getAttribute('data-comments')) || 0;
                const commentsB = parseInt(b.getAttribute('data-comments')) || 0;
                return commentsB - commentsA;
            });
            break;
    }
    
    currentPage = 1;
    showPosts();
}

function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMorePosts();
        });
    }
}

function showPosts() {
    const postsGrid = document.getElementById('postsGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    // Hide all posts first
    allPosts.forEach(post => {
        post.classList.add('hidden');
        post.style.display = 'none';
    });
    
    // Calculate which posts to show
    const startIndex = 0;
    const endIndex = currentPage * postsPerPage;
    const postsToShow = currentPosts.slice(startIndex, endIndex);
    
    // Show the posts with animation
    postsToShow.forEach((post, index) => {
        post.style.display = 'block';
        setTimeout(() => {
            post.classList.remove('hidden');
        }, index * 100);
    });
    
    // Update load more button
    if (loadMoreBtn) {
        if (endIndex >= currentPosts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.textContent = `Load More Posts (${currentPosts.length - endIndex} remaining)`;
        }
    }
    
    // Scroll to top of posts grid if not first page
    if (currentPage > 1) {
        postsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function loadMorePosts() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    // Show loading state
    loadMoreBtn.style.display = 'none';
    loadingSpinner.style.display = 'flex';
    
    // Simulate loading delay
    setTimeout(() => {
        currentPage++;
        showPosts();
        loadingSpinner.style.display = 'none';
    }, 1000);
}

function updateResultsCount() {
    // You could add a results counter here if needed
    console.log(`Showing ${Math.min(currentPage * postsPerPage, currentPosts.length)} of ${currentPosts.length} posts`);
}

function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmission();
        });
    }
}

function handleNewsletterSubmission() {
    const emailInput = document.getElementById('newsletterEmail');
    const weeklyDigest = document.getElementById('weeklyDigest');
    const eventUpdates = document.getElementById('eventUpdates');
    
    // Validate email
    if (!emailInput.value || !isValidEmail(emailInput.value)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = newsletterForm.querySelector('.subscribe-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate subscription process
    setTimeout(() => {
        // Reset form
        emailInput.value = '';
        weeklyDigest.checked = true;
        eventUpdates.checked = true;
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        showSuccessModal();
        
        // Log subscription data (in real implementation, send to server)
        console.log('Newsletter subscription:', {
            email: emailInput.value,
            weeklyDigest: weeklyDigest.checked,
            eventUpdates: eventUpdates.checked,
            timestamp: new Date().toISOString()
        });
        
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Add click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
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
        zIndex: '10000',
        maxWidth: '300px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
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
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        notification.style.transition = 'transform 0.3s ease';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Post interaction handlers
document.addEventListener('click', function(e) {
    // Handle read more clicks
    if (e.target.classList.contains('read-more') || e.target.classList.contains('read-more-btn')) {
        e.preventDefault();
        
        // In a real implementation, this would navigate to the full post
        showNotification('Full article would open in a real implementation.', 'info');
        
        // Track click for analytics
        console.log('Post clicked:', e.target.closest('.post-card')?.querySelector('h3')?.textContent);
    }
    
    // Handle post card clicks
    if (e.target.closest('.post-card') && !e.target.closest('.read-more')) {
        const postCard = e.target.closest('.post-card');
        const title = postCard.querySelector('h3').textContent;
        
        // Add click effect
        postCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            postCard.style.transform = '';
        }, 150);
        
        console.log('Post card clicked:', title);
    }
});

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

// Intersection Observer for post animations
const observePostsAnimation = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.post-card').forEach(post => {
        observer.observe(post);
    });
};

// Initialize animations when page loads
window.addEventListener('load', observePostsAnimation);

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    // Adjust posts per page based on screen size
    if (window.innerWidth <= 768) {
        postsPerPage = 6;
    } else if (window.innerWidth <= 1024) {
        postsPerPage = 8;
    } else {
        postsPerPage = 9;
    }
    
    // Re-show posts with new pagination
    showPosts();
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Enter to submit newsletter form when email input is focused
    if (e.key === 'Enter' && e.target.id === 'newsletterEmail') {
        e.preventDefault();
        handleNewsletterSubmission();
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
            console.log('User scrolled 25% of the page');
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
            console.log('User scrolled 50% of the page');
        } else if (maxScrollDepth >= 75) {
            console.log('User scrolled 75% of the page');
        }
    }
});
