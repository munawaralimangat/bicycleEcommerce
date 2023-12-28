document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    searchButton.addEventListener("click", function () {
       const searchQuery = searchInput.value.trim();

       if (searchQuery !== "") {
          const searchUrl = `/brepublic/search?q=${searchQuery}`;

          fetch(searchUrl)
             .then(response => {
                if (!response.ok) {
                   throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
             })
             .then(searchResults => {
                console.log(searchResults);
             })
             .catch(error => {
                console.error('Fetch error:', error);
             });
       }
    });
 });