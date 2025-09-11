// Walkathon 2025 Registration Form JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Form elements
    const form = document.getElementById('walkathonForm');
    const teamSection = document.getElementById('teamSection');
    const teamNameInput = document.getElementById('teamName');
    const teamSizeInput = document.getElementById('teamSize');

    // Modal elements
    const successModal = document.getElementById('successModal');

    // Registration fees (simplified since we don't have registration types)
    const registrationFee = 25; // Default fee

    // Initialize form
    init();

    function init() {
        // Add event listeners
        form.addEventListener('submit', handleFormSubmit);

        // Add input validation
        addInputValidation();

        // Add form auto-save (optional)
        addAutoSave();
    }


    function addInputValidation() {
        const requiredInputs = form.querySelectorAll('input[required], select[required]');

        requiredInputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });

        // Email validation
        const emailInput = document.getElementById('email');
        emailInput.addEventListener('blur', validateEmail);

        // Phone validation
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', formatPhone);
        });

        // Date validation
        const dateInput = document.getElementById('dateOfBirth');
        dateInput.addEventListener('blur', validateAge);

        // Postcode validation
        const postcodeInput = document.getElementById('postcode');
        postcodeInput.addEventListener('blur', validatePostcode);
    }

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();

        if (field.required && !value) {
            showError(field, 'This field is required');
            return false;
        }

        clearError(field);
        return true;
    }

    function validateEmail(e) {
        const email = e.target.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email && !emailRegex.test(email)) {
            showError(e.target, 'Please enter a valid email address');
            return false;
        }

        clearError(e.target);
        return true;
    }

    function formatPhone(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.startsWith('44')) {
                // UK format
                value = value.replace(/(\d{2})(\d{4})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
            } else if (value.startsWith('234')) {
                // Nigerian format
                value = value.replace(/(\d{3})(\d{4})(\d{3})(\d{2})/, '+$1 $2 $3 $4');
            } else if (value.length === 11) {
                // Generic format
                value = value.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
            }
        }
        e.target.value = value;
    }

    // function validateAge(e) {
    //     const birthDate = new Date(e.target.value);
    //     const today = new Date();
    //     const age = today.getFullYear() - birthDate.getFullYear();
    //     const monthDiff = today.getMonth() - birthDate.getMonth();

    //     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    //         age--;
    //     }

    //     if (age < 5) {
    //         showError(e.target, 'Participants must be at least 5 years old');
    //         return false;
    //     }

    //     if (age < 16) {
    //         showInfo(e.target, 'Participants under 16 must be accompanied by an adult');
    //     }

    //     clearError(e.target);
    //     return true;
    // }

    function validateAge(field) {
        const birthDate = new Date(field.value);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        let monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (isNaN(age) || age < 5) {
            showError(field, "You must be at least 5 years old to register.");
            return false;
        }

        clearError(field);
        return true;
    }

    function validatePostcode(e) {
        const postcode = e.target.value.trim().toUpperCase();
        const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/;

        if (postcode && !ukPostcodeRegex.test(postcode)) {
            showError(e.target, 'Please enter a valid UK postcode');
            return false;
        }

        clearError(e.target);
        return true;
    }

    function showError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');

        let errorDiv = field.parentNode.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            field.parentNode.appendChild(errorDiv);
        }

        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }

    function showInfo(field, message) {
        let infoDiv = field.parentNode.querySelector('.info-message');
        if (!infoDiv) {
            infoDiv = document.createElement('div');
            infoDiv.className = 'info-message';
            infoDiv.style.color = '#17a2b8';
            infoDiv.style.fontSize = '12px';
            infoDiv.style.marginTop = '5px';
            field.parentNode.appendChild(infoDiv);
        }

        infoDiv.textContent = message;
        infoDiv.style.display = 'block';
    }

    function clearError(field) {
        if (typeof field === 'object' && field.target) {
            field = field.target;
        }

        field.classList.remove('error');

        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.classList.remove('show');
        }

        if (field.value.trim()) {
            field.classList.add('success');
        } else {
            field.classList.remove('success');
        }
    }

    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('input[required], select[required]');

        requiredFields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });

        // Validate email
        const emailField = document.getElementById('email');
        if (!validateEmail({ target: emailField })) {
            isValid = false;
        }

        // Validate age
        // const dateField = document.getElementById('dateOfBirth');
        // if (!validateAge({ target: dateField })) {
        //     isValid = false;
        // }

        // Validate terms acceptance
        const termsCheckbox = document.getElementById('termsAccepted');
        if (!termsCheckbox.checked) {
            showError(termsCheckbox, 'You must accept the terms and conditions');
            isValid = false;
        }

        // Validate medical consent
        const medicalCheckbox = document.getElementById('medicalConsent');
        if (!medicalCheckbox.checked) {
            showError(medicalCheckbox, 'You must confirm your fitness to participate');
            isValid = false;
        }

        return isValid;
    }

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
        const submitBtn = form.querySelector('.register-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitForm();
        }, 2000);
    }

    function submitForm() {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Add checkboxes that might not be in FormData
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            data[checkbox.name] = checkbox.checked;
        });

        // Add calculated fee (simplified)
        data.registrationFee = registrationFee;
        data.submissionDate = new Date().toISOString();

        // Send registration data to backend using Axios
        axios.post('http://localhost:3001/register', data)
            .then(function (response) {
                // Show success modal
                showSuccessModal(data);
                // Optionally clear draft data
                clearDraftData();
            })
            .catch(function (error) {
                alert('Registration failed. Please try again.');
                console.error(error);
            })
            .finally(function () {
                // Reset loading state
                const submitBtn = form.querySelector('.register-btn');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
    }

    function showSuccessModal(data) {
        successModal.classList.add('show');

        // You could customize the success message based on registration data
        const registrationType = data.registrationType;
        const fee = data.registrationFee;

        // Update modal content if needed
        // const modalBody = successModal.querySelector('.modal-body');
        // modalBody.innerHTML = `<p>Your ${registrationType} registration for £${fee} has been confirmed!</p>`;
    }

    function addAutoSave() {
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            input.addEventListener('change', saveFormData);
        });

        // Load saved data on page load
        loadFormData();
    }

    function saveFormData() {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Add checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            data[checkbox.name] = checkbox.checked;
        });

        localStorage.setItem('walkathonFormDraft', JSON.stringify(data));
    }

    function loadFormData() {
        const savedData = localStorage.getItem('walkathonFormDraft');
        if (!savedData) return;

        try {
            const data = JSON.parse(savedData);

            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox' || field.type === 'radio') {
                        field.checked = data[key];
                    } else {
                        field.value = data[key];
                    }
                }
            });

            // No need to trigger change events for non-existent elements
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
    }

    // Clear draft data after successful submission
    function clearDraftData() {
        localStorage.removeItem('walkathonFormDraft');
    }
});

