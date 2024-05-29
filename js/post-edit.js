import { getQueryParamValue } from "./functions.js";

const postId = getQueryParamValue('id');
const blog = "https://v2.api.noroff.dev/blog/posts/Helene12/";

if (postId) {
    fetch(`${blog}${postId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const selectedPost = data.data;
            console.log('Fetched post:', selectedPost);

            if (selectedPost) {
                const titleInput = document.getElementById('title');
                const bodyInput = document.getElementById('body');
                const tagsInput = document.getElementById('tag');
                const imageInput = document.getElementById('imageUrl');

                titleInput.value = selectedPost.title;
                bodyInput.value = selectedPost.body;
                tagsInput.value = selectedPost.tags.join(', ');
                imageInput.value = selectedPost.media.url;
            } else {
                console.error('No post data found');
            }
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error.message);
            const errorElement = document.createElement('div');
            errorElement.classList.add('error');
            errorElement.textContent = `Error: ${error.message}`;
            document.body.appendChild(errorElement);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const tag = document.getElementById('tag').value.split(',').map(t => t.trim());
        const accessToken = localStorage.getItem('accessToken');

        const payload = {
            title: title,
            body: body,
            media: {
                url: imageUrl
            },
            tags: tag,
        };

        const method = 'PUT';
        const url = `${blog}${postId}`;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update post.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Blog is updated!', data);
                alert('Blog is updated successfully!');
            })
            .catch(error => {
                console.error('Failed to update post', error.message);
            });
    });
});