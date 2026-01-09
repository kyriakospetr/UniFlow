import { elements } from '../../core/elements.js';
import { socket } from '../../core/socket.js';
import { state } from '../../core/state.js'; 

export async function openChat(participantsIds, groupName = null) {
    prepareChatUI(groupName ?? 'Chat');
    try {
        const response = await fetch('/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participantsIds, groupName }),
        });
        const result = await response.json();

        // Conversation exists or a new one created
        if (response.ok || response.status === 409) {
            const conversationId = result.data?.id;
            if (conversationId) {
                initializeChatSession(conversationId);
                await loadConversationMessages(conversationId);
            }
        }
    } catch (error) {
        console.error('Error opening chat:', error);
        showChatError('Failed to load chat.');
    }
}

// We open chats directly from the inbox
export async function openChatWithIds(conversationId, chatName = 'Chat') {
    prepareChatUI(chatName);
    initializeChatSession(conversationId);
    await loadConversationMessages(conversationId);
}

// Send Message function
export async function sendMessage(e) {
    if(e) e.preventDefault();

    const input = elements.chatInput;
    if (!input) return;

    const content = input.value;
    const conversationId = elements.chatPopup?.dataset.conversationId;

    if (!state.user || !content || !conversationId) return;

    // We disable input, button till the messages successfully is created
    toggleChatInput(false);

    try {
        const response = await fetch(`/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });
        const result = await response.json();

        // We append the message to the ui, 
        // There is no need to load all the messages
        if (response.ok) {
            input.value = '';
            appendMessageToUI(result.data, true);
        }
    } catch (error) {
        console.error('Failed to send message:', error);
    } finally {
        toggleChatInput(true);
        input.focus();
    }
}

export function appendMessageToUI(msg, isMine = true) {
    if (!elements.chatMessages) return;
    elements.chatMessages.insertAdjacentHTML('beforeend', renderMessageHtml(msg, isMine));
    scrollToBottom();
}

export function closeChatPopup() {
    if (!elements.chatPopup || !elements.chatMessages) return;
    elements.chatPopup.style.display = 'none';
    elements.chatMessages.innerHTML = '';
    elements.chatPopup.dataset.conversationId = '';
}

function prepareChatUI(title) {
    if (!elements.chatTitle || !elements.chatPopup) return;
    elements.chatTitle.textContent = title;
    elements.chatPopup.style.display = 'block';
    elements.chatMessages.innerHTML = '<div class="text-center mt-5"><span class="spinner-border text-primary"></span></div>';
}

function initializeChatSession(conversationId) {
    if (!elements.chatPopup) return;
    elements.chatPopup.dataset.conversationId = conversationId;
    socket.emit('join_chat', conversationId);
}

async function loadConversationMessages(conversationId) {
    // We get the conversation messages and render them accordingly
    // If the message is ours it has blue background and is positioned at the right
    // If the message is not ours it has white background and is positioned to the left
    try {
        const res = await fetch(`/conversations/${conversationId}/messages`);
        const result = await res.json();
        const messages = result.data;

        if (!elements.chatMessages || !state.user) return;

        if (messages && messages.length > 0) {
            elements.chatMessages.innerHTML = messages.map((msg) => renderMessageHtml(msg, msg.senderId === state.user.id)).join('');
        } else {
            elements.chatMessages.innerHTML = '<div class="text-center text-muted mt-5"><small>No messages yet.</small></div>';
        }
        scrollToBottom();
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Rendering the message
function renderMessageHtml(msg, isMine) {
    const alignment = isMine ? 'text-end' : 'text-start';
    const bubbleStyle = isMine ? 'bg-primary text-white' : 'bg-white text-dark border';
    const senderName = msg.sender?.username || 'Unknown';
    const senderInfo = !isMine ? `<div class="ms-1 text-muted" style="font-size: 0.7rem;">${senderName}</div>` : '';

    return `
        <div class="mb-2 ${alignment}">
            <div class="d-inline-block p-2 rounded shadow-sm ${bubbleStyle}" style="max-width: 80%; word-wrap: break-word;">
                ${msg.content}
            </div>
            ${senderInfo}
        </div>
    `;
}

function scrollToBottom() {
    if (elements.chatMessages) {
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }
}

function toggleChatInput(isEnabled) {
    if (elements.chatInput) elements.chatInput.disabled = !isEnabled;
    if (elements.sendMsgBtn) elements.sendMsgBtn.disabled = !isEnabled;
}

function showChatError(msg) {
    if (!elements.chatMessages) return;
    elements.chatMessages.innerHTML = `<div class="text-danger text-center p-3">${msg}</div>`;
}
