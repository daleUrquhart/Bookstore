console.log('loading mailman')
function handleSubmit() {
    console.log("handling mail submit...")
    const message = document.getElementById('message').value;
    const first = document.getElementById('first').value;
    const last = document.getElementById('last').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    fetch('http://localhost:8080/mailman', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchTerm: searchTerm, phone: phone, email: email, first: first, last: last })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        console.log('Message sent successfully');
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);
});

console.log('loaded mailman')
