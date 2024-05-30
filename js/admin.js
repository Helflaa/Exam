import { fetchPosts, createBtnsContainerElement, checkIfLoggedIn } from './functions.js';

checkIfLoggedIn();

fetchPosts('https://v2.api.noroff.dev/blog/posts/Helene12', (postElement, postId, tagsString) => {
    createBtnsContainerElement(postElement, postId, tagsString);
});

const newPost = document.getElementById('newPost');
newPost.addEventListener('click', () => {
    window.location.href = 'post-new.html';
});

const dropdownBtn = document.getElementById('category');
const dropdownList = document.getElementById('categoryDropdown');
dropdownBtn.addEventListener('click', () => {
    if (dropdownList.style.display === 'grid') {
        dropdownList.style.display = 'none';
    } else {
        dropdownList.style.display = 'grid';
    }
});
document.addEventListener('click', (e) => {
    if (!dropdownBtn.contains(e.target) && !dropdownList.contains(e.target)) {
        dropdownList.style.display = 'none';
    }
});

function setupFilterButtons(dropdownItems, headerElement, fetchPostsCallback) {
    dropdownItems.forEach(button => {
        button.addEventListener('click', () => {
            const tag = button.dataset.tag;
            let url;
            if (tag === "All-posts") {
                url = `https://v2.api.noroff.dev/blog/posts/Helene12`; // URL to fetch all posts
                headerElement.textContent = "All Posts";
            } else {
                url = `https://v2.api.noroff.dev/blog/posts/Helene12?_tag=${tag}`;
                headerElement.textContent = button.textContent; // Update header text
            }
            fetchPostsCallback(url, (postElement, postId, tagsString) => {
                createBtnsContainerElement(postElement, postId, tagsString);
            });
        });
    });
}

const dropdownItems = document.querySelectorAll('.dropdownItem');
const headerElement = document.getElementById('header');
setupFilterButtons(dropdownItems, headerElement, fetchPosts);


//logout

const logoutBtn = document.getElementById('logoutBtn');
const logoutConfirm = document.getElementById('logout-confirm');
const logoutAbort = document.getElementById('logout-abort');
const logoutDialog = document.getElementById('logoutDialog');
const overlay = document.querySelector('.overlay');
logoutBtn.addEventListener('click', () => {
    logoutDialog.style.display = 'flex';
    overlay.style.display = 'flex';
});

logoutConfirm.addEventListener('click', () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    window.location.href = 'login.html';
});

logoutAbort.addEventListener('click', () => {
    logoutDialog.style.display = 'none';
    overlay.style.display = 'none';
});