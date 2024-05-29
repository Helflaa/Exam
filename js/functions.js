// Fetch the posts from the API
export function fetchPosts(url, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch posts.');
            }
            return response.json();
        })
        .then(data => {
            const posts = data.data;
            const postsContainer = document.getElementById('postsContainer');

            // Clear the posts container
            postsContainer.innerHTML = '';

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

                // Append the post element to the posts container
                postsContainer.appendChild(postElement);

                // Call the callback function if provided
                if (callback) {
                    callback(postElement, postId, tagsString);
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export function createBtnsContainerElement(postElement, postId, tagsString) {
    const btnsContainerElement = document.createElement('div');
    btnsContainerElement.classList.add('btnsContainerElement');
    btnsContainerElement.innerHTML = `
        <button class="button editBtn">
            Edit
        </button>
        <button class="button deleteBtn">
            Delete
        </button>`;

    const editPost = btnsContainerElement.querySelector('.editBtn');
    editPost.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `post-edit.html?id=${postId}&tags=${tagsString}`;
    });

    const deletePost = btnsContainerElement.querySelector('.deleteBtn');
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
            console.log('Deleting post with ID:', postId); // Log the post ID here
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

    postElement.appendChild(btnsContainerElement);
}

export function deletePostById(postId) {
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

// Fetch the latest posts and update the carousel
export function updateCarouselWithLatestPosts(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch posts.');
            }
            return response.json();
        })
        .then(data => {
            const posts = data.data.slice(0, 3); // Get the latest 3 posts
            const carouselSlides = document.querySelectorAll('[data-slides] .slide');

            posts.forEach((post, index) => {
                if (carouselSlides[index]) {
                    const slide = carouselSlides[index];
                    const tagsString = post.tags.join(',');
                    const thumbnail = document.querySelector('.slide');
                    thumbnail.href = `blog-post.html?id=${post.id}&tags=${tagsString}`;
                    slide.querySelector('div').style.backgroundImage = `url(${post.media.url})`;
                    const slideOverlay = slide.querySelector('.slideOverlay');
                    const slideTitle = slideOverlay.querySelector('.slideTitle');
                    slideTitle.textContent = post.title;
                }
            });

            // Reinitialize the carousel setup
            setupCarousel();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export function setupCarousel() {
    const buttons = document.querySelectorAll("[data-carousel-button]");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const offset = button.dataset.carouselButton === "next" ? 1 : -1;
            const carousel = button.closest("[data-carousel]");
            const slides = carousel.querySelector("[data-slides]");

            if (!slides) {
                console.error("No slides found within the carousel.");
                return;
            }

            const activeSlide = slides.querySelector("[data-active]");
            const slidesArray = [...slides.children];
            let newIndex = slidesArray.indexOf(activeSlide) + offset;

            if (newIndex < 0) newIndex = slidesArray.length - 1;
            if (newIndex >= slidesArray.length) newIndex = 0;

            slidesArray[newIndex].dataset.active = 'true';
            delete activeSlide.dataset.active;
        });
    });
}

export function getQueryParamValue(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}