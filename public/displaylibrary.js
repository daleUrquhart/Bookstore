// libraryloader.js

// Function to fetch and display books
function displayBooks() {
    fetch('http://localhost:8080/booksfetch')
        .then(response => response.json())
        .then(data => {
            //for each book in the res
            updateBookList(data);
        })
        .catch(error => console.error('Error fetching books:', error));
}

function updateBookList(books) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = ''; 
    
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('row'); 
        
        //Handle for differnt author types
        let authorsText = '';
        if (Array.isArray(book.authors)) {
            authorsText = `Authors: ${book.authors.join(', ')}`;
        } else if (typeof book.authors === 'string') {
            authorsText = `Author: ${book.authors}`;
        } else {
            authorsText = 'Authors: Unknown';
        }
        
        //Build
        bookDiv.innerHTML = `
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">${authorsText}</p>
                        <p class="card-text">Genre: ${book.categories}</p>
                        <p class="card-text">Description: ${book.description}</p>
                    </div>
                </div>
            </div>
        `;
        //add book to the list
        bookList.appendChild(bookDiv); 
    });
}


window.addEventListener('load', displayBooks);
