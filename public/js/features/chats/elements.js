// All elements
export const elements = {
    chatPopup: document.getElementById('chat-popup'),
    chatTitle: document.getElementById('chat-with-user'),
    chatMessages: document.getElementById('chat-messages'),
    chatInput: document.getElementById('chat-input'),
    sendMsgBtn: document.getElementById('sendMsgBtn'),
    closeChatBtn: document.getElementById('closeChatBtn'),
    feedArea: document.getElementById('feedArea'),
    
    // Dynamic getter
    get inboxList() {
        return document.getElementById('inboxList');
    },

    newChatPopup: document.getElementById('newChatPopup'),
    buddyList: document.getElementById('buddyList'),
    groupNameInput: document.getElementById('groupNameInput'),
    startNewChatBtn: document.getElementById('startNewChatBtn'),
    closeNewChatBtn: document.getElementById('closeNewChatBtn'),
    cancelNewChatBtn: document.getElementById('cancelNewChatBtn'),
    navBuddies: document.getElementById('nav-buddies'),
};