const title = document.querySelector('#postTitle');
const date = document.querySelector('#postDate');
const image = document.querySelector('#postImage');
const body = document.querySelector('#postBody');
const sideContents = document.getElementById('sideContents');

function getQueryParamValue(parameter) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameter);
}

const postId = getQueryParamValue('id');
const tags = getQueryParamValue('tags');

if (postId) {
    fetch(`https://v2.api.noroff.dev/blog/posts/Helene12/${postId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch posts.');
            }
            return response.json();
        })
        .then(data => {
            const post = data.data;

            if (post) {
                title.textContent = post.title;
                body.textContent = post.body;
                if (post.media && post.media.url) {
                    image.style.backgroundImage = `url(${post.media.url})`;
                    image.style.backgroundRepeat = 'no-repeat';
                    image.style.backgroundSize = 'cover';
                    image.style.backgroundPosition = 'center';
                } else {
                    image.style.backgroundImage = '';
                }
                date.textContent = new Date(post.created).toLocaleDateString();
                fetchRelatedPosts(tags, postId);
            } else {
                console.error('Post not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
            const errorMsg = document.createElement('div');
            errorMsg.textContent = error.message;
            document.body.appendChild(errorMsg);
        });
} else {
    console.error('No post ID found in the URL parameters.');
}

function fetchRelatedPosts(tags, currentPostId) {
    if (tags) {
        fetch(`https://v2.api.noroff.dev/blog/posts/Helene12?_tag=${tags}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch related posts.');
                }
                return response.json();
            })
            .then(data => {
                const relatedPosts = data.data.filter(post => post.id !== currentPostId).slice(0, 4);
                if (relatedPosts.length > 0) {
                    sideContents.innerHTML = ''; // Clear existing contents
                    relatedPosts.forEach(post => {
                        displayRelatedPost(post);
                    });
                } else {
                    console.error('No related posts found.');
                }
            })
            .catch(error => {
                console.error('Error fetching related posts:', error.message);
                const errorMsg = document.createElement('div');
                errorMsg.textContent = error.message;
                sideContents.appendChild(errorMsg);
            });
    } else {
        console.error('No tags found in the URL parameters.');
    }
}

function displayRelatedPost(post) {
    const tagsString = post.tags.join(',');
    const postId = post.id;
    const sidePost = document.createElement('div');
    sidePost.classList.add('sidePost');

    const sideImage = document.createElement('a');
    sideImage.href = `blog-post.html?id=${postId}&tags=${tagsString}`;
    sideImage.classList.add('sideImage');
    if (post.media && post.media.url) {
        sideImage.style.backgroundImage = `url(${post.media.url})`;
        sideImage.style.backgroundRepeat = 'no-repeat';
        sideImage.style.backgroundSize = 'cover';
        sideImage.style.backgroundPosition = 'center';
    }

    const sideTitle = document.createElement('h4');
    sideTitle.classList.add('sideTitle');
    sideTitle.textContent = post.title;

    sidePost.appendChild(sideImage);
    sidePost.appendChild(sideTitle);

    sideContents.appendChild(sidePost);
}