async function loadProfile() {
    try {
        const response = await fetch('api/profile');

        if (response.status === 401) {
            window.location.href = 'Login.html';
            return;
        }

        const data = await response.json();

        document.getElementById('profile-name').textContent = data.firstName + ' ' + data.lastName;
        document.getElementById('profile-username').textContent = '@' + data.username;
        document.getElementById('profile-email').textContent = data.email;

        const container = document.getElementById('user-posts');
        container.innerHTML = '';

        if (data.posts.length === 0) {
            container.innerHTML = '<p style="color:#ffb84d; text-align:center;">No posts yet.</p>';
            return;
        }

        data.posts.forEach(post => {
            const buzz = document.createElement('div');
            buzz.className = 'buzz';
            buzz.innerHTML = `
                <div class="buzz-header">
                    <img src="assets/img/icons/defaultPfp.svg" alt="Profile" class="profile" />
                    <div class="user-info">
                        <span>@${data.username}</span>
                        <span class="user-info-divide">${new Date(post.createdAt).toLocaleDateString()}</span>
                        ${post.tags ? `<span class="distance">${post.tags}</span>` : ''}
                    </div>
                </div>
                <div class="buzz-content">
                    <h3 style="color:#ffb84d; margin-bottom:8px;">${post.title}</h3>
                    <div style="color:#ffb84d;">${post.body}</div>
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
            container.appendChild(buzz);
        });

    } catch (err) {
        console.error('Failed to load profile:', err);
    }
}

loadProfile();
