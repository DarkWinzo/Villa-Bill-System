const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = document.querySelector('.login-btn');
    const btnText = document.querySelector('.btn-text');
    const loadingSpinner = document.querySelector('.loading-spinner');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password'),
            role: formData.get('role')
        };

        // Validate form
        if (!credentials.username || !credentials.password || !credentials.role) {
            showError('Please fill in all fields');
            return;
        }

        // Show loading state
        setLoading(true);
        hideError();

        try {
            const result = await ipcRenderer.invoke('auth:login', credentials);
            
            if (result.success) {
                // Redirect based on role
                if (result.user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else if (result.user.role === 'cashier') {
                    window.location.href = 'cashier.html';
                }
            } else {
                showError(result.message || 'Login failed');
            }
        } catch (error) {
            showError('An error occurred during login');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    });

    function setLoading(loading) {
        if (loading) {
            btnText.style.display = 'none';
            loadingSpinner.style.display = 'block';
            loginBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            loadingSpinner.style.display = 'none';
            loginBtn.disabled = false;
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Auto-focus username field
    document.getElementById('username').focus();
});