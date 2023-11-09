//modal
document.addEventListener("DOMContentLoaded", function () {
    // Get the button and modal elements
    var btn = document.querySelector("[data-modal-toggle='default-modal']");
    var modal = document.getElementById("default-modal");

    // When the button is clicked, show the modal
    btn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    // Function to close the modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Close the modal when the close button is clicked
    var closeButton = modal.querySelector("[data-modal-hide='default-modal']");
    closeButton.addEventListener("click", closeModal);

    // Close the modal when clicking outside the modal content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});
//modal end
