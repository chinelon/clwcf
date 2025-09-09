// Support Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize support page functionality
    initializeSupportPage();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});

function initializeSupportPage() {
    // Initialize all support forms
    initializeForms();
    
    // Smooth scrolling for quick access cards
    initializeQuickAccess();
    
    // Form validation
    setupFormValidation();
}

function initializeForms() {
    const forms = [
        'emergencyForm',
        'financialForm', 
        'counselingForm',
        'practicalForm',
        'generalContactForm'
    ];
    
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmission(formId, this);
            });
        }
    });
}

function initializeQuickAccess() {
    const quickAccessCards = document.querySelectorAll('.quick-access-card');
    
    quickAccessCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add highlight effect
                targetElement.style.boxShadow = '0 0 20px rgba(23, 162, 184, 0.3)';
                setTimeout(() => {
                    targetElement.style.boxShadow = '';
                }, 2000);
            }
        });
    });
}

function setupFormValidation() {
    // Real-time validation for required fields
    const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEmail(this);
        });
    });
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isValid = value !== '';
    
    if (isValid) {
        field.classList.remove('error');
        field.style.borderColor = '#17a2b8';
        removeErrorMessage(field);
    } else {
        field.classList.add('error');
        field.style.borderColor = '#e74c3c';
        showErrorMessage(field, 'This field is required');
    }
    
    return isValid;
}

function validateEmail(emailField) {
    const email = emailField.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = email === '' || emailRegex.test(email);
    
    if (isValid) {
        emailField.classList.remove('error');
        emailField.style.borderColor = email ? '#17a2b8' : '#e0e0e0';
        removeErrorMessage(emailField);
    } else {
        emailField.classList.add('error');
        emailField.style.borderColor = '#e74c3c';
        showErrorMessage(emailField, 'Please enter a valid email address');
    }
    
    return isValid;
}

function formatPhoneNumber(phoneField) {
    let value = phoneField.value.replace(/\D/g, '');
    
    // Format based on length
    if (value.length <= 10) {
        // UK format
        if (value.length > 6) {
            value = value.replace(/(\d{4})(\d{3})(\d{0,3})/, '$1 $2 $3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{4})(\d{0,3})/, '$1 $2');
        }
    } else {
        // International format
        value = value.replace(/(\d{2})(\d{4})(\d{3})(\d{0,4})/, '+$1 $2 $3 $4');
    }
    
    phoneField.value = value.trim();
}

function showErrorMessage(field, message) {
    removeErrorMessage(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function removeErrorMessage(field) {
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function handleFormSubmission(formId, form) {
    // Validate form before submission
    if (!validateForm(form)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    showLoadingState(form);
    
    // Get form data
    const formData = getFormData(form);
    
    // Simulate form submission
    setTimeout(() => {
        hideLoadingState(form);
        
        // Show success message based on form type
        let successMessage = getSuccessMessage(formId);
        showSuccessModal(successMessage);
        
        // Reset form
        resetForm(form);
        
        // Send data (in real implementation, this would be an API call)
        console.log(`${formId} submitted:`, formData);
        
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email fields
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (!validateEmail(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            // Handle multiple values (like checkboxes)
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

function getSuccessMessage(formId) {
    const messages = {
        'emergencyForm': 'Your emergency request has been submitted. Our team will contact you within 2 hours.',
        'financialForm': 'Your financial assistance application has been received. We will review it and get back to you within 3-5 business days.',
        'counselingForm': 'Your counseling request has been submitted. A counselor will contact you within 24 hours to schedule your session.',
        'practicalForm': 'Your practical support request has been received. Our support team will contact you within 24 hours.',
        'generalContactForm': 'Thank you for your message. We will get back to you within 24 hours.'
    };
    
    return messages[formId] || 'Your request has been submitted successfully.';
}

function showLoadingState(form) {
    const submitBtn = form.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        submitBtn.style.opacity = '0.7';
    }
}

function hideLoadingState(form) {
    const submitBtn = form.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        
        // Restore original text based on form type
        const originalTexts = {
            'emergencyForm': 'Submit Emergency Request',
            'financialForm': 'Submit Application',
            'counselingForm': 'Request Counseling',
            'practicalForm': 'Request Support',
            'generalContactForm': 'Send Message'
        };
        
        const formId = form.id;
        submitBtn.textContent = originalTexts[formId] || 'Submit';
    }
}

function resetForm(form) {
    form.reset();
    
    // Remove error states
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
        field.style.borderColor = '#e0e0e0';
    });
    
    // Remove error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
}

function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const modalBody = modal.querySelector('.modal-body p');
    
    if (modal && modalBody) {
        modalBody.textContent = message;
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

// File upload handling
document.addEventListener('change', function(e) {
    if (e.target.type === 'file') {
        handleFileUpload(e.target);
    }
});

function handleFileUpload(fileInput) {
    const files = fileInput.files;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    for (let file of files) {
        if (file.size > maxSize) {
            showNotification(`File "${file.name}" is too large. Maximum size is 5MB.`, 'error');
            fileInput.value = '';
            return;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showNotification(`File "${file.name}" is not a supported format.`, 'error');
            fileInput.value = '';
            return;
        }
    }
    
    if (files.length > 0) {
        showNotification(`${files.length} file(s) selected successfully.`, 'success');
    }
}

// Smooth scrolling for all anchor links
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

// Resource links tracking (for analytics)
document.querySelectorAll('.resource-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // In a real implementation, you would track this click
        console.log('Resource clicked:', this.textContent);
    });
});

// Emergency contact click tracking
document.querySelectorAll('.emergency-box').forEach(box => {
    box.addEventListener('click', function() {
        // In a real implementation, you might want to track emergency contact usage
        console.log('Emergency contact accessed');
    });
});
