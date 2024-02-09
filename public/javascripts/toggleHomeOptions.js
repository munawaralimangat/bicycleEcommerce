
  // // Get references to the button, menu, and banner
  // const toggleButton = document.querySelector('[data-collapse-toggle="mobile-menu-2"]');
  // const mobileMenu = document.getElementById('mobile-menu-2');
  // const banner = document.getElementById('banner');

  // // Toggle the menu visibility when the button is clicked
  // toggleButton.addEventListener('click', function () {
  //     const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
  //     toggleButton.setAttribute('aria-expanded', !isExpanded);
  //     mobileMenu.classList.toggle('hidden');
  //     banner.classList.toggle('hidden');
  //     console.log("kk")
  // });


  // // Example: Call toggleBannerVisibility() to hide/show the banner based on some condition
  // // toggleBannerVisibility();

    // Get references to the open and close buttons
    const openButton = document.getElementById('openButton');
    const closeButton = document.getElementById('closeButton');
    console.log(openButton)
    console.log(closeButton)
  
    // Get reference to the off-canvas menu
    const offCanvasMenu = document.querySelector('.relative.z-40.hidden');
  
    // Toggle the menu visibility when the buttons are clicked
    openButton.addEventListener('click', function () {
      offCanvasMenu.style.display = 'block'; // You might want to use a class for this instead of directly setting the style
    });
  
    closeButton.addEventListener('click', function () {
      offCanvasMenu.style.display = 'none'; // You might want to use a class for this instead of directly setting the style
    });
