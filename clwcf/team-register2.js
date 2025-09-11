// Team Walkathon 2025 Registration Form JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('teamWalkathonForm');
    const submitBtn = form.querySelector('.register-btn');
    const successModal = document.getElementById('successModal');

    const formElements = {
        form: form,
        // Team Information
        teamName: document.getElementById('teamName'),
        teamSize: document.getElementById('teamSize'),
        teamDescription: document.getElementById('teamDescription'),
        // Team Captain Information
        captainFirstName: document.getElementById('captainFirstName'),
        captainLastName: document.getElementById('captainLastName'),
        captainEmail: document.getElementById('captainEmail'),
        captainDateOfBirth: document.getElementById('captainDateOfBirth'),
        captainPhone: document.getElementById('captainPhone'),
        captainGender: document.getElementById('captainGender'),
        captainTshirt: document.getElementById('captainTshirt'),
        // Emergency Contact
        emergencyName: document.getElementById('emergencyName'),
        emergencyRelation: document.getElementById('emergencyRelation'),
        emergencyPhone: document.getElementById('emergencyPhone'),
        // Medical Info
        medicalConditions: document.getElementById('medicalConditions'),
        // Submit Button
        submitBtn: submitBtn
    };

    init();

    function init() {
        addInputValidation();
        addAutoSave();
        form.addEventListener('submit', handleFormSubmit);

        initializeTermsDropdown();
        initializeHamburgerMenu();
        initializeModal();
        console.log('Team registration form initialized successfully');
    }

    // -------------------------
    // Input Validation
    // -------------------------
    function addInputValidation() {
        Object.keys(formElements).forEach(key => {
            const element = formElements[key];
            if (element && element.tagName !== 'FORM' && element.type !== 'submit') {
                element.addEventListener('blur', () => validateField(key));
                element.addEventListener('input', () => clearFieldError(key));
            }
        });
    }

    function validateField(fieldName) {
        const field = formElements[fieldName];
        //if (!field) return true;
        if (!field || !('value' in field)) return true;

        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        clearFieldError(fieldName);

        switch (fieldName) {
            case 'teamName':
                if (!value) errorMessage = 'Team name is required';
                else if (value.length < 2) errorMessage = 'Team name must be at least 2 characters';
                break;

            case 'teamSize':
                const size = parseInt(value);
                if (!value || isNaN(size)) errorMessage = 'Team size is required';
                else if (size < 2) errorMessage = 'Team must have at least 2 members';
                else if (size > 20) errorMessage = 'Team size cannot exceed 20 members';
                break;

            case 'captainFirstName':
            case 'captainLastName':
                if (!value) errorMessage = 'Team captain name is required';
                else if (value.length < 2) errorMessage = 'Name must be at least 2 characters';
                break;

            case 'captainEmail':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) errorMessage = 'Email is required';
                else if (!emailRegex.test(value)) errorMessage = 'Enter a valid email';
                break;

            case 'captainPhone':
            case 'emergencyPhone':
                const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
                if (!value) errorMessage = 'Phone is required';
                else if (!phoneRegex.test(value.replace(/\s/g, ''))) errorMessage = 'Enter a valid phone number';
                break;

            case 'emergencyName':
                if (!value) errorMessage = 'Emergency contact name is required';
                break;

            case 'captainGender':
            case 'captainTshirt':
                if (!value) errorMessage = `Please select ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
                break;
        }

        if (errorMessage) showFieldError(fieldName, errorMessage);
        else showFieldSuccess(fieldName);

        return !errorMessage;
    }

    function showFieldError(fieldName, message) {
        const field = formElements[fieldName];
        if (!field) return;

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
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) errorDiv.classList.remove('show');
    }

    // function validateForm() {
    //     let isValid = true;
    //     Object.keys(formElements).forEach(key => {
    //         if (!validateField(key)) isValid = false;
    //     });
    //     return isValid;
    // }

    function validateForm() {
        let isValid = true;
        Object.keys(formElements).forEach(key => {
            const field = formElements[key];
            if (!field || !('value' in field)) return; // Skip buttons/non-inputs
            if (!validateField(key)) isValid = false;
        });
        return isValid;
    }


    // -------------------------
    // Form Submission
    // -------------------------
    function handleFormSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            const firstError = form.querySelector('.error');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(submitForm, 500); // simulate slight delay
    }

    function submitForm() {
        const data = {
            team_name: formElements.teamName.value.trim(),
            team_size: formElements.teamSize.value,
            captain_firstname: formElements.captainFirstName.value.trim(),
            captain_lastname: formElements.captainLastName.value.trim(),
            captain_email: formElements.captainEmail.value.trim(),
            captain_dob: formElements.captainDateOfBirth.value.trim(),
            captain_phone: formElements.captainPhone.value.trim(),
            captain_gender: formElements.captainGender.value,
            captain_tshirt: formElements.captainTshirt.value,
            emergency_name: formElements.emergencyName.value.trim(),
            emergency_relation: formElements.emergencyRelation.value.trim(),
            emergency_phone: formElements.emergencyPhone.value.trim(),
            medical_conditions: formElements.medicalConditions.value.trim() || 'None',
            submission_date: new Date().toISOString()
        };

       // axios.post('http://localhost:3001/team-register', data)
        axios.post('https://clwcf.onrender.com/team-register', data)
            .then(response => {
                if (response.data.success) {
                    showSuccessModal();
                    resetForm();
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

    // -------------------------
    // Success Modal
    // -------------------------
    function showSuccessModal() {
        if (successModal) successModal.classList.add('show');
    }

    function initializeModal() {
        const closeBtn = successModal.querySelector('.close-modal');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        successModal.addEventListener('click', e => {
            if (e.target === successModal) closeModal();
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && successModal.classList.contains('show')) closeModal();
        });
    }

    function closeModal() {
        successModal.classList.remove('show');
    }

    function resetForm() {
        form.reset();
        Object.keys(formElements).forEach(key => {
            const element = formElements[key];
            if (element && element.classList) element.classList.remove('error', 'success');
        });

        document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
    }

    // -------------------------
    // Terms & Hamburger Menu
    // -------------------------
    function initializeTermsDropdown() {
        const termsHeader = document.querySelector('.terms-header');
        const termsContent = document.querySelector('.terms-content');
        const dropdownArrow = document.querySelector('.dropdown-arrow');

        if (!termsHeader || !termsContent) return;

        termsContent.style.display = 'none';

        termsHeader.addEventListener('click', () => {
            const isVisible = termsContent.style.display !== 'none';
            termsContent.style.display = isVisible ? 'none' : 'block';
            if (dropdownArrow) dropdownArrow.textContent = isVisible ? '▼' : '▲';
        });
    }

    function initializeHamburgerMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const dropdownMenu = document.getElementById('dropdownMenu');
        if (!menuToggle || !dropdownMenu) return;

        menuToggle.addEventListener('click', e => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        document.addEventListener('click', e => {
            if (!dropdownMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && dropdownMenu.classList.contains('active')) {
                dropdownMenu.classList.remove('active');
            }
        });
    }

    // -------------------------
    // Auto-save Form Draft
    // -------------------------
    function addAutoSave() {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => input.addEventListener('change', saveFormData));
        loadFormData();
    }

    function saveFormData() {
        const data = {};
        Object.keys(formElements).forEach(key => {
            const el = formElements[key];
            if (el && el.value !== undefined) data[key] = el.value;
        });
        localStorage.setItem('teamWalkathonDraft', JSON.stringify(data));
    }

    function loadFormData() {
        const saved = localStorage.getItem('teamWalkathonDraft');
        if (!saved) return;

        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            if (formElements[key]) formElements[key].value = data[key];
        });
    }
});
