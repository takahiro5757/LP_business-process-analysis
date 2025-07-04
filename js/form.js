// Form handling for contact form

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        initFormValidation();
        initFormSubmission();
        initFormInteractions();
    }
});

// Form validation
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Form submission validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    clearFieldError(field);
    
    // Required field check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'この項目は必須です';
    }
    
    // Field-specific validation
    if (value && isValid) {
        switch (fieldName) {
            case 'email':
                if (!window.DXDiagnosisLP.validateEmail(value)) {
                    isValid = false;
                    errorMessage = '正しいメールアドレスを入力してください';
                }
                break;
                
            case 'phone':
                if (!window.DXDiagnosisLP.validatePhone(value)) {
                    isValid = false;
                    errorMessage = '正しい電話番号を入力してください';
                }
                break;
                
            case 'company':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = '会社名は2文字以上で入力してください';
                }
                break;
                
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = '氏名は2文字以上で入力してください';
                }
                break;
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    // Validate all required fields
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Check privacy policy checkbox
    const privacyCheckbox = form.querySelector('#privacy');
    if (privacyCheckbox && !privacyCheckbox.checked) {
        showFieldError(privacyCheckbox, 'プライバシーポリシーに同意してください');
        isValid = false;
    }
    
    return isValid;
}

// Form submission
function initFormSubmission() {
    // This would typically connect to a backend service
    // For now, we'll simulate the submission
}

function submitForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = '送信中...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Track form submission
    window.DXDiagnosisLP.trackEvent('form_submit', {
        form_type: 'contact',
        company: data.company,
        industry: data.industry,
        employees: data.employees
    });
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Scroll to success message
        document.querySelector('.success-message').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
    }, 2000);
    
    // In a real implementation, you would send the data to your server:
    /*
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showSuccessMessage();
            form.reset();
        } else {
            showErrorMessage(result.message);
        }
    })
    .catch(error => {
        showErrorMessage('送信中にエラーが発生しました。もう一度お試しください。');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
    */
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    
    // Remove existing messages
    const existingMessage = form.parentNode.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'form-message success-message';
    successDiv.innerHTML = `
        <div class="message-content">
            <div class="message-icon">✓</div>
            <h3>お問い合わせありがとうございます</h3>
            <p>
                お問い合わせを受け付けいたしました。<br>
                担当者より2営業日以内にご連絡させていただきます。
            </p>
            <button class="btn btn-secondary" onclick="this.parentElement.parentElement.remove()">
                閉じる
            </button>
        </div>
    `;
    
    form.parentNode.insertBefore(successDiv, form);
}

// Show error message
function showErrorMessage(message) {
    const form = document.getElementById('contactForm');
    
    // Remove existing messages
    const existingMessage = form.parentNode.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-message error-message';
    errorDiv.innerHTML = `
        <div class="message-content">
            <div class="message-icon">✕</div>
            <h3>送信エラー</h3>
            <p>${message}</p>
            <button class="btn btn-secondary" onclick="this.parentElement.parentElement.remove()">
                閉じる
            </button>
        </div>
    `;
    
    form.parentNode.insertBefore(errorDiv, form);
}

// Form interactions
function initFormInteractions() {
    const form = document.getElementById('contactForm');
    
    // Auto-resize textarea
    const textarea = form.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    
    // Format phone number
    const phoneInput = form.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            // Format as XXX-XXXX-XXXX
            if (value.length >= 11) {
                value = value.substring(0, 11);
                value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{3})(\d{4})(\d*)/, '$1-$2-$3');
            } else if (value.length >= 4) {
                value = value.replace(/(\d{3})(\d*)/, '$1-$2');
            }
            
            this.value = value;
        });
    }
    
    // Industry change handler
    const industrySelect = form.querySelector('#industry');
    if (industrySelect) {
        industrySelect.addEventListener('change', function() {
            window.DXDiagnosisLP.trackEvent('industry_select', {
                industry: this.value
            });
        });
    }
    
    // Employee count change handler
    const employeesSelect = form.querySelector('#employees');
    if (employeesSelect) {
        employeesSelect.addEventListener('change', function() {
            window.DXDiagnosisLP.trackEvent('employees_select', {
                employees: this.value
            });
        });
    }
}

// Auto-save form data to localStorage
function initFormAutoSave() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    // Load saved data
    inputs.forEach(input => {
        const savedValue = localStorage.getItem(`form_${input.name}`);
        if (savedValue && input.type !== 'checkbox' && input.type !== 'radio') {
            input.value = savedValue;
        } else if (savedValue && input.type === 'checkbox') {
            input.checked = savedValue === 'true';
        } else if (savedValue && input.type === 'radio') {
            if (input.value === savedValue) {
                input.checked = true;
            }
        }
    });
    
    // Save data on input
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.type === 'checkbox') {
                localStorage.setItem(`form_${this.name}`, this.checked);
            } else if (this.type === 'radio') {
                if (this.checked) {
                    localStorage.setItem(`form_${this.name}`, this.value);
                }
            } else {
                localStorage.setItem(`form_${this.name}`, this.value);
            }
        });
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        inputs.forEach(input => {
            localStorage.removeItem(`form_${input.name}`);
        });
    });
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', function() {
    initFormAutoSave();
});

// Form field focus tracking for analytics
function initFormAnalytics() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        let focusTime;
        
        input.addEventListener('focus', function() {
            focusTime = Date.now();
            window.DXDiagnosisLP.trackEvent('field_focus', {
                field: this.name
            });
        });
        
        input.addEventListener('blur', function() {
            if (focusTime) {
                const timeSpent = Date.now() - focusTime;
                window.DXDiagnosisLP.trackEvent('field_time', {
                    field: this.name,
                    time_spent: timeSpent
                });
            }
        });
    });
}

// Initialize form analytics
document.addEventListener('DOMContentLoaded', function() {
    initFormAnalytics();
});