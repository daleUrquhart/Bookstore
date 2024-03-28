console.log("serachbar loading")

// Searchbar
fetch('searchbar.html')
    .then(response => response.text())
    .then(html => {
        // Insert navbar HTML into navbarContainer div
        document.getElementById('searchbarContainer').innerHTML = html;
    })
    .catch(error => console.error('Error fetching searchbar:', error));

    console.log("searchbar loaded")
    