const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.querySelector('.error-text');
    const errorClose = document.querySelector('.error-close');
    const loginBtn = document.querySelector('.login-btn');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');

    // Password toggle functionality
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = passwordToggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Error close functionality
    errorClose.addEventListener('click', () => {
        hideError();
    });

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const credentials = {
            username: formData.get('username').trim(),
            password: formData.get('password')
        };

        // Validate form
        if (!credentials.username || !credentials.password) {
            showError('Please fill in all fields');
            return;
        }

        // Show loading state
        setLoading(true);
        hideError();

        try {
            const result = await ipcRenderer.invoke('auth:login', credentials);
            
            if (result.success) {
                // Show success animation
                showSuccess();
                
                // Redirect based on role after animation
                setTimeout(() => {
                    if (result.user.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else if (result.user.role === 'cashier') {
                        window.location.href = 'cashier.html';
                    }
                }, 1000);
            } else {
                showError(result.message || 'Invalid credentials');
            }
        } catch (error) {
            showError('Connection error. Please try again.');
            console.error('Login error:', error);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    });

    // Input animations
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    function setLoading(loading) {
        if (loading) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }

    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.add('show');
        
        // Add shake animation to form
        loginForm.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginForm.style.animation = '';
        }, 500);
    }

    function hideError() {
        errorMessage.classList.remove('show');
    }

    function showSuccess() {
        const btnBg = document.querySelector('.btn-bg');
        btnBg.style.animation = 'success 0.5s ease-in-out forwards';
        
        // Add success particles
        createSuccessParticles();
    }

    function createSuccessParticles() {
        const card = document.querySelector('.login-card');
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #10B981;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: successParticle 1s ease-out forwards;
            `;
            card.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    // Add success particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successParticle {
            0% {
                opacity: 1;
                transform: scale(0) translateY(0);
            }
            100% {
                opacity: 0;
                transform: scale(1) translateY(-50px);
            }
        }
    `;
    document.head.appendChild(style);

    // Auto-focus username field
    document.getElementById('username').focus();
});