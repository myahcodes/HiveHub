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
            buzz.innerHTML = `
                <div class="buzz-header">
                    <img src="assets/img/icons/defaultPfp.svg" alt="Profile" class="profile" />
                    <div class="user-info">
                        <span>${post.username}</span>
                        <span class="user-info-divide">${new Date(post.createdAt).toLocaleDateString()}</span>
                        ${post.tags ? `<span class="distance">${post.tags}</span>` : ''}
                    </div>
                </div>
                <div class="buzz-content">
                    <h3 style="color:#ffb84d; margin-bottom:8px;">${post.title}</h3>
                    <div style="color:#ffb84d; margin-bottom:8px;">${post.body}</div>
                    ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post Image" class="buzz-media" />` : ''}
                </div>
                <div class="buzz-actions">
                    <div style="display: flex; gap: 15px;">
                        <button class="action-bttns commentFeedIcon"></button>
                        <button class="action-bttns addToBuzzboardIcon"></button>
                    </div>
                    <div>
                        <button class="action-bttns shareIcon"></button>
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

loadPosts().then(() => loadRssFeed());
