
  // Get references to the button, menu, and banner
  const toggleButton = document.querySelector('[data-collapse-toggle="mobile-menu-2"]');
  const mobileMenu = document.getElementById('mobile-menu-2');
  const banner = document.getElementById('banner');

  // Toggle the menu visibility when the button is clicked
  toggleButton.addEventListener('click', function () {
      const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
      toggleButton.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
      banner.classList.toggle('hidden');
  });


  // Example: Call toggleBannerVisibility() to hide/show the banner based on some condition
  // toggleBannerVisibility();
