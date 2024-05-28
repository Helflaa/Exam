// Fetch the posts from the API
fetch('https://v2.api.noroff.dev/blog/posts/Helene12')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch posts.');
        }
        return response.json();
    })
    .then(data => {
        const posts = data.data;
        const postsContainer = document.getElementById('postsContainer');

        // Iterate over each post and create the HTML structure
        posts.forEach(post => {
            const tagsString = post.tags.join(',');
            const postId = post.id;
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.dataset.id = postId; // Add data-id attribute for later reference

            const titleElement = document.createElement('div');
            titleElement.classList.add('title');
            titleElement.innerHTML = post.title;
            postElement.appendChild(titleElement);

            const dateAndTimeElement = document.createElement('div');
            dateAndTimeElement.classList.add('dateAndTime');
            dateAndTimeElement.innerHTML = new Date(post.created).toLocaleString();
            postElement.appendChild(dateAndTimeElement);

            const bodyElement = document.createElement('div');
            bodyElement.classList.add('body');
            const words = post.body.split(' ');
            const truncatedText = words.slice(0, 20).join(' ');
            bodyElement.innerHTML = truncatedText + '...<br><br>';
            postElement.appendChild(bodyElement);

            const postImageElement = document.createElement('a');
            postImageElement.href = `blog-post.html?id=${postId}&tags=${tagsString}`;
            postImageElement.target = '_blank';

            postImageElement.classList.add('postImage');
            postImageElement.style.backgroundImage = `url(${post.media.url})`;
            postImageElement.style.backgroundRepeat = 'no-repeat';
            postImageElement.style.backgroundSize = 'cover';
            postImageElement.style.backgroundPosition = 'center';
            postElement.appendChild(postImageElement);

            const btnsContainerElement = document.createElement('div');
            btnsContainerElement.classList.add('btnsContainer');
            btnsContainerElement.innerHTML = `
            <button class="button editBtn">
                Edit
            </button>
            <button class="button deleteBtn">
                Delete
            </button>`;
            postElement.appendChild(btnsContainerElement);

            // Append the post element to the posts container
            postsContainer.appendChild(postElement);

            const editPost = postElement.querySelector('.editBtn');
            editPost.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `edit-post.html?id=${postId}&tags=${tagsString}`;
            });

            const deletePost = postElement.querySelector('.deleteBtn');
            deletePost.addEventListener('click', (e) => {
                e.preventDefault();
                // Show delete dialog and overlay
                const deleteDialog = document.querySelector('.deleteDialog');
                const overlay = document.querySelector('.overlay');
                deleteDialog.style.display = 'flex';
                overlay.style.display = 'flex';

                // Handle delete confirmation
                const deleteConfirm = document.querySelector('.deleteConfirm');
                const deleteAbort = document.querySelector('.deleteAbort');

                const confirmHandler = () => {
                    deletePostById(postId);
                    deleteConfirm.removeEventListener('click', confirmHandler);
                    deleteAbort.removeEventListener('click', abortHandler);
                };

                const abortHandler = () => {
                    deleteDialog.style.display = 'none';
                    overlay.style.display = 'none';
                    deleteConfirm.removeEventListener('click', confirmHandler);
                    deleteAbort.removeEventListener('click', abortHandler);
                };

                deleteConfirm.addEventListener('click', confirmHandler);
                deleteAbort.addEventListener('click', abortHandler);
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

function deletePostById(postId) {
    const accessToken = localStorage.getItem('accessToken');

    fetch(`https://v2.api.noroff.dev/blog/posts/Helene12/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete post.');
            }
            // Remove the post element from the DOM
            const postElement = document.querySelector(`.post[data-id="${postId}"]`);
            if (postElement) {
                postElement.remove();
            }
            // Hide delete dialog and overlay
            const deleteDialog = document.querySelector('.deleteDialog');
            const overlay = document.querySelector('.overlay');
            deleteDialog.style.display = 'none';
            overlay.style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}