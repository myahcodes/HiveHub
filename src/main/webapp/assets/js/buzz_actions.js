const backdrop = document.getElementById('modal-backdrop');
const commentModal = document.getElementById('comment-modal');
let currentModal = null;
let currentPostId = null;

function hideAllModals() {
    if (currentModal) currentModal.classList.add('hidden');
    if (backdrop) backdrop.classList.add('hidden');
    currentModal = null;
    currentPostId = null;
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

function timeAgo(dateStr) {
    const utcStr = dateStr.replace(' ', 'T') + (dateStr.endsWith('Z') ? '' : 'Z');
    const seconds = Math.floor((new Date() - new Date(utcStr)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ago';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'h ago';
    return Math.floor(hours / 24) + 'd ago';
}

function populateModalWithPost(postElement) {
    if (!postElement || !commentModal) return false;

    try {
        const header = postElement.querySelector('.buzz-header');
        if (!header) return false;

        const profileImg = header.querySelector('.profile')?.src || 'assets/img/icons/defaultPfp.svg';
        const userInfo = header.querySelector('.user-info');
        const displayName = userInfo?.querySelector('span:first-child')?.innerText || 'Unknown User';
        const rating = userInfo?.querySelector('.rating-score')?.innerText || '0';
        const openTime = userInfo?.querySelector('.user-info-divide')?.innerText || '';
        const distance = userInfo?.querySelector('.distance')?.innerText || '';
        const postDateText = userInfo?.querySelector('.buzz-date')?.innerText || 'Just now';

        const mediaImg = postElement.querySelector('.buzz-media') || postElement.querySelector('.buzz-content img');
        const mediaSrc = mediaImg ? mediaImg.src : '';
        const postTextElement = postElement.querySelector('.buzz-text');
        const postText = postTextElement ? postTextElement.innerText : '';

        const div1 = commentModal.querySelector('.div1');
        if (div1) {
            if (mediaSrc) {
                div1.innerHTML = `<img src="${mediaSrc}" style="width:100%; height:100%; object-fit:cover;" />`;
            } else if (postText.trim()) {
                div1.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; height:100%; padding:16px; color:#ffb84d; font-family:BeePollen,Chewy; overflow:auto;">${escapeHtml(postText)}</div>`;
            } else {
                div1.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; height:100%;">
                    <svg style="width:60px; height:60px; fill:rgba(255,184,77,0.2);" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                </div>`;
            }
        }

        const div2 = commentModal.querySelector('.div2');
        if (div2) {
            let html = `
                <div class="buzz-header">
                    <img src="${profileImg}" class="profile" />
                    <div class="user-info">
                        <span>${escapeHtml(displayName)}</span>
                        <span class="rating-score">${escapeHtml(rating)}</span>
                        ${openTime ? `<span class="user-info-divide">${escapeHtml(openTime)}</span>` : ''}
                        ${distance ? `<span class="distance">${escapeHtml(distance)}</span>` : ''}
                    </div>
                </div>`;
            if (postText.trim()) {
                html += `<div class="modal-post-text" style="padding: 4px 0;">${escapeHtml(postText)}</div>`;
            }
            div2.innerHTML = html;
        }

        const div3 = commentModal.querySelector('.div3');
        if (div3) {
            div3.innerHTML = `<div class="comments-list" id="modal-comments-list">
                <p style="color:#ffb84d; text-align:center; font-size:0.85rem;">Loading comments...</p>
            </div>`;
        }

        const div4 = commentModal.querySelector('.div4');
        if (div4) {
            div4.innerHTML = `
                <div class="buzz-actions" style="padding-bottom: 0px">
                    <div>
                        <button class="action-bttns" aria-label="addToBuzzboard">
                            <svg class="icon"><use href="assets/img/activityBar/activitySprites.svg#addtobuzzboardicon"></use></svg>
                        </button>
                        <button class="action-bttns" aria-label="share">
                            <svg class="icon"><use href="assets/img/activityBar/activitySprites.svg#shareicon"></use></svg>
                        </button>
                    </div>
                </div>
                <div class="post-date" style="padding-bottom: 5px">${escapeHtml(postDateText)}</div>`;
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function loadComments(postId) {
    const list = document.getElementById('modal-comments-list');
    if (!list) return;

    try {
        const res = await fetch(`api/comments?postId=${postId}`);
        if (!res.ok) { list.innerHTML = ''; return; }

        const comments = await res.json();
        if (comments.length === 0) {
            list.innerHTML = '<p style="color:#ffb84d; text-align:center; font-size:0.85rem;">No comments yet.</p>';
            return;
        }

        list.innerHTML = '';
        comments.forEach(c => {
            const item = document.createElement('div');
            item.className = 'comment-item';
            item.innerHTML = `
                <img src="assets/img/icons/defaultPfp.svg" class="comment-avatar" />
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-username">${escapeHtml(c.username)}</span>
                        <span class="comment-time">${timeAgo(c.createdAt)}</span>
                    </div>
                    <p class="comment-text">${escapeHtml(c.text)}</p>
                </div>`;
            list.appendChild(item);
        });
    } catch (err) {
        console.error('Failed to load comments:', err);
        list.innerHTML = '';
    }
}

document.querySelector('.buzz-feed')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.comment-trigger');
    if (!btn) return;
    e.stopPropagation();
    const post = btn.closest('.buzz');
    if (!post) return;
    currentPostId = post.dataset.postId || null;
    if (populateModalWithPost(post)) {
        showModal(commentModal);
        if (currentPostId) loadComments(currentPostId);
    }
});

backdrop?.addEventListener('click', hideAllModals);
commentModal?.querySelector('.close-modal')?.addEventListener('click', hideAllModals);

document.getElementById('comment-modal')?.addEventListener('click', async (e) => {
    if (!e.target.closest('#comment-submit')) return;
    const input = document.getElementById('comment-input');
    const text = input?.value.trim();
    if (!text || !currentPostId) return;

    try {
        const res = await fetch('api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: Number(currentPostId), text })
        });
        const data = await res.json();
        if (!data.ok) return;

        const list = document.getElementById('modal-comments-list');
        const noComments = list?.querySelector('p');
        if (noComments) noComments.remove();

        const item = document.createElement('div');
        item.className = 'comment-item';
        item.innerHTML = `
            <img src="assets/img/icons/defaultPfp.svg" class="comment-avatar" />
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-username">${escapeHtml(data.comment.username)}</span>
                    <span class="comment-time">Just now</span>
                </div>
                <p class="comment-text">${escapeHtml(data.comment.text)}</p>
            </div>`;
        list?.appendChild(item);
        list.scrollTop = list.scrollHeight;
        input.value = '';
    } catch (err) {
        console.error('Failed to post comment:', err);
    }
});
