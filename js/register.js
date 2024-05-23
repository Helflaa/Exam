document.addEventListener('DOMContentLoaded', function (){
    const form = document.getElementById('form');
    const messageDiv = document.querySelector('.errorMsg');
    const overlay = document.querySelector('.overlay');
    const successMsg = document. querySelector('.successful');
    const goToLogin = document.getElementById('goToLogin');

    form.addEventListener('submit', function (event){
        event.preventDefault();

        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const repeatPassword = document.getElementById('repeatPassword').value;

    //     check if passwords match
        if (password !== repeatPassword) {
            messageDiv.textContent = 'Password do not match';

        }

        const  payload = {
            name: username,
            email: email,
            password: password,
        }
        fetch('https://v2.api.noroff.dev/auth/register', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(response =>{
                if (!response.ok){
                    throw new Error('failed to register');
                }
                return response.json();
    })
            .then(data => {
                console.log('register Successful!', data);

                overlay.style.display = 'block';
                successMsg.style.display = 'flex';
            })
            .catch(error =>{
                console.error('registration error', error.message);
                messageDiv.textContent = 'Registration failed';
            })

});
    goToLogin.addEventListener('click', function (){
        window.location.href = 'login.html'
    })

})


