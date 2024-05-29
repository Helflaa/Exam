import { fetchPosts, createBtnsContainerElement, getQueryParamValue } from './functions.js';

fetchPosts('https://v2.api.noroff.dev/blog/posts/Helene12', (postElement, postId, tagsString) => {
    createBtnsContainerElement(postElement, postId, tagsString);
});

const newPost = document.getElementById('newPost');
newPost.addEventListener('click', () =>{
    newPost.window.location.href = 'post-new.html';
})

