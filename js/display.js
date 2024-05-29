import { fetchPosts, setupCarousel, updateCarouselWithLatestPosts } from './functions.js';

// Initial fetch to display all posts
fetchPosts('https://v2.api.noroff.dev/blog/posts/Helene12');

// Update the carousel with the latest posts
updateCarouselWithLatestPosts('https://v2.api.noroff.dev/blog/posts/Helene12');

// Setup carousel functionality
setupCarousel();

const filterButtons = document.querySelectorAll('.filterBtn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tag = button.dataset.tag;
        const url = `https://v2.api.noroff.dev/blog/posts/Helene12?_tag=${tag}`;

        console.log(`Fetching posts with tag: ${tag}`); // For debugging

        // Clear the posts container and fetch filtered posts
        fetchPosts(url);
    });
});