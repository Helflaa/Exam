document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    const form = document.getElementById('form');
    const messageDiv = document.querySelector('.errorMsg');
    const overlay = document.querySelector('.overlay');
    const successfulMessage = document.querySelector('.successful');
    const goToLoginButton = document.getElementById('goToLogin');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission
        console.log('Form submit event triggered');

        // Retrieve form data
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const repeatPassword = document.getElementById('repeatPassword').value;

        // Check if passwords match
        if (password !== repeatPassword) {
            messageDiv.textContent = 'Passwords do not match';
            console.log('Passwords do not match');
            return;
        }

        // Check if email is in the correct format
        const emailPattern = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
        if (!emailPattern.test(email)) {
            messageDiv.textContent = 'Email must be @stud.noroff.no';
            console.log('Email format is incorrect');
            return;
        }

        // Construct JSON payload
        const payload = {
            name: username,
            email: email,
            password: password,
        };

        fetch('https://v2.api.noroff.dev/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json().then(data => {
                if (!response.ok) {
                    // Log the response status and error message
                    console.error('Failed to register:', response.status, data);

                    // Extract and display the error message
                    const errorMessage = data.errors && data.errors.length > 0
                        ? data.errors[0].message
                        : 'Failed to register';
                    messageDiv.textContent = errorMessage; // Update the messageDiv with the error message

                    throw new Error(errorMessage);
                }
                return data;
            }))
            .then(data => {
                // Handle successful registration
                overlay.style.display = 'block';
                successfulMessage.style.display = 'flex';
            })
            .catch(error => {
                // Handle any errors that weren't caught by the fetch chain
                messageDiv.textContent = error.message;
            });

        // Handle click on "Go to Login" button
        goToLoginButton.addEventListener('click', function () {
            window.location.href = 'login.html';
        });
    });
});
