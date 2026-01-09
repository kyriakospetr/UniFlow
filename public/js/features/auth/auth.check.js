// Fast auth check for the user
// If he is not verified, we send him to login
// This only for client side, on each protected request we verify the user
(async function() {
    try {
        const res = await fetch('/users/me');
        if (!res.ok) {
            window.location.replace('/login');
            document.documentElement.style.display = 'none';
        }
    } catch {
        window.location.replace('/login');
        document.documentElement.style.display = 'none';
    }
})();