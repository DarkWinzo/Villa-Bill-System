const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.querySelector('.error-text');
    const errorClose = document.querySelector('.error-close');
    const loginBtn = document.querySelector('.login-btn');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');

    // Initialize particle system
    initParticleSystem();

    // Password toggle functionality
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = passwordToggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
        
        // Add animation
        passwordToggle.style.transform = 'translateY(-50%) scale(1.2)';
        setTimeout(() => {
            passwordToggle.style.transform = 'translateY(-50%) scale(1)';
        }, 150);
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
                
                // Create success particles
                createSuccessParticles();
                
                // Redirect based on role after animation
                setTimeout(() => {
                    if (result.user.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else if (result.user.role === 'cashier') {
                        window.location.href = 'cashier.html';
                    }
                }, 1500);
            } else {
                showError(result.message || 'Invalid credentials');
                shakeForm();
            }
        } catch (error) {
            showError('Connection error. Please try again.');
            shakeForm();
            console.error('Login error:', error);
        } finally {
            setTimeout(() => setLoading(false), 1500);
        }
    });

    // Input animations and focus handling
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        const wrapper = input.closest('.input-wrapper');
        
        input.addEventListener('focus', () => {
            wrapper.classList.add('focused');
            createInputParticles(wrapper);
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                wrapper.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            wrapper.classList.add('focused');
        }
        
        // Add typing animation
        input.addEventListener('input', () => {
            if (input.value) {
                wrapper.classList.add('focused');
            }
        });
    });

    // Functions
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
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideError();
        }, 5000);
    }

    function hideError() {
        errorMessage.classList.remove('show');
    }

    function showSuccess() {
        const btnBg = document.querySelector('.btn-bg');
        btnBg.style.animation = 'success 1s ease-in-out forwards';
        
        // Add glow effect to card
        const cardGlow = document.querySelector('.card-glow');
        cardGlow.style.opacity = '0.8';
        cardGlow.style.animation = 'glowPulse 0.5s ease-in-out, gradientRotate 2s ease-in-out';
    }

    function shakeForm() {
        const loginCard = document.querySelector('.login-card');
        loginCard.style.animation = 'shake 0.6s ease-in-out';
        setTimeout(() => {
            loginCard.style.animation = 'cardEntrance 1.2s cubic-bezier(0.23, 1, 0.32, 1)';
        }, 600);
    }

    function createSuccessParticles() {
        const card = document.querySelector('.login-card');
        const rect = card.getBoundingClientRect();
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: linear-gradient(45deg, #10B981, #059669);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: successParticle 2s ease-out forwards;
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }

    function createInputParticles(wrapper) {
        const rect = wrapper.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: rgba(124, 58, 237, 0.8);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + rect.height}px;
                animation: inputParticle 1s ease-out forwards;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    function initParticleSystem() {
        const particleContainer = document.querySelector('.particle-container');
        
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(124, 58, 237, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatingParticle ${Math.random() * 10 + 15}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particleContainer.appendChild(particle);
        }
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successParticle {
            0% {
                opacity: 1;
                transform: scale(0) translateY(0) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: scale(1.5) translateY(-80px) rotate(360deg);
            }
        }
        
        @keyframes inputParticle {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-30px) scale(0.5);
            }
        }
        
        @keyframes floatingParticle {
            0% {
                transform: translateY(100vh) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Auto-focus username field with delay for better UX
    setTimeout(() => {
        document.getElementById('username').focus();
    }, 500);
});