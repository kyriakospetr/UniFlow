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