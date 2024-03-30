console.log("backend loading");

// Function to fetch email by username
function getEmailByUsername(username) {
    return fetch(`http://localhost:8080/email/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data.email;
        });
}

function handleSubmit() {
    // Get form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Fetch email by username
    getEmailByUsername(username)
        .then(email => {
            // Send email for verification
            fetch('http://localhost:8080/verify_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to verify email');
                }
                return response.json();
            })
            .then(data => {
                // Prompt for verification code
                const verificationCode = prompt('Enter verification code sent to your email:');
                if (!verificationCode) return; // If the user cancels, exit

                // Send login credentials and verification code for verification
                fetch('http://localhost:8080/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password, code: data.code, usercode: verificationCode })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to sign in');
                    }
                    return response.json();
                })
                .then(data => {
                    // Check if login was successful
                    if (data.message === 'Signed in successfully') {
                        alert('Login successful!');
                        console.log("sign in success")
                        window.location.href = 'index.html';
                    } else {
                        alert('Invalid email, password, or verification code');
                        console.log("bad credentials")
                    }
                })
                .catch(error => {
                    console.error('Error while signing in:', error);
                    alert('An error occurred while signing in.');
                });
            })
            .catch(error => {
                console.error('Error while verifying email:', error);
                alert('An error occurred while verifying the email.');
            });
        })
        .catch(error => {
            console.error('Error while fetching email by username:', error);
            alert('An error occurred while fetching email by username.');
        });
}

console.log("backend loaded");
