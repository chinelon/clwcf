// Donation Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize donation form
    initializeDonationForm();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});

function initializeDonationForm() {
    // Donation type selection
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            typeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateDonationSummary();
        });
    });

    // Amount selection
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.querySelector('.custom-amount-input');
    const customAmountField = document.getElementById('customAmount');

    amountButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            amountButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.classList.contains('custom-btn')) {
                customAmountInput.style.display = 'block';
                customAmountField.focus();
            } else {
                customAmountInput.style.display = 'none';
                updateDonationSummary();
            }
        });
    });

    // Custom amount input
    if (customAmountField) {
        customAmountField.addEventListener('input', function() {
            updateDonationSummary();
        });
    }

    // Payment method selection
    const paymentButtons = document.querySelectorAll('.payment-btn');
    const paymentForms = document.querySelectorAll('.payment-form');

    paymentButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            paymentButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const method = this.getAttribute('data-method');
            paymentForms.forEach(form => {
                form.classList.remove('active');
            });
            
            const targetForm = document.querySelector(`.${method}-form`);
            if (targetForm) {
                targetForm.classList.add('active');
            }
        });
    });

    // Gift Aid checkbox
    const giftAidCheckbox = document.getElementById('giftAid');
    if (giftAidCheckbox) {
        giftAidCheckbox.addEventListener('change', function() {
            updateDonationSummary();
        });
    }

    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            this.value = formattedValue;
        });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }

    // CVV input restriction
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    // Submit donation
    const submitButton = document.getElementById('submitDonation');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            processDonation();
        });
    }

    // Initialize summary
    updateDonationSummary();
}

function updateDonationSummary() {
    const activeAmountBtn = document.querySelector('.amount-btn.active');
    const customAmountField = document.getElementById('customAmount');
    const giftAidCheckbox = document.getElementById('giftAid');
    
    let amount = 0;
    
    if (activeAmountBtn && activeAmountBtn.classList.contains('custom-btn')) {
        amount = parseFloat(customAmountField.value) || 0;
    } else if (activeAmountBtn) {
        amount = parseFloat(activeAmountBtn.getAttribute('data-amount')) || 0;
    }
    
    const giftAidAmount = giftAidCheckbox && giftAidCheckbox.checked ? amount * 0.25 : 0;
    const totalAmount = amount + giftAidAmount;
    
    // Update summary display
    const summaryAmount = document.querySelector('.summary-amount');
    const giftAidRow = document.querySelector('.gift-aid-row');
    const giftAidAmountSpan = document.querySelector('.gift-aid-amount');
    const totalAmountSpan = document.querySelector('.total-amount');
    const btnAmount = document.querySelector('.btn-amount');
    
    if (summaryAmount) summaryAmount.textContent = `₦${amount.toFixed(2)}`;
    if (giftAidAmountSpan) giftAidAmountSpan.textContent = `₦${giftAidAmount.toFixed(2)}`;
    if (totalAmountSpan) totalAmountSpan.textContent = `₦${totalAmount.toFixed(2)}`;
    if (btnAmount) btnAmount.textContent = `₦${amount}`;
    
    if (giftAidRow) {
        giftAidRow.style.display = giftAidAmount > 0 ? 'flex' : 'none';
    }
}

function processDonation() {
    // Validate form
    if (!validateDonationForm()) {
        return;
    }
    
    // Get form data
    const formData = getDonationFormData();
    
    // Simulate payment processing
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        showSuccessModal(formData.amount);
    }, 2000);
}

function validateDonationForm() {
    const requiredFields = ['firstName', 'lastName', 'email'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (field) {
            field.style.borderColor = '#e0e0e0';
        }
    });
    
    // Validate amount
    const activeAmountBtn = document.querySelector('.amount-btn.active');
    const customAmountField = document.getElementById('customAmount');
    let amount = 0;
    
    if (activeAmountBtn && activeAmountBtn.classList.contains('custom-btn')) {
        amount = parseFloat(customAmountField.value) || 0;
    } else if (activeAmountBtn) {
        amount = parseFloat(activeAmountBtn.getAttribute('data-amount')) || 0;
    }
    
    if (amount <= 0) {
        alert('Please select a valid donation amount.');
        isValid = false;
    }
    
    // Validate payment method specific fields
    const activePaymentBtn = document.querySelector('.payment-btn.active');
    if (activePaymentBtn) {
        const method = activePaymentBtn.getAttribute('data-method');
        
        if (method === 'card') {
            const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
            cardFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !field.value.trim()) {
                    field.style.borderColor = '#e74c3c';
                    isValid = false;
                } else if (field) {
                    field.style.borderColor = '#e0e0e0';
                }
            });
        }
    }
    
    if (!isValid) {
        alert('Please fill in all required fields.');
    }
    
    return isValid;
}

function getDonationFormData() {
    const activeAmountBtn = document.querySelector('.amount-btn.active');
    const customAmountField = document.getElementById('customAmount');
    const activeTypeBtn = document.querySelector('.type-btn.active');
    const activePaymentBtn = document.querySelector('.payment-btn.active');
    
    let amount = 0;
    if (activeAmountBtn && activeAmountBtn.classList.contains('custom-btn')) {
        amount = parseFloat(customAmountField.value) || 0;
    } else if (activeAmountBtn) {
        amount = parseFloat(activeAmountBtn.getAttribute('data-amount')) || 0;
    }
    
    return {
        amount: amount,
        type: activeTypeBtn ? activeTypeBtn.getAttribute('data-type') : 'one-time',
        paymentMethod: activePaymentBtn ? activePaymentBtn.getAttribute('data-method') : 'card',
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        purpose: document.getElementById('donationPurpose').value,
        giftAid: document.getElementById('giftAid').checked,
        newsletter: document.getElementById('newsletter').checked,
        anonymous: document.getElementById('anonymous').checked
    };
}

function showLoadingState() {
    const submitBtn = document.getElementById('submitDonation');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">Processing...</span><span class="btn-amount">⏳</span>';
    }
}

function hideLoadingState() {
    const submitBtn = document.getElementById('submitDonation');
    const amount = document.querySelector('.btn-amount').textContent;
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="btn-text">Donate Now</span><span class="btn-amount">${amount}</span>`;
    }
}

function showSuccessModal(amount) {
    const modal = document.getElementById('successModal');
    const donationAmountSpan = document.getElementById('donationAmount');
    
    if (modal && donationAmountSpan) {
        donationAmountSpan.textContent = `£${amount}`;
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
        
        // Reset form or redirect
        resetDonationForm();
    }
}

function resetDonationForm() {
    // Reset to default values
    const defaultAmountBtn = document.querySelector('.amount-btn[data-amount="100"]');
    if (defaultAmountBtn) {
        document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
        defaultAmountBtn.classList.add('active');
    }
    
    // Clear custom amount
    const customAmountInput = document.querySelector('.custom-amount-input');
    if (customAmountInput) {
        customAmountInput.style.display = 'none';
        document.getElementById('customAmount').value = '';
    }
    
    // Clear form fields
    const formFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postcode'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = '';
            field.style.borderColor = '#e0e0e0';
        }
    });
    
    // Reset checkboxes
    const checkboxes = ['giftAid', 'newsletter', 'anonymous'];
    checkboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.checked = false;
        }
    });
    
    // Update summary
    updateDonationSummary();
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
