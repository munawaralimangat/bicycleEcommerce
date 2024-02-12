document.addEventListener('DOMContentLoaded',()=>{
    const searcButton1 = document.getElementById('searchButton1');
    const searchInput1 = document.getElementById('searchButton2');
    const searchForm1 = document.getElementById('searchForm1');

    searcButton1.addEventListener('click',async (e)=>{
        await handleSearch(searchInput1,searchForm1)
    })

    const searcButton2 = document.getElementById('searchButton2');
    const searchinput2 = document.getElementById('searchInput2');
    const searchForm2 = document.getElementById('searchForm2');

    searcButton2.addEventListener('click',async (e)=>{
        await handleSearch(searchinput2,searchForm2)
    })

    //additional
})

async function handleSearch(searchInput, searchForm) {

    const searchQuery = searchInput.value.trim();

        const searchUrl = `/brepublic/search?q=${searchQuery}`;

        try {
            const response = await fetch(searchUrl, { method: 'GET' });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

        } catch (error) {
            console.error('Fetch error:', error);
        }

}








// document.addEventListener('DOMContentLoaded', function () {

//     const searchButton = document.getElementById('searchButton');
    

//     searchButton.addEventListener('click', function () {
//         const searchInput = document.getElementById('searchInput');
        

//         const searchQuery = searchInput.value.trim();

//         if (searchQuery !== "") {
//             const searchUrl = `/brepublic/search?q=${searchQuery}`;

//             fetch(searchUrl, {
//                 method: 'GET'
//             })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(searchResults => {
//                 console.log(searchResults);
//                 searchResultsContainer.innerHTML = JSON.stringify(searchResults);
//             })
//             .catch(error => {
//                 console.error('Fetch error:', error);
//             });
//         } else {
//             searchResultsContainer.innerHTML = '';
//         }
//     });
// });