// Terms and Conditions dropdown toggle function
function toggleTerms() {
    const termsContent = document.getElementById('termsContent');
    const termsArrow = document.getElementById('termsArrow');

    if (termsContent.style.display === 'none' || termsContent.style.display === '') {
        termsContent.style.display = 'block';
        termsArrow.textContent = '▲';
    } else {
        termsContent.style.display = 'none';
        termsArrow.textContent = '▼';
    }
}

// Modal functions (global scope for onclick handlers)
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');

    // Clear draft data after successful submission
    localStorage.removeItem('walkathonFormDraft');

    // Optionally redirect or reset form
    // window.location.href = 'index.html';
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('successModal');
        if (modal.classList.contains('show')) {
            closeModal();
        }
    }
});

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Print registration function (could be added as a button)
function printRegistration() {
    const data = JSON.parse(localStorage.getItem('walkathonRegistration') || '{}');

    if (Object.keys(data).length === 0) {
        alert('No registration data found.');
        return;
    }

    // Create printable content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Walkathon 2025 Registration</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .section { margin-bottom: 20px; }
                .section h3 { color: #2c5aa0; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
                .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .total { font-weight: bold; font-size: 1.2em; color: #2c5aa0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Walkathon 2025 Registration</h1>
                <p>Children Living With Cancer Foundation</p>
            </div>
            
            <div class="section">
                <h3>Personal Information</h3>
                <div class="info-row"><span>Name:</span><span>${data.firstName} ${data.lastName}</span></div>
                <div class="info-row"><span>Email:</span><span>${data.email}</span></div>
                <div class="info-row"><span>Phone:</span><span>${data.phone}</span></div>
            </div>
            
            <div class="section">
                <h3>Registration Details</h3>
                <div class="info-row"><span>Type:</span><span>${data.registrationType}</span></div>
                <div class="info-row"><span>Distance:</span><span>${data.distance}</span></div>
                <div class="info-row"><span>T-Shirt Size:</span><span>${data.tshirtSize}</span></div>
            </div>
            
            <div class="section">
                <h3>Payment</h3>
                <div class="info-row total"><span>Registration Fee:</span><span>£${data.registrationFee}</span></div>
            </div>
            
            <div class="section">
                <p><strong>Event Date:</strong> March 15, 2025</p>
                <p><strong>Location:</strong> Lagos, Nigeria Luth Car Park</p>
                <p><strong>Registration Time:</strong> 10:00 AM</p>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
}
