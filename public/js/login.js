document.addEventListener('DOMContentLoaded', () => {
    const errorBox = document.getElementById('errorBox');

    // Login Form 
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorBox.style.display = 'none';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;


            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.href = '/';
                } else {
                    errorBox.innerText = data.message || 'Invalid email or password.';
                    errorBox.style.display = 'block';
                }
            } catch (err) {
                errorBox.innerText = 'Connection error. Please try again later.';
                errorBox.style.display = 'block';
            }
        });
    }
});