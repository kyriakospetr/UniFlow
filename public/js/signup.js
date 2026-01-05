document.addEventListener('DOMContentLoaded', () => {
    const errorBox = document.getElementById('errorBox');
    
    // Signup Form 
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorBox.style.display = 'none';

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Success! Redirect to login
                    alert('Registration successful! You can now log in.');
                    window.location.href = '/';
                } else {
                    const errorMessage = data.details ? data.details[0].message : (data.error || data.message || 'Registration failed.');
                    errorBox.innerText = errorMessage;
                    errorBox.style.display = 'block';
                }
            } catch (err) {
                errorBox.innerText = 'Connection error. Please try again later.';
                errorBox.style.display = 'block';
            }
        });
    }
});