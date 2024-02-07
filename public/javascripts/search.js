
    $(document).ready(function () {
        $('#searchButton').on('click', function () {
            const searchQuery = $('#searchInput').val().trim();

            if (searchQuery !== "") {
                const searchUrl = `/brepublic/search?q=${searchQuery}`;

                $.ajax({
                    url: searchUrl,
                    method: 'GET',
                    success: function (searchResults) {
                        console.log(searchResults);
                        
                    },
                    error: function (error) {
                        console.error('AJAX error:', error);
                    }
                });
            }else{
               $('#searchResults').empty();
            }
        });
    });
