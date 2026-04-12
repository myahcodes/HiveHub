// Modal elements
const backdrop = document.getElementById('modal-backdrop');
const commentModal = document.getElementById('comment-modal');
let currentModal = null;

function hideAllModals() {
    if (currentModal) currentModal.classList.add('hidden');
    if (backdrop) backdrop.classList.add('hidden');
    currentModal = null;
}

function showModal(modal) {
    if (!modal) return;
    if (currentModal) currentModal.classList.add('hidden');
    modal.classList.remove('hidden');
    if (backdrop) backdrop.classList.remove('hidden');
    currentModal = modal;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
}

function populateModalWithPost(postElement) {
    if (!postElement || !commentModal) return false;

    try {
        const header = postElement.querySelector('.buzz-header');
        if (!header) return false;

        // Extract data from the clicked buzz
        const profileImg = header.querySelector('.profile')?.src || 'webapp/assets/img/placeholder/defaultPfpPlcHldr.svg';
        const userInfo = header.querySelector('.user-info');
        const displayName = userInfo?.querySelector('span:first-child')?.innerText || 'Unknown User';
        const rating = userInfo?.querySelector('.rating-score')?.innerText || '0';
        const openTime = userInfo?.querySelector('.user-info-divide')?.innerText || 'Opens 10 AM';
        const distance = userInfo?.querySelector('.distance')?.innerText || '0 mi';
        const postDateText = userInfo?.querySelector('.buzz-date')?.innerText || 'Just now';

        const mediaImg = postElement.querySelector('.buzz-media');
        const mediaSrc = mediaImg ? mediaImg.src : '';

        // Populate modal sections
        const div1 = commentModal.querySelector('.div1');
        if (div1) {
            div1.innerHTML = mediaSrc
                ? `<img src="${mediaSrc}" style="width:100%; height:100%; object-fit:cover;" />`
                : '<div style="display:flex; align-items:center; justify-content:center; height:100%; color:rgba(255,184,77,0.5);">No image</div>';
        }

        const div2 = commentModal.querySelector('.div2');
        if (div2) {
            div2.innerHTML = `
                <div class="buzz-header">
                    <img src="${profileImg}" class="profile" />
                    <div class="user-info">
                        <span>${escapeHtml(displayName)}</span>
                        <span class="rating-score">${escapeHtml(rating)}</span>
                        <span class="user-info-divide">${escapeHtml(openTime)}</span>
                        <span class="distance">${escapeHtml(distance)}</span>
                    </div>
                </div>
            `;
        }

        const div3 = commentModal.querySelector('.div3');
        if (div3) {
            div3.innerHTML = `
                <div class="comments-list" id="modal-comments-list">
                    <div class="comment-item">
                        <img src="webapp/assets/img/placeholder/defaultPfpPlcHldr.svg" class="comment-avatar" />
                        <div class="comment-content">
                            <div class="comment-header">
                                <span class="comment-username">LocalBee</span>
                                <span class="comment-time">1 day ago</span>
                            </div>
                            <p class="comment-text">Great find! 🛍️</p>
                        </div>
                    </div>
                </div>
            `;
        }

        const div4 = commentModal.querySelector('.div4');
        if (div4) {
            div4.innerHTML = `
                <div class="buzz-actions" style="padding-bottom: 0px">
                    <div>
                        <button class="action-bttns" aria-label="addToBuzzboard">
                            <svg class="icon"><use href="webapp/assets/img/activityBar/activitySprites.svg#addtobuzzboardicon"></use></svg>
                        </button>
                        <button class="action-bttns" aria-label="share">
                            <svg class="icon"><use href="webapp/assets/img/activityBar/activitySprites.svg#shareicon"></use></svg>
                        </button>
                    </div>
                </div>
                <div class="post-date" style="padding-bottom: 5px">${escapeHtml(postDateText)}</div>
            `;
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Open modal on comment button click
document.querySelector('.buzz-feed')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.comment-trigger');
    if (!btn) return;
    e.stopPropagation();
    const post = btn.closest('.buzz');
    if (post && populateModalWithPost(post)) showModal(commentModal);
});

// Close modal
backdrop?.addEventListener('click', hideAllModals);
commentModal?.querySelector('.close-modal')?.addEventListener('click', hideAllModals);