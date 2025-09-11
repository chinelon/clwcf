// Walkathon Donation Page JavaScript


// DOM Elements
let formElements = {};
let modal = null;
let copyToast = null;

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    initializeHamburgerMenu();
    initializeCopyButtons();
    initializeForm();
    initializeDonationToggle();
});

function initializePage() {
    // Get modal and toast elements
    modal = document.getElementById('successModal');
    copyToast = document.getElementById('copyToast');
    
    // Add modal close functionality
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });

    console.log('Walkathon donation page initialized successfully');
}

function initializeHamburgerMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (menuToggle && dropdownMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdownMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });
        
        // Close dropdown with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dropdownMenu.classList.contains('active')) {
                dropdownMenu.classList.remove('active');
            }
        });
    }
}

function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            copyToClipboard(textToCopy);
        });
    });
}

function initializeDonationToggle() {
    console.log('Initializing donation toggle...');
    
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const donationCards = document.querySelectorAll('.donation-card');
    
    console.log('Found toggle buttons:', toggleButtons.length);
    console.log('Found donation cards:', donationCards.length);
    
    if (toggleButtons.length === 0) {
        console.error('No toggle buttons found!');
        return;
    }
    
    toggleButtons.forEach((button, index) => {
        console.log(`Adding listener to button ${index}:`, button.getAttribute('data-method'));
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Toggle button clicked:', this.getAttribute('data-method'));
            
            const method = this.getAttribute('data-method');
            
            // Remove active class from all buttons
            toggleButtons.forEach(btn => {
                btn.classList.remove('active');
                console.log('Removed active from:', btn.getAttribute('data-method'));
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            console.log('Added active to:', method);
            
            // Hide all donation cards
            donationCards.forEach(card => {
                card.classList.remove('active');
                console.log('Removed active from card:', card.getAttribute('data-method'));
            });
            
            // Show the selected donation card
            const selectedCard = document.querySelector(`.donation-card[data-method="${method}"]`);
            if (selectedCard) {
                selectedCard.classList.add('active');
                console.log('Added active to card:', method);
            } else {
                console.error('No card found for method:', method);
            }
            
            // Update payment method in form if exists
            const paymentMethodSelect = document.getElementById('paymentMethod');
            if (paymentMethodSelect) {
                const methodMap = {
                    'qr-code': 'qr-code',
                    'bank-transfer': 'bank-transfer',
                    'international': 'international'
                };
                paymentMethodSelect.value = methodMap[method] || '';
                console.log('Updated form payment method to:', methodMap[method]);
            }
        });
    });
    
    // Initialize with first method active
    setTimeout(() => {
        const firstButton = document.querySelector('.toggle-btn[data-method="qr-code"]');
        if (firstButton) {
            console.log('Initializing with QR code method');
            firstButton.click();
        } else {
            console.error('QR code button not found for initialization');
        }
    }, 100);
}

