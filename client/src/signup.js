console.log("setup loading")
function handleSubmit() {
    // Get form data
    const formData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        password_confirm: document.getElementById('password_confirm').value,
        balance: document.getElementById('balance').value
    };

    // Send ver code
    fetch('http://localhost:8080/verify_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: formData.email
        })
    })
    .then(response => response.json())
    .then(data => {
        // If email is verified successfully, prompt for verification code
        const usercode = prompt('Enter verification code sent to your email:');
        if (!usercode) return; // If the user cancels, exit
        console.log("Adding account")

        // Add account if verification code is correct
        fetch('http://localhost:8080/addaccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                username: formData.username || formData.email, // Use email as default username
                password: formData.password,
                balance: formData.balance,
                code: data.code, // Use verification code from previous response
                usercode: usercode // Pass user-entered verification code
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Added account")
            alert(data.message); // Show success or error message
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the account.');
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while verifying the email.');
    });
}

console.log("setup loaded")
