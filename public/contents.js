console.log("contents loading")

// Searchbar
fetch('contents.html')
    .then(response => response.text())
    .then(html => {
        // Insert contents HTML into contentsContainer div
        document.getElementById('contentsContainer').innerHTML = html;
    })
    .catch(error => console.error('Error fetching contents:', error));

    console.log("contents loaded")
    