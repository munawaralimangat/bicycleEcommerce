
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');

    searchButton.addEventListener('click', function () {
        const searchInput = document.getElementById('searchInput');
        const searchResultsContainer = document.getElementById('searchResults');

        const searchQuery = searchInput.value.trim();

        if (searchQuery !== "") {
            const searchUrl = `/brepublic/search?q=${searchQuery}`;

            fetch(searchUrl, {
                method: 'GET'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(searchResults => {
                console.log(searchResults);
                searchResultsContainer.innerHTML = JSON.stringify(searchResults);
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
        } else {
            searchResultsContainer.innerHTML = '';
        }
    });
});

