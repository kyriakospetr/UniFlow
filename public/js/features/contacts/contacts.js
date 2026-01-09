// Buddy search bar
export function renderSearch() {
    const feedArea = document.getElementById('feedArea');
    if (!feedArea) return;
    
    feedArea.innerHTML = `
        <div class="card shadow-sm mb-4 border-0">
            <div class="card-body">
                <h5 class="card-title mb-3">
                    <i class="bi bi-people-fill me-2 text-primary"></i>
                    Find Study Buddies
                </h5>
                <p class="text-muted small mb-3">
                    Add a buddy by username and start studying together.
                </p>
                <div class="input-group">
                    <span class="input-group-text bg-light">
                        <i class="bi bi-person-plus"></i>
                    </span>
                    <input 
                        type="text" 
                        id="buddyUsernameInput" 
                        class="form-control" 
                        placeholder="Username"
                        autocomplete="off"
                    >
                    <button class="btn btn-primary" id="addContactBtn">
                        Add
                    </button>
                </div>
                <div id="searchFeedback" class="mt-3"></div>
            </div>
        </div>

        <div class="card shadow-sm border-0">
            <div class="card-body">
                <h5 class="mb-3">
                    <i class="bi bi-person-lines-fill me-2 text-success"></i>
                    My Buddies
                </h5>
                <ul id="buddiesList" class="list-group list-group-flush">
                    <li class="list-group-item text-muted text-center py-3">
                        <div class="spinner-border spinner-border-sm me-2"></div> Loading buddies...
                    </li>
                </ul>
            </div>
        </div>
    `;

    const addContactBtn = document.getElementById('addContactBtn');
    if (addContactBtn) {
        addContactBtn.addEventListener('click', (e) => handleAddContact(e));
    }

    // We render the list
    renderContacts();
}


export async function handleAddContact(e) {
    if(e) e.preventDefault();
    
    const input = document.getElementById('buddyUsernameInput');
    const feedback = document.getElementById('searchFeedback');
    const btn = document.getElementById('addContactBtn');

    if (!input || !feedback || !btn) return;
    
    const username = input.value.trim();
    if (!username) return;

    // We make the post request to add the contact
    try {
        btn.disabled = true;
        
        const response = await fetch('/contacts/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        const result = await response.json();

        if (response.ok) {
            feedback.className = 'mt-2 small text-success';
            feedback.textContent = 'Buddy added successfully!';
            input.value = '';

            // result data = {id, username}
            if (result.data) {
                appendContactToList(result.data);
            }
            
        } else {
            feedback.className = 'mt-2 small text-danger';
            feedback.textContent = result.message || 'Invalid buddy username.';
        }
    } catch (err) {
        console.error(err);
        feedback.className = 'mt-2 small text-danger';
        feedback.textContent = 'Connection error.';
    } finally {
        btn.disabled = false;
    }
}

//
export async function fetchContacts() {
    try {
        const response = await fetch('/contacts/');
        if (!response.ok) throw new Error('Failed to fetch buddies');

        const result = await response.json();
        // The result data is an array of objects { id, username }
        return result.data || [];
    } catch (err) {
        console.error(err);
        return null; 
    }
}

// We append the buddy to the list without refresh
// There is no need to fetch again the buddies 
// So we append the new buddy at the top of the list
function appendContactToList(targetUser) {
    const list = document.getElementById('buddiesList');
    if (!list) return;

    // We clear the messages under the search bar
    const placeholderMsg = list.querySelector('.list-group-item.text-muted');
    if (placeholderMsg) {
        list.innerHTML = '';
    }

    // Random color for the avatar 
    const initial = targetUser.username.charAt(0).toUpperCase();
    const colors = ['bg-primary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-secondary'];
    const colorIndex = targetUser.username.charCodeAt(0) % colors.length;
    const avatarColor = colors[colorIndex];

    const li = document.createElement('li');
    li.className = "list-group-item d-flex align-items-center justify-content-between py-3 px-3 border-start-0 border-end-0 border-top-0 border-bottom buddy-row";
    
    // We populate the list element
    li.innerHTML = `
        <div class="d-flex align-items-center gap-3">
            <div class="rounded-circle ${avatarColor} text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
                 style="width: 40px; height: 40px; border: 2px solid #fff; flex-shrink: 0;">
                ${initial}
            </div>
            <div class="d-flex flex-column">
                <strong class="text-dark">${targetUser.username}</strong>
                <small class="text-muted" style="font-size: 0.75rem;">@${targetUser.username.toLowerCase()}</small>
            </div>
        </div>
    `;

    // We place it at the top 
    // So the user can see it
    list.prepend(li);
}

// We render all the user Contacts
export async function renderContacts() {
    const list = document.getElementById('buddiesList');
    if (!list) return;

    const contacts = await fetchContacts();

    // Error Handling
    if (contacts === null) {
        list.innerHTML = '<li class="list-group-item text-danger text-center">Error loading buddies.</li>';
        return;
    }

    if (contacts.length > 0) {
        // Render List
        list.innerHTML = contacts
            .map((targetUser) => {
                // For each buddy we create a list element
                const initial = targetUser.username.charAt(0).toUpperCase();
                const colors = ['bg-primary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-secondary'];
                const colorIndex = targetUser.username.charCodeAt(0) % colors.length;
                const avatarColor = colors[colorIndex];

                return `
                    <li class="list-group-item d-flex align-items-center justify-content-between py-3 px-3 border-start-0 border-end-0 border-top-0 border-bottom buddy-row">
                        <div class="d-flex align-items-center gap-3">
                            <div class="rounded-circle ${avatarColor} text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
                                 style="width: 40px; height: 40px; border: 2px solid #fff; flex-shrink: 0;">
                                ${initial}
                            </div>
                            <div class="d-flex flex-column" style="overflow: hidden;">
                                <strong class="text-dark text-truncate">${targetUser.username}</strong>
                                <small class="text-muted text-truncate" style="font-size: 0.75rem;">@${targetUser.username.toLowerCase()}</small>
                            </div>
                        </div>
                    </li>
                `;
            })
            .join('');
    } else {
        // Empty State
        list.innerHTML = '<li class="list-group-item text-muted text-center py-3">No buddies added yet.</li>';
    }
}