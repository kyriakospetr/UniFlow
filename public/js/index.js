import { renderBuddySearch, fetchMyBuddies } from './buddy.js';

const state = {
    user: null,
};

async function fetchCurrentUser() {
    const display = document.getElementById('usernameDisplay');
    try {
        const response = await fetch('/users/me');
        const result = await response.json();
        if (response.ok) {
            state.user = result.data;
            display.textContent = state.user.username;
        } else {
            window.location.href = '/login';
        }
    } catch (error) {
        window.location.href = '/login';
    }
}

async function handleLogout(e) {
    e.preventDefault();
    await fetch('/auth/logout');
    window.location.href = '/login';
}

function updateActiveNav(activeElement) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    activeElement.classList.add('active');
}

function loadFeed() {
    const feedArea = document.getElementById('feedArea');
    feedArea.innerHTML = '<h4>Welcome to Portal Feed</h4><p>Latest updates...</p>';
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCurrentUser();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const navFeed = document.getElementById('nav-feed');
    const navBuddies = document.getElementById('nav-buddies');
    const navTodos = document.getElementById('nav-todos');

    loadFeed();

    navFeed.addEventListener('click', (e) => {
        e.preventDefault();
        updateActiveNav(navFeed);
        loadFeed();
    });

    navBuddies.addEventListener('click', (e) => {
        e.preventDefault();
        updateActiveNav(navBuddies);
        renderBuddySearch();
        fetchMyBuddies();
    });

    navTodos.addEventListener('click', (e) => {
        e.preventDefault();
        updateActiveNav(navTodos);
        document.getElementById('feedArea').innerHTML = '<h5>My Todos Content</h5>';
    });
});