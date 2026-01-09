// inbox.js
import { elements } from '../../core/elements.js';
import { state } from '../../core/state.js';
import { openChatWithIds } from './chat.popup.js';
import { openNewChatPopup } from './new.chat.popup.js';

export async function renderInbox() {
    if (!elements.feedArea) return;
    elements.feedArea.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4>Recent Conversations</h4>
                <button class="btn btn-outline-primary btn-sm" id="btnNewChat">
                    <i class="bi bi-plus-circle me-1"></i> New Chat
                </button>
            </div>
            <div id="inboxList" class="list-group shadow-sm">
                <div class="text-center p-5"><span class="spinner-border text-primary"></span></div>
            </div>
        `;
    // Attach event listener dynamically
    document.getElementById('btnNewChat')?.addEventListener('click', openNewChatPopup);

    // We list all the conversations
    try {
        const response = await fetch('/conversations');
        const result = await response.json();
        const currentList = elements.inboxList;

        if (!currentList) return;

        if (response.ok && result.data && result.data.length > 0) {
            currentList.innerHTML = '';
            result.data.forEach((convo) => {
                currentList.appendChild(createInboxElement(convo));
            });
        } else {
            renderEmptyInboxState(currentList);
        }
    } catch (error) {
        console.error('Inbox error:', error);
    }
}

// Each conversation element on inbox
export function createInboxElement(convo) {
    const isGroup = convo.type === 'GROUP';
    const currentUser = state.user;
    if (!currentUser) return document.createElement('div');

    const otherUser = convo.participants.find((p) => p.id !== currentUser.id);
    const chatName = isGroup ? convo.name || 'Unnamed Group' : otherUser?.username || 'Unknown User';
    const lastMsg = convo.lastMessageContent || 'No messages yet';

    let time = '';
    if (convo.lastMessageAt) {
        time = new Date(convo.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const button = document.createElement('button');
    button.className = 'list-group-item list-group-item-action d-flex align-items-center p-3';
    button.dataset.id = convo.id;
    button.onclick = () => openChatWithIds(convo.id, chatName);

    const icon = isGroup ? '<i class="bi bi-people-fill"></i>' : '<i class="bi bi-person-fill"></i>';
    const bgClass = isGroup ? 'bg-warning' : 'bg-info';

    button.innerHTML = `
        <div class="rounded-circle ${bgClass} text-white d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 45px; height: 45px; flex-shrink: 0;">${icon}</div>
        <div class="w-100 overflow-hidden">
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-1 fw-bold text-truncate" style="max-width: 80%;">${chatName}</h6>
                <small style="font-size: 0.75rem;">${time}</small>
            </div>
            <div class="small text-truncate text-muted last-message-preview">${lastMsg}</div>
        </div>
    `;
    return button;
}

// If the user has no conversations
function renderEmptyInboxState(container) {
    container.innerHTML = `
        <div class="text-center p-5 text-muted">
            <i class="bi bi-chat-dots display-4"></i>
            <p class="mt-3">No conversations yet.</p>
            <button class="btn btn-sm btn-primary" id="goFindBuddies">Find Buddies</button>
        </div>`;
    document.getElementById('goFindBuddies')?.addEventListener('click', () => {
        elements.navBuddies?.click();
    });
}
