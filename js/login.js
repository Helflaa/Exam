document.addEventListener('DOMContentLoaded', function (){
    const form = document.getElementById('form');
    const messageDiv = document.querySelector('.errorMsg');
    const overlay = document.querySelector('.overlay');
    const successMsg = document. querySelector('.successful');

    form.addEventListener('submit', (e)=>{
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('https://v2.api.noroff.dev/auth/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body:JSON.stringify({email,password})
        })

            .then(response =>{
                if (!response.ok) {
                    messageDiv.textContent = 'Login, failed. Please check your credential'
                }
                return response.json();
            })
            .then(data => {
            console.log(data);

            localStorage.setItem('userData', JSON.stringify(data));
            localStorage.setItem('accessToken', data.data.accessToken);

            window.location.href = 'admin.html';
        })
            .catch(error => {
                console.error('error:', error.message);
                messageDiv.textContent = 'Login failed.';
            })
    })

})
