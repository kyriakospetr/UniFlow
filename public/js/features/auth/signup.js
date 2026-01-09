document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const errorBox = document.getElementById('errorBox');
    const submitBtn = signupForm?.querySelector('button[type="submit"]');

    if (!signupForm || !errorBox) return;

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear error box
        errorBox.style.display = 'none';
        const formData = new FormData(signupForm);
        const email = formData.get('email')?.trim();
        const username = formData.get('username')?.trim();
        const password = formData.get('password');

        // Client-side Validation Logic
        if (!email || !username || !password) {
            return showError('All fields are required.');
        }
        if (!isValidEmail(email)) {
            return showError('Please enter a valid email address.');
        }
        if(username.length < 5) {
            return showError('Username must be at least 5 characters long.');
        }
        if (password.length < 6) {
            return showError('Password must be at least 6 characters long.');
        }

        try {
            setLoading(true);

            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Replace so he can't go back with the back button
                window.location.replace('/');
            } else {
                // Handling error status codes
                if (response.status === 409) {
                    showError('This email or username is already taken.');
                } else {
                    showError(data.message || 'Registration failed. Please try again.');
                }
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
        submitBtn.innerText = isLoading ? 'Creating Account...' : 'Sign Up';
    }
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
