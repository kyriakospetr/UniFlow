// chatManager.js
import {elements} from './elements.js'
import { socket } from '../../core/socket.js';
import { state } from '../../core/state.js';
import { appendMessageToUI, closeChatPopup, sendMessage } from './chat.popup.js';
import { createInboxElement, formatConversationTime, incrementUnread, clearUnread } from './inbox.js';
import { showMessageNotification } from '../../utils/notifications.js';
import { closeNewChatPopup, handleStartNewChat } from './new.chat.popup.js';

export function initChatSystem() {
    // Socket Global Listener
    socket.on('new_message', ({ conversation, message }) => {
        if (!elements.chatPopup || !state.user) return;

        const currentConvoId = elements.chatPopup.dataset.conversationId;
        const isChatOpen = elements.chatPopup.style.display === 'block';
        const isLookingAtThisChat = isChatOpen && message.conversationId === currentConvoId;
        if (!conversation?.id) return;

        // Append if chat is open
        if (isLookingAtThisChat && message.senderId !== state.user.id) {
            appendMessageToUI(message, false);
        }

        // Update Inbox
        // There is no need to fetch all the conversations
        if (elements.inboxList) {
            // We check if the conversation already exists on user's inbox
            const existingItem = elements.inboxList.querySelector(`[data-id="${conversation.id}"]`);
            if (existingItem) {
                // We move the conversation at the top
                elements.inboxList.prepend(existingItem);

                // We update the last message
                const preview = existingItem.querySelector('.last-message-preview');
                const timeElem = existingItem.querySelector('.last-message-time');
                if (preview) preview.textContent = conversation.lastMessageContent;
                if (timeElem) timeElem.textContent = formatConversationTime(conversation.lastMessageAt);
            } else {
                // If its a new conversation we create the inbox element
                if (elements.inboxList.querySelector('#goFindBuddies')) {
                    elements.inboxList.innerHTML = ''; 
                }
                const newConversation = createInboxElement(conversation);
                elements.inboxList.prepend(newConversation);
            }
        }

        const shouldIncrement = message.senderId !== state.user.id && !isLookingAtThisChat;
        if (shouldIncrement) {
            incrementUnread(conversation.id);
        }

        // Notification
        if (message.senderId !== state.user.id && !isLookingAtThisChat) {
            showMessageNotification(message);
        }
    });

    window.addEventListener('conversation:open', (event) => {
        const conversationId = event.detail?.conversationId;
        if (conversationId) {
            clearUnread(conversationId);
        }
    });

    // Event Listeners
    elements.closeChatBtn?.addEventListener('click', closeChatPopup);
    elements.closeNewChatBtn?.addEventListener('click', closeNewChatPopup);
    elements.cancelNewChatBtn?.addEventListener('click', closeNewChatPopup);
    elements.startNewChatBtn?.addEventListener('click', handleStartNewChat);

    elements.sendMsgBtn?.addEventListener('click', (e) => {
        sendMessage(e);
    });

    elements.chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(e);
        }
    });
}
