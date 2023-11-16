// Get the modal and button
const defaultModalc = document.getElementById('default-modalc');
const openModalBtnElements = document.getElementsByClassName('openModalBtn');
const closeBtn = document.getElementById('closeBtn');
const modalCategoryName = document.getElementById('editCategoryName')
const modalCategoryId = document.getElementById('editCategoryId')

// Assuming there's only one element with the class 'openModalBtn'
const openModalBtnc = openModalBtnElements[0];

// Add event listener to each element with the class 'openModalBtn'
for (const openModalBtn of openModalBtnElements) {
openModalBtn.addEventListener('click', (event) => {
    // event.preventDefault()
    const categoryId = event.target.closest('tr').dataset.categoryId;
    console.log(categoryId)

    fetch(`/admin/category/${categoryId}`)
    .then((response)=>response.json())
    .then((categoryDetails)=>{
        console.log(categoryDetails);
        modalCategoryName.value = categoryDetails.category_name;
        modalCategoryId.value = categoryDetails._id;
        defaultModalc.style.display = 'block';
    })
    .catch((error)=>{
        console.log(error)
    })   
});
}
// Close modal when the "Close" button is clicked
closeBtn.addEventListener('click', () => {
defaultModalc.style.display = 'none';
});

// Close modal if clicked outside the content
window.addEventListener('click', (event) => {
if (event.target === defaultModalc) {
    defaultModalc.style.display = 'none';
}
});