console.log("navbar loading")

// Navbar
fetch('/navbar.html')
    .then(response => response.text())
    .then(html => {
        // Insert navbar HTML into navbarContainer div
        document.getElementById('navbarContainer').innerHTML = html;

        // Update active state of navbar links
        const currentPage = window.location.pathname.split('/').pop(); 
        const navbarLinks = document.querySelectorAll('.nav-link'); 

        //update curr page details
        navbarLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref.split('/').pop();
            if (linkPage === currentPage) { 
                link.classList.add('active'); 
                link.setAttribute('aria-current', 'page'); 
            } else {
                link.classList.remove('active'); 
                link.removeAttribute('aria-current');
            }
        });
    })
    .catch(error => console.error('Error fetching navbar:', error));

    console.log("navbar loaded")
    