function initializeForm() {
    // Get all form elements
    formElements = {
        form: document.getElementById('donationConfirmationForm'),
        donorName: document.getElementById('donorName'),
        donorEmail: document.getElementById('donorEmail'),
        donationAmount: document.getElementById('donationAmount'),
        paymentMethod: document.getElementById('paymentMethod'),
        transactionRef: document.getElementById('transactionRef'),
        donorMessage: document.getElementById('donorMessage'),
        submitBtn: document.querySelector('.confirm-btn')
    };

    // Add event listeners
    if (formElements.form) {
        formElements.form.addEventListener('submit', handleFormSubmit);
    }

    // Add input validation listeners
    Object.keys(formElements).forEach(key => {
        const element = formElements[key];
        if (element && element.type !== 'submit' && element.tagName !== 'FORM') {
            element.addEventListener('blur', () => validateField(key));
            element.addEventListener('input', () => clearFieldError(key));
        }
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Use the modern clipboard API
        navigator.clipboard.writeText(text).then(() => {
            showCopyToast();
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyToast();
        } else {
            console.error('Fallback: Copying text command was unsuccessful');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopyToast() {
    if (copyToast) {
        copyToast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            copyToast.classList.remove('show');
        }, 3000);
    }
}

function validateField(fieldName) {
    const field = formElements[fieldName];
    if (!field) return true;

    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous error state
    clearFieldError(fieldName);

    switch (fieldName) {
        case 'donorName':
            if (!value) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;

        case 'donorEmail':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'donationAmount':
            const amount = parseFloat(value);
            if (!value || isNaN(amount)) {
                isValid = false;
                errorMessage = 'Donation amount is required';
            } else if (amount < 1000) {
                isValid = false;
                errorMessage = 'Minimum donation amount is ₦1,000';
            } else if (amount > 10000000) {
                isValid = false;
                errorMessage = 'Please contact us directly for donations over ₦10,000,000';
            }
            break;

        case 'paymentMethod':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select a payment method';
            }
            break;
    }

    if (!isValid) {
        showFieldError(fieldName, errorMessage);
    } else {
        showFieldSuccess(fieldName);
    }

    return isValid;
}

function showFieldError(fieldName, message) {
    const field = formElements[fieldName];
    if (!field) return;

    field.classList.add('error');
    field.classList.remove('success');

    // Show error message
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showFieldSuccess(fieldName) {
    const field = formElements[fieldName];
    if (!field) return;

    field.classList.add('success');
    field.classList.remove('error');
}

function clearFieldError(fieldName) {
    const field = formElements[fieldName];
    if (!field) return;

    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function validateForm() {
    const requiredFields = ['donorName', 'donorEmail', 'donationAmount', 'paymentMethod'];
    let isValid = true;

    requiredFields.forEach(fieldName => {
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });

    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    console.log('Donation confirmation form submission started');
    
    if (!validateForm()) {
        console.log('Form validation failed');
        // Scroll to first error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Show loading state
    const submitBtn = formElements.submitBtn;
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }
    
    // Process the donation (without email)
    processDonation();
}

// function processDonation() {
//     // Show success message
//     showSuccessModal();
    
//     // Reset form
//     resetForm();
    
// // Re-enable submit button
//     const submitButton = formElements.form.querySelector('button[type="submit"]');
//     if (submitButton) {
//         submitButton.disabled = false;
//         submitButton.textContent = 'Donate Now';
//     }
// }

function processDonation() {
    // Collect data
    const data = {
        donorName: formElements.donorName.value.trim(),
        donorEmail: formElements.donorEmail.value.trim(),
        donationAmount: formElements.donationAmount.value.trim(),
        paymentMethod: formElements.paymentMethod.value,
        transactionRef: formElements.transactionRef ? formElements.transactionRef.value.trim() : null,
        donorMessage: formElements.donorMessage.value.trim()
    };

    axios.post("http://localhost:3001/donate", data)
        .then(response => {
            console.log("Donation saved:", response.data);
            showSuccessModal();
            resetForm();
        })
        .catch(error => {
            console.error("Donation error:", error);
            alert("Failed to submit donation. Please try again.");
        })
        .finally(() => {
            const submitBtn = formElements.submitBtn;
            if (submitBtn) {
                submitBtn.classList.remove("loading");
                submitBtn.disabled = false;
            }
        });
}


function showSuccessModal() {
    if (modal) {
        modal.classList.add('show');
        // Focus on close button for accessibility
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.focus();
        }
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove('show');
    }
}

function resetForm() {
    if (formElements.form) {
        formElements.form.reset();
        
        // Clear all error and success states
        Object.keys(formElements).forEach(key => {
            const element = formElements[key];
            if (element && element.classList) {
                element.classList.remove('error', 'success');
            }
        });
        
        // Hide all error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.classList.remove('show'));
    }
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Add some interactive enhancements
function addInteractiveEnhancements() {
    // Add hover effects to donation cards
    const donationCards = document.querySelectorAll('.donation-card');
    donationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click animation to copy buttons
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Initialize interactive enhancements after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addInteractiveEnhancements, 100);
});
