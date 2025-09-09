// Team Registration Form JavaScript


// DOM Elements
let formElements = {};
let modal = null;

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeHamburgerMenu();
    initializeTermsDropdown();
});

function initializeForm() {
    // Get all form elements
    formElements = {
        form: document.getElementById('teamRegistrationForm'),
        
        // Team Information
        teamName: document.getElementById('teamName'),
        teamSize: document.getElementById('teamSize'),
        teamGoal: document.getElementById('teamGoal'),
        
        // Team Captain Information
        captainName: document.getElementById('captainName'),
        captainEmail: document.getElementById('captainEmail'),
        captainPhone: document.getElementById('captainPhone'),
        captainAge: document.getElementById('captainAge'),
        captainGender: document.getElementById('captainGender'),
        captainTshirt: document.getElementById('captainTshirt'),
        
        // Emergency Contact
        emergencyName: document.getElementById('emergencyName'),
        emergencyRelation: document.getElementById('emergencyRelation'),
        emergencyPhone: document.getElementById('emergencyPhone'),
        
        // Medical Information
        medicalConditions: document.getElementById('medicalConditions'),
        medications: document.getElementById('medications'),
        allergies: document.getElementById('allergies'),
        
        // Terms and Conditions
        termsAccepted: document.getElementById('termsAccepted'),
        
        // Submit button
        submitBtn: document.querySelector('.register-btn')
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

    // Get modal element
    modal = document.getElementById('successModal');
    
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

    console.log('Team registration form initialized successfully');
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

function initializeTermsDropdown() {
    const termsHeader = document.querySelector('.terms-header');
    const termsContent = document.querySelector('.terms-content');
    const dropdownArrow = document.querySelector('.dropdown-arrow');
    
    if (termsHeader && termsContent) {
        // Initially hide terms content
        termsContent.style.display = 'none';
        
        termsHeader.addEventListener('click', function() {
            const isVisible = termsContent.style.display !== 'none';
            
            if (isVisible) {
                termsContent.style.display = 'none';
                if (dropdownArrow) dropdownArrow.textContent = '▼';
            } else {
                termsContent.style.display = 'block';
                if (dropdownArrow) dropdownArrow.textContent = '▲';
            }
        });
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
        case 'teamName':
            if (!value) {
                isValid = false;
                errorMessage = 'Team name is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Team name must be at least 2 characters';
            }
            break;

        case 'teamSize':
            const size = parseInt(value);
            if (!value || isNaN(size)) {
                isValid = false;
                errorMessage = 'Team size is required';
            } else if (size < 2) {
                isValid = false;
                errorMessage = 'Team must have at least 2 members';
            } else if (size > 20) {
                isValid = false;
                errorMessage = 'Team size cannot exceed 20 members';
            }
            break;

        case 'captainName':
            if (!value) {
                isValid = false;
                errorMessage = 'Team captain name is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;

        case 'captainEmail':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'captainPhone':
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!value) {
                isValid = false;
                errorMessage = 'Phone number is required';
            } else if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;

        case 'captainAge':
            const age = parseInt(value);
            if (!value || isNaN(age)) {
                isValid = false;
                errorMessage = 'Age is required';
            } else if (age < 16) {
                isValid = false;
                errorMessage = 'Team captain must be at least 16 years old';
            } else if (age > 100) {
                isValid = false;
                errorMessage = 'Please enter a valid age';
            }
            break;

        case 'emergencyName':
            if (!value) {
                isValid = false;
                errorMessage = 'Emergency contact name is required';
            }
            break;

        case 'emergencyPhone':
            const emergencyPhoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!value) {
                isValid = false;
                errorMessage = 'Emergency contact phone is required';
            } else if (!emergencyPhoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;

        case 'termsAccepted':
            if (!field.checked) {
                isValid = false;
                errorMessage = 'You must accept the terms and conditions';
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
    const requiredFields = [
        'teamName', 'teamSize', 'captainName', 'captainEmail', 
        'captainPhone', 'captainAge', 'captainGender', 'captainTshirt',
        'emergencyName', 'emergencyRelation', 'emergencyPhone', 'termsAccepted'
    ];

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
    
    console.log('Form submission started');
    
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

    // Prepare email data
    const emailData = prepareEmailData();
    // Show success message
    showSuccessModal();
    // Reset form
    resetForm();
    
    // Re-enable submit button
    const submitButton = formElements.form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Register Team';
    }
}

function prepareEmailData() {
    return {
        // Registration Type
        registration_type: 'Team Registration',
        
        // Team Information
        team_name: formElements.teamName.value.trim(),
        team_size: formElements.teamSize.value,
        team_goal: formElements.teamGoal.value.trim() || 'Not specified',
        
        // Team Captain Information
        captain_name: formElements.captainName.value.trim(),
        captain_email: formElements.captainEmail.value.trim(),
        captain_phone: formElements.captainPhone.value.trim(),
        captain_age: formElements.captainAge.value,
        captain_gender: formElements.captainGender.value,
        captain_tshirt: formElements.captainTshirt.value,
        
        // Emergency Contact
        emergency_name: formElements.emergencyName.value.trim(),
        emergency_relation: formElements.emergencyRelation.value.trim(),
        emergency_phone: formElements.emergencyPhone.value.trim(),
        
        // Medical Information
        medical_conditions: formElements.medicalConditions.value.trim() || 'None',
        medications: formElements.medications.value.trim() || 'None',
        allergies: formElements.allergies.value.trim() || 'None',
        
        // Submission Details
        submission_date: new Date().toLocaleDateString(),
        submission_time: new Date().toLocaleTimeString(),
        
        // Email subject
        subject: `Team Registration - ${formElements.teamName.value.trim()}`
    };
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
        
        // Reset terms dropdown
        const termsContent = document.querySelector('.terms-content');
        const dropdownArrow = document.querySelector('.dropdown-arrow');
        if (termsContent) {
            termsContent.style.display = 'none';
        }
        if (dropdownArrow) {
            dropdownArrow.textContent = '▼';
        }
    }
}
