export function renderBuddySearch() {
    const feedArea = document.getElementById('feedArea');
    if (!feedArea) return;

    feedArea.innerHTML = `
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Find Study Buddies</h5>
                <div class="input-group mt-3">
                    <input type="text" id="buddyUsernameInput" class="form-control" placeholder="Enter username...">
                    <button class="btn btn-primary" id="addBuddyBtn">Add Buddy</button>
                </div>
                <div id="searchFeedback" class="mt-2 small"></div>
            </div>
        </div>
        <div id="buddiesListContainer">
            <h5 class="mb-3">My Buddies</h5>
            <ul id="buddiesList" class="list-group">
                <li class="list-group-item text-muted">Loading buddies...</li>
            </ul>
        </div>
    `;

    // Σύνδεση του Event Listener για το κουμπί προσθήκης
    document.getElementById('addBuddyBtn').addEventListener('click', handleAddBuddy);
}

export async function handleAddBuddy() {
    const input = document.getElementById('buddyUsernameInput');
    const feedback = document.getElementById('searchFeedback');
    const username = input.value.trim();

    if (!username) return;

    try {
        const response = await fetch('/buddies/add', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        const result = await response.json();

        if (response.ok) {
            feedback.className = "mt-2 small text-success";
            feedback.textContent = "Buddy added successfully!";
            input.value = '';
            fetchMyBuddies(); 
        } else {
            feedback.className = "mt-2 small text-danger";
            feedback.textContent = result.message || "Could not add buddy.";
        }
    } catch (err) {
        feedback.textContent = "Connection error.";
    }
}

export function openChat(username) {
    const popup = document.getElementById('chat-popup');
    const title = document.getElementById('chat-with-user');
    
    title.textContent = `Chat with ${username}`;
    popup.style.display = 'block';

    popup.dataset.recipient = username; 
}

window.openChat = openChat;

window.closeChat = () => {
    document.getElementById('chat-popup').style.display = 'none';
};

export async function fetchMyBuddies() {
    const list = document.getElementById('buddiesList');
    
    try {
        const response = await fetch('/buddies/');
        const result = await response.json();

        if (response.ok && result.data.length > 0) {
            list.innerHTML = result.data.map(contact => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${contact.buddy.username}</strong>
                        <div class="text-muted small">${contact.buddy.email}</div>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="openChat('${contact.buddy.username}')">
                        <i class="bi bi-chat-dots"></i> Message
                    </button>
                </li>
            `).join('');
        } else {
            list.innerHTML = '<li class="list-group-item text-muted">No buddies added yet.</li>';
        }
    } catch (err) {
        list.innerHTML = '<li class="list-group-item text-danger">Error loading buddies.</li>';
    }
}