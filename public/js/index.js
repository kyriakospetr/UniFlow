import { state } from './core/state.js';
import { socket } from './core/socket.js';
import { initChatSystem } from './features/chats/chat.initialize.js';
import { renderInbox } from './features/chats/inbox.js';
import { renderSearch, renderContacts } from './features/contacts/contacts.js';
import { initPostsEvents,renderPostsView } from './features/posts/post.js';

async function initApp() {
    try {
        // We await to get current user
        // So we can load the feed based on the current user
        await fetchCurrentUser();
        initChatSystem();
        initPostsEvents();
        setupEventListeners();
        await renderPostsView();
    } catch (error) {
        console.error('App initialization failed:', error);
        window.location.replace('/login');
    }
}

// Get current user
// We update the state.user
// We create a new socket connection for notifications, messages.
async function fetchCurrentUser() {
    const response = await fetch('/users/me');
    if (!response.ok) throw new Error('Unauthorized');

    const result = await response.json();
    state.user = result.data;

    const display = document.getElementById('usernameDisplay');
    if (display) display.textContent = state.user.username;

    // Socket Connection
    if (!socket.connected) {
        socket.connect();
    }
}

// Logout
async function handleLogout(e) {
    e.preventDefault();
    try {
        if (socket) socket.disconnect();
        await fetch('/auth/logout');
    } catch (err) {
        console.error('Logout failed:', err);
    } finally {
        state.user = null;
        window.location.replace('/login');
    }
}

// Event Listeners
function setupEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const navConfig = {
        'nav-feed': () => {
            renderPostsView();
        },
        'nav-buddies': () => {
            renderSearch();
            renderContacts();
        },
        'nav-messages': () => {
            renderInbox();
        },
        'nav-todos': () => {
            /* renderTodos(); */
        },
    };

    Object.entries(navConfig).forEach(([id, renderFn]) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                updateActiveNav(el);
                renderFn();
            });
        }
    });
}

// We display the active nav item on left sidebar
function updateActiveNav(activeElement) {
    document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('active'));
    activeElement.classList.add('active');
}

document.addEventListener('DOMContentLoaded', initApp);
