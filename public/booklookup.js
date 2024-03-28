function handleSearch() {
    const searchTerm = document.getElementById('searchData').value;
    fetch('http://localhost:8080/booksfetch')
        .then(response => response.json())
        .then(data => {
            //with the data, do:
            search(data, searchTerm);
        })
        .catch(error => console.error('Error searching library:', error));
}

function search(books, searchTerm) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    books.forEach(book => {
        // Convert all properties to lowercase for case-insensitive comparison
        const title = book.title.toLowerCase();
        const authors = book.authors.toLowerCase();
        const categories = book.categories.toLowerCase();
        const description = book.description.toLowerCase();

        // Check if any property contains the search term
        if (title.includes(searchTerm.toLowerCase()) ||
            authors.includes(searchTerm.toLowerCase()) ||
            categories.includes(searchTerm.toLowerCase()) ||
            description.includes(searchTerm.toLowerCase())) {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('row');
            // Build book card
            bookDiv.innerHTML = `
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-text">Authors: ${book.authors}</p>
                            <p class="card-text">Genre: ${book.categories}</p>
                            <p class="card-text">Description: ${book.description}</p>
                        </div>
                    </div>
                </div>
            `;
            // Add book to the list
            bookList.appendChild(bookDiv);
        }
    });
}

document.getElementById('searchBtn').addEventListener('click', handleSearch);