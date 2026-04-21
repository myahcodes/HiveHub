function timeAgo(dateStr) {
    const utcStr = dateStr.replace(' ', 'T') + (dateStr.endsWith('Z') ? '' : 'Z');
    const seconds = Math.floor((new Date() - new Date(utcStr)) / 1000);
    if (seconds < 0) return 'Just now';
    if (seconds < 60) return seconds + 's ago';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ago';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'h ago';
    return Math.floor(hours / 24) + 'd ago';
}

async function loadPosts() {
    const feed = document.getElementById('buzz-feed');

    
    
    try {
        const response = await fetch('api/posts');

        if (response.status === 401) {
            window.location.href = 'Login.html';
            return;
        }

        const posts = await response.json();
        feed.innerHTML = '';

        if (posts.length === 0) {
            feed.innerHTML = '<p style="color:#ffb84d; text-align:center;">No posts yet. Be the first to post!</p>';
            return;
        }

        posts.forEach(post => {
            const buzz = document.createElement('div');
            buzz.className = 'buzz';
            buzz.dataset.postId = post.postId;
            buzz.innerHTML = `
                <div class="buzz-header">
                    <img src="assets/img/icons/defaultPfp.svg" alt="Profile" class="profile" />
                    <div class="user-info">
                        <span>${post.username}</span>
                        <span class="rating-score">${post.rating ?? 0}</span>
                        ${post.openTime ? `<span class="user-info-divide">${post.openTime}</span>` : ''}
                        ${post.location ? `<span class="distance">${post.location}</span>` : ''}
                        <span class="buzz-date">${timeAgo(post.createdAt)}</span>
                    </div>
                </div>
                <div class="buzz-content">
                    <h3 style="color:#ffb84d; margin-bottom:8px;">${post.title}</h3>
                    <div class="buzz-text" style="color:#ffb84d; margin-bottom:8px;">${post.body}</div>
                    ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post Image" class="buzz-media" />` : ''}
                </div>
               <div class="buzz-actions">
                <div style="display: flex; gap: 15px;">
                    <button class="action-bttns comment-trigger" aria-label="comment">
                        <svg class="icon" aria-hidden="true">
                            <use href="assets/img/activityBar/activitySprites.svg#commentfeedicon"></use>
                        </svg>
                    </button>
                    <button class="action-bttns" aria-label="addToBuzzboard">
                        <svg class="icon" aria-hidden="true">
                            <use href="assets/img/activityBar/activitySprites.svg#addtobuzzboardicon"></use>
                        </svg>
                    </button>
                </div>
                <div>
                    <button class="action-bttns" aria-label="share">
                        <svg class="icon" aria-hidden="true">
                            <use href="assets/img/activityBar/activitySprites.svg#shareicon"></use>
                        </svg>
                    </button>
                </div>
            </div>
            `;
            feed.appendChild(buzz);
        });

    } catch (err) {
        console.error('Failed to load posts:', err);
        feed.innerHTML = '<p style="color:red; text-align:center;">Failed to load posts.</p>';
    }
}


async function loadRssFeed() {
    try {
        const response = await fetch('api/rss');
        const items = await response.json();
        const feed = document.getElementById('buzz-feed');

        items.forEach(item => {
            const buzz = document.createElement('div');
            buzz.className = 'buzz rss-post';
            buzz.innerHTML = `
                <div class="buzz-header">
                    <img src="assets/img/icons/defaultPfp.svg" alt="We Are Huntsville" class="profile" />
                    <div class="user-info">
                        <span>${item.source}</span>
                        <span class="user-info-divide">${new Date(item.pubDate).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="buzz-content">
                    <h3 style="color:#ffb84d; margin-bottom:8px;">
                        <a href="${item.link}" target="_blank" style="color:#ffb84d;">${item.title}</a>
                    </h3>
                    <div style="color:#ffb84d; margin-bottom:8px;">${item.description}</div>
                </div>
                <div class="buzz-actions">
                    <div style="display:flex; gap:15px;"></div>
                </div>
            `;
            feed.appendChild(buzz);
        });
    } catch (err) {
        console.error('Failed to load RSS feed:', err);
    }
}

async function loadEvents() {
    try {
        const response = await fetch('api/events');
        const items = await response.json();
        const feed = document.getElementById('buzz-feed');

        items.forEach(item => {
            const buzz = document.createElement('div');
            buzz.className = 'buzz event-post';
            buzz.innerHTML = `
                <div class="buzz-header">
                    <img src="assets/img/icons/defaultPfp.svg" alt="Event" class="profile" />
                    <div class="user-info">
                        <span>${item.source}</span>
                        <span class="user-info-divide">${item.date} ${item.time}</span>
                        <span class="distance">${item.location}</span>
                    </div>
                </div>
                <div class="buzz-content">
                    ${item.image ? `<img src="${item.image}" alt="${item.title}" class="buzz-media" style="margin-bottom:8px;" />` : ''}
                    <h3 style="color:#ffb84d; margin-bottom:8px;">
                        <a href="${item.link}" target="_blank" style="color:#ffb84d;">${item.title}</a>
                    </h3>
                </div>
                <div class="buzz-actions">
                    <div style="display:flex; gap:15px;"></div>
                </div>
            `;
            feed.appendChild(buzz);
        });
    } catch (err) {
        console.error('Failed to load events:', err);
    }
}

loadPosts().then(() => loadRssFeed()).then(() => loadEvents());
