// notifications.js
import { openChatWithIds } from '../features/chats/chat.popup.js';

export function showMessageNotification(msg) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    // Notifications details
    const toastId = `toast-${Date.now()}`;
    const senderName = msg.sender?.username || 'User';
    const initial = senderName.charAt(0).toUpperCase();

    const toastHtml = `
        <div id="${toastId}" class="toast shadow-lg border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-primary text-white border-0">
                <strong class="me-auto">New Message</strong>
                <small>Just now</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body d-flex align-items-center p-3" style="cursor: pointer;">
                <div class="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <span class="fw-bold">${initial}</span>
                </div>
                <div>
                    <div class="fw-bold">${senderName}</div>
                    <div class="text-muted small text-truncate" style="max-width: 200px;">${msg.content}</div>
                </div>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);

    if (toastElement && window.bootstrap) {
        const bsToast = new bootstrap.Toast(toastElement, { delay: 5000 });
        bsToast.show();

        const toastBody = toastElement.querySelector('.toast-body');
        toastBody?.addEventListener('click', () => {
            openChatWithIds(msg.conversationId, senderName);
            bsToast.hide();
        });

        toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
    }
}

// Στο notifications.js

export function showPostNotification(data) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toastId = `toast-post-${Date.now()}`;
    const categoryColor = {
        'HOBBY': 'text-danger',
        'STUDY': 'text-warning',
        'TEAM': 'text-success'
    }[data.category] || 'text-primary';

    const toastHtml = `
        <div id="${toastId}" class="toast shadow-lg border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-dark text-white border-0">
                <i class="bi bi- megaphone me-2"></i>
                <strong class="me-auto">New Post Alert</strong>
                <small>Just now</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body p-3" style="cursor: pointer;">
                <div class="d-flex align-items-center mb-1">
                    <span class="fw-bold me-2">@${data.author}</span>
                    <span class="badge bg-light ${categoryColor} border">#${data.category}</span>
                </div>
                <div class="text-dark fw-semibold">${data.title}</div>
                <div class="text-muted small mt-1">Click to view on Collaboration Hub</div>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);

    if (toastElement && window.bootstrap) {
        const bsToast = new bootstrap.Toast(toastElement, { delay: 6000 });
        bsToast.show();

        // Όταν κάνει κλικ, τον πηγαίνουμε στο feed
        toastElement.querySelector('.toast-body').addEventListener('click', () => {
            const navFeed = document.getElementById('nav-feed');
            if (navFeed) navFeed.click(); // Προσομοιώνει το πάτημα του μενού
            bsToast.hide();
        });

        toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
    }
}