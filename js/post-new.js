import {checkIfLoggedIn} from "./functions.js";
checkIfLoggedIn()


document.addEventListener('DOMContentLoaded',  () => {
    const form = document.querySelector('form');

    form.addEventListener( 'submit', function (event ){
        event.preventDefault();


        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const tags =document.getElementById('tag').value;
        const accessToken = localStorage.getItem('accessToken');
        console.log(accessToken);

        const payload = {
            title: title,
            body: body,
            media: {
                url: imageUrl
            },
            tags: [tags],
        }
        fetch('https://v2.api.noroff.dev/blog/posts/Helene12', {
            method:'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            },
            body:JSON.stringify(payload)
        })
            .then(response =>{
                if (!response.ok) {
                    throw new Error ('failed to post');
                }
                return response.json();
            })
            .then(data => {
                console.log('Blog is posted!', data);
                alert('Blog is posted successfully');
            })
            .catch(error => {
                console.error('failed to post', error.message);
            })
    })
})


