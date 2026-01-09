document.addEventListener('DOMContentLoaded', () => {
    const errorBox = document.getElementById('errorBox');
    const loginForm = document.getElementById('loginForm');
    const submitBtn = loginForm?.querySelector('button[type="submit"]');

    if (!errorBox || !loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear error box 
        errorBox.style.display = 'none';
        errorBox.innerText = '';

        const email = document.getElementById('email')?.value.trim();
        const password = document.getElementById('password')?.value;

        // Basic client-side validation
        if (!email || !password) {
            showError('Please fill in all fields.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Replace so he can't go back with the back button
                window.location.replace('/');
            } else {
                showError(data.message || 'Invalid credentials. Please try again.');
            }
        } catch (err) {
            showError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    });

    function showError(msg) {
        errorBox.innerText = msg;
        errorBox.style.display = 'block';
    }

    function setLoading(isLoading) {
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        submitBtn.innerText = isLoading ? 'Logging in...' : 'Login';
    }
});