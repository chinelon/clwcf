// Team Registration Form JavaScript


// DOM Elements
let formElements = {};
//let modal = null;
const form = document.getElementById('teamWalkathonForm');
const submitBtn = form.querySelector('.register-btn');
let modal = document.getElementById('successModal');

form.addEventListener('submit', handleFormSubmit);
// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeHamburgerMenu();
    initializeTermsDropdown();
});

function initializeForm() {
    // Get all form elements
    formElements = {
        form: document.getElementById('teamWalkathonForm'), // changed from 'registrationForm' to 'teamWalkathonForm' on 11 september 2025
        
        // Team Information
        teamName: document.getElementById('teamName'),
        teamSize: document.getElementById('teamSize'),
       // teamGoal: document.getElementById('teamGoal'),
        
        // Team Captain Information
        captainFirstName: document.getElementById('captainFirstName'),
        captainLastName: document.getElementById('captainLastName'),
        captainEmail: document.getElementById('captainEmail'),
        captainPhone: document.getElementById('captainPhone'),
        //captainAge: document.getElementById('captainAge'),
        captainGender: document.getElementById('captainGender'),
        captainTshirt: document.getElementById('captainTshirt'),
        
        // Emergency Contact
        emergencyName: document.getElementById('emergencyName'),
        emergencyRelation: document.getElementById('emergencyRelation'),
        emergencyPhone: document.getElementById('emergencyPhone'),
        
        // Medical Information
        medicalConditions: document.getElementById('medicalConditions'),
       // medications: document.getElementById('medications'),
        //allergies: document.getElementById('allergies'),
        
        // Terms and Conditions
       // termsAccepted: document.getElementById('termsAccepted'),
        
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

// function handleFormSubmit(e) {
//     e.preventDefault();
    
//     console.log('Form submission started');
    
//     if (!validateForm()) {
//         console.log('Form validation failed');
//         // Scroll to first error
//         const firstError = document.querySelector('.error');
//         if (firstError) {
//             firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//         return;
//     }

//     // Show loading state
//     const submitBtn = formElements.submitBtn;
//     if (submitBtn) {
//         submitBtn.classList.add('loading');
//         submitBtn.disabled = true;
//     }

//     // Prepare email data
//     const emailData = prepareEmailData();
//     // Show success message
//     showSuccessModal();
//     // Reset form
//     resetForm();
    
//     // Re-enable submit button
//     const submitButton = formElements.form.querySelector('button[type="submit"]');
//     if (submitButton) {
//         submitButton.disabled = false;
//         submitButton.textContent = 'Register Team';
//     }
// }


// async function handleFormSubmit(e) {
//     e.preventDefault();

//     if (!validateForm()) {
//         const firstError = document.querySelector('.error');
//         if (firstError) {
//             firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//         return;
//     }

//     const submitBtn = formElements.submitBtn;
//     if (submitBtn) {
//         submitBtn.classList.add('loading');
//         submitBtn.disabled = true;
//     }

//     const emailData = prepareEmailData();

//     try {
//         const response = await axios.post("http://localhost:3001/team-register", emailData, {
//             headers: { "Content-Type": "application/json" }
//         });

//         if (response.data.success) {
//             showSuccessModal();
//             resetForm();
//         } else {
//             alert("Error: " + response.data.message);
//         }
//     } catch (error) {
//         console.error("Submission failed:", error);
//         alert("Something went wrong. Please try again later.");
//     }

//     if (submitBtn) {
//         submitBtn.classList.remove('loading');
//         submitBtn.disabled = false;
//     }
// }

// function handleFormSubmit(e) {
//     e.preventDefault();

//     if (!validateForm()) {
//         // Scroll to first error
//         const firstError = formElements.form.querySelector('.error');
//         if (firstError) {
//             firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//         return;
//     }

//     // Show loading state
//     const submitBtn = formElements.form.querySelector('.register-btn');
//     submitBtn.classList.add('loading');
//     submitBtn.disabled = true;

//     // Send form data to backend
//     const teamData = prepareEmailData(); // or rename to prepareTeamData() if you prefer

//     axios.post('http://localhost:3001/team-register', teamData, {
//         headers: { 'Content-Type': 'application/json' }
//     })
//     .then(response => {
//         if (response.data.success) {
//             showSuccessModal();
//             resetForm();
//         } else {
//             alert("Error: " + response.data.message);
//         }
//     })
//     .catch(error => {
//         console.error("Submission failed:", error);
//         alert("Something went wrong. Please try again later.");
//     })
//     .finally(() => {
//         submitBtn.classList.remove('loading');
//         submitBtn.disabled = false;
//     });
// }

function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate short delay before submission
    setTimeout(() => {
        submitForm();
    }, 500);
}

// function submitForm() {
//     // Collect form data
//     const formData = new FormData(form);
//     const data = Object.fromEntries(formData.entries());

//     // Add checkboxes manually (if not included in FormData)
//     const checkboxes = form.querySelectorAll('input[type="checkbox"]');
//     checkboxes.forEach(checkbox => {
//         data[checkbox.name] = checkbox.checked;
//     });

//     // Add submission timestamp
//     data.submissionDate = new Date().toISOString();

//     // Send data to backend using Axios
//     axios.post('http://localhost:3001/team-register', data)
//         .then(response => {
//             if (response.data.success) {
//                 showSuccessModal();
//                 form.reset();
//             } else {
//                 alert('Registration failed: ' + response.data.message);
//             }
//         })
//         .catch(error => {
//             console.error(error);
//             alert('Something went wrong. Please try again.');
//         })
//         .finally(() => {
//             // Reset loading state
//             submitBtn.classList.remove('loading');
//             submitBtn.disabled = false;
//         });
// }

function submitForm() {
    // Map form elements to backend column names
    const data = {
        team_name: formElements.teamName.value.trim(),
        team_size: formElements.teamSize.value,
        // team_goal: formElements.teamGoal ? formElements.teamGoal.value.trim() : 'Not specified',

        captain_name: formElements.captainFirstName.value.trim(),
        captain_last_name: formElements.captainLastName.value.trim(),
        captain_email: formElements.captainEmail.value.trim(),
        captain_phone: formElements.captainPhone.value.trim(),
       // captain_age: formElements.captainAge.value,
        captain_gender: formElements.captainGender.value,
        captain_tshirt: formElements.captainTshirt.value,

        emergency_name: formElements.emergencyName.value.trim(),
        emergency_relation: formElements.emergencyRelation.value.trim(),
        emergency_phone: formElements.emergencyPhone.value.trim(),

        medical_conditions: formElements.medicalConditions.value.trim() || 'None',
        //medications: formElements.medications ? formElements.medications.value.trim() : 'None',
      //  allergies: formElements.allergies ? formElements.allergies.value.trim() : 'None',

        submission_date: new Date().toISOString()
    };

    axios.post('http://localhost:3001/team-register', data)
        .then(response => {
            if (response.data.success) {
                showSuccessModal();
                form.reset();
            } else {
                alert('Registration failed: ' + response.data.message);
            }
        })
        .catch(error => {
            console.error(error);
            alert('Something went wrong. Please try again.');
        })
        .finally(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
}


function prepareEmailData() {
    return {
        // Registration Type
        registration_type: 'Team Registration',
        
        // Team Information
        team_name: formElements.teamName.value.trim(),
        team_size: formElements.teamSize.value,
        
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
        // medications: formElements.medications.value.trim() || 'None',
        // allergies: formElements.allergies.value.trim() || 'None',
        
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
