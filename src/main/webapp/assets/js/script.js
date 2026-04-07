async function renderFeed() {
    const feedElement = document.getElementById('feed');

    try {
        /*Request data*/
        const response = await fetch('http://localhost:3000/api/posts');
        const posts = await response.json();

        //Map the data into HTML cards
        feedElement.innerHTML = posts.map(post => `
            <div class="post-card">
                <div class="user-info">
                    <img src="${post.avatar}" class="avatar">
                    <strong>${post.username}</strong>
                </div>
                <img src="${post.image_url}" class="main-img">
                <div class="caption">
                    <p><strong>${post.username}</strong> ${post.caption}</p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Could not load posts:", error);
        feedElement.innerHTML = "<p>Error loading feed.</p>";
    }
}

// Run the function when the page loads
renderFeed();
