import { showPostNotification } from '../../utils/notifications.js';
import { state } from '../../core/state.js';
import { socket } from '../../core/socket.js';


// We render the portal feed page
export async function renderPostsView() {
    const feedArea = document.getElementById('feedArea');

    feedArea.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4>Portal Feed</h4>
                <p class="text-muted small">Connect with students and form project teams.</p>
            </div>
            <button class="btn btn-primary px-4 shadow-sm" id="btn-create-post">
                <i class="bi bi-plus-lg me-2"></i>New Post
            </button>
        </div>
        
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body d-flex align-items-center justify-content-between py-2">
                <span class="text-muted small fw-bold text-uppercase">Filter By:</span>
                <div class="btn-group" role="group">
                    <input type="radio" class="btn-check" name="categoryFilter" id="all" checked>
                    <label class="btn btn-outline-primary btn-sm px-3" for="all">All</label>

                    <input type="radio" class="btn-check" name="categoryFilter" id="STUDY">
                    <label class="btn btn-outline-primary btn-sm px-3" for="STUDY">Study</label>

                    <input type="radio" class="btn-check" name="categoryFilter" id="HOBBY">
                    <label class="btn btn-outline-primary btn-sm px-3" for="HOBBY">Hobby</label>

                    <input type="radio" class="btn-check" name="categoryFilter" id="TEAM">
                    <label class="btn btn-outline-primary btn-sm px-3" for="TEAM">Team</label>
                </div>
            </div>
        </div>
        
        <div id="postsList" class="row g-4"></div>
    `;

    // Create post popup
    const createPostBtn = document.getElementById('btn-create-post');
    if (createPostBtn) {
        createPostBtn.addEventListener('click', () => {
            const modalEl = document.getElementById('postModal');
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        });
    }

    // Event Listeners for filters
    document.querySelectorAll('input[name="categoryFilter"]').forEach((radio) => {
        radio.addEventListener('change', (e) => {
            const category = e.target.id === 'all' ? null : e.target.id;
            fetchPosts(category);
        });
    });
    
    //We get all the posts
    await fetchPosts();
}

// Fetch all the posts
async function fetchPosts(category = null) {
    const postsList = document.getElementById('postsList');
    if (!postsList) return;

    postsList.innerHTML = `
        <div class="col-12 text-center mt-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
    `;

    try {
        let url = '/posts';
        if (category) url += `?category=${category}`;

        const response = await fetch(url);
        const result = await response.json();

        postsList.innerHTML = '';

        if (result.data.length === 0) {
            postsList.innerHTML = '<div class="col-12 text-center mt-5"><h5>No posts yet.</h5></div>';
            return;
        }

        // For each post we create a post card
        result.data.forEach((post) => {
            postsList.appendChild(createPostCard(post));
        });
    } catch (error) {
        postsList.innerHTML = '<div class="alert alert-danger">Error loading posts.</div>';
    }
}

function createPostCard(post) {
    const isMyPost = post.authorId === state.user.id;
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4'; 

    // Styles if the user is the author of the post
    const cardBackground = isMyPost ? 'bg-primary-subtle bg-opacity-10' : 'bg-white';
    const borderClass = isMyPost ? 'border-start border-primary border-4' : '';

    // Colors based on category
    const categoryColors = {
        HOBBY: 'bg-danger-subtle text-danger',
        STUDY: 'bg-warning-subtle text-warning-emphasis',
        TEAM: 'bg-success-subtle text-success',
    };

    // Fallback if category is unknown
    const badgeClass = categoryColors[post.category] || 'bg-secondary-subtle text-secondary';
    
    // Avatar
    const initial = post.author.username.charAt(0).toUpperCase();
    const colors = ['bg-primary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-secondary'];
    const colorIndex = post.author.username.charCodeAt(0) % colors.length;
    const avatarColor = colors[colorIndex];

    // Date-Time
    const dateOptions = { month: 'short', day: 'numeric' };
    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', dateOptions);

    // Post card 
    col.innerHTML = `
        <div class="card h-100 shadow-sm rounded-4 post-card ${cardBackground} ${borderClass}">
            <div class="card-body p-4 d-flex flex-column">
                
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar-circle rounded-circle ${avatarColor} text-white fw-bold shadow-sm border border-2 border-white">
                            ${initial}
                        </div>
                        <div class="lh-1">
                            <h6 class="mb-0 fw-bold text-dark">@${post.author.username}</h6>
                            <small class="text-muted" style="font-size: 0.75rem;">
                                ${formattedDate}
                            </small>
                        </div>
                    </div>
                    
                    ${isMyPost 
                        ? `<span class="badge bg-primary rounded-pill px-2 py-1" style="font-size: 0.65rem;">YOU</span>` 
                        : ''
                    }
                </div>

                <h5 class="card-title fw-bold text-dark mb-2">${post.title}</h5>
                <p class="card-text text-muted flex-grow-1" style="font-size: 0.95rem; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                    ${post.content}
                </p>

                <div class="mt-3 pt-3 border-top border-light d-flex align-items-center justify-content-between">
                    <span class="badge ${badgeClass} border border-opacity-10 rounded-pill px-3 py-2 fw-semibold">
                        <i class="bi bi-tag-fill me-1 opacity-50"></i>${post.category}
                    </span>

                    ${isMyPost ? `
                        <button class="btn btn-sm btn-light text-primary rounded-circle shadow-sm" title="Edit Post">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    return col;
}

export async function handleCreatePost(e) {
    if (e) e.preventDefault();

    const form = e.target;

    // Post Details
    const postData = {
        title: form.title.value.trim(),
        content: form.content.value.trim(),
        category: form.category.value, // HOBBY, STUDY, TEAM
    };

    const btn = form.querySelector('button[type="submit"]');
    const feedback = document.getElementById('postFormFeedback');

    try {
        btn.disabled = true;

        // Make the post request
        const response = await fetch('/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData), 
        });

        const result = await response.json();
        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('postModal')).hide();
            form.reset();
            fetchPosts();
        } else {
            feedback.className = 'text-danger small mt-2';
            feedback.textContent = result.details ? result.details[0].message : result.error;
        }
    } catch (err) {
        console.error(err);
    } finally {
        btn.disabled = false;
    }
}

// Event listener 
export function initPostsEvents() {
    socket.on('new_post_notification', (data) => {
        showPostNotification(data);
    });
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
    }
}
