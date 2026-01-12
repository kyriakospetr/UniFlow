import { elements } from './elements.js';
import {fetchContacts} from '../contacts/contacts.js'
import { openChat } from './chat.popup.js';

export async function openNewChatPopup() {

    // Client side validation
    const { newChatPopup, buddyList, groupNameInput, startNewChatBtn } = elements;
    if (!newChatPopup || !buddyList) return;

    newChatPopup.classList.remove('d-none');
    buddyList.innerHTML = '';
    if (groupNameInput) { groupNameInput.value = ''; groupNameInput.disabled = true; }
    if (startNewChatBtn) { startNewChatBtn.disabled = true; }

    // Fetch all the user's contacts
    try {
        const response = await fetchContacts();
        const list = Array.isArray(response) ? response : (response.data || []);

        list.forEach((user) => { 
            const div = document.createElement('div');
            div.className = 'd-flex align-items-center buddy-chip';
            div.style.cursor = 'pointer';
            div.dataset.id = user.id;
            div.innerHTML = `
                <div class="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2" style="width: 30px; height: 30px;">
                    ${user.username.charAt(0).toUpperCase()}
                </div>
                <span>${user.username}</span>
            `;
            div.addEventListener('click', () => toggleTargetUserSelection(div));
            buddyList.appendChild(div);
        });
    } catch (err) {
        console.error("Error loading contacts", err);
    }
}

// If the user clicks on a buddie, we show it
function toggleTargetUserSelection(element) {
    element.classList.toggle('bg-primary');
    element.classList.toggle('text-white');
    element.classList.toggle('border');
    
    const { newChatPopup, groupNameInput, startNewChatBtn } = elements;
    const selectedCount = newChatPopup.querySelectorAll('.buddy-chip.bg-primary').length;

    if (groupNameInput) groupNameInput.disabled = selectedCount < 2;
    if (startNewChatBtn) startNewChatBtn.disabled = selectedCount === 0;
}

export function closeNewChatPopup() {
    elements.newChatPopup?.classList.add('d-none');
}

// We make the new chat
export async function handleStartNewChat() {
    const popup = elements.newChatPopup;
    const selected = Array.from(popup.querySelectorAll('.buddy-chip.bg-primary'));
    const participantsIds = selected.map(div => div.dataset.id).filter(Boolean);

    if (participantsIds.length === 0) return;
    const groupName = elements.groupNameInput?.value || null;

    try {
        await openChat(participantsIds, groupName);
        closeNewChatPopup();
    } catch (err) {
        console.error(err);
        alert('Failed to start chat');
    }
}