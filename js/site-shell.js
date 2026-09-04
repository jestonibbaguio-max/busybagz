(() => {
  const headerMarkup = `
    <nav class="navbar" id="navbar">
      <a href="/index.html" class="nav-logo" aria-label="BusyBagz home">
        <img src="https://res.cloudinary.com/sjnrfmjm/image/upload/v1788502910/busyBagz.png" alt="BusyBagz logo" class="brand-logo-image">
      </a>
      <form class="site-search" id="site-search" role="search">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"/>
        </svg>
        <input id="search-input" type="search" placeholder="Search stores" aria-label="Search stores">
        <div class="search-results" id="search-results" role="listbox" aria-label="Search results"></div>
      </form>
      <a href="#" class="nav-cart" id="nav-cart" aria-label="Shopping bag">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974A1.125 1.125 0 0 1 19.606 8.507Z"/>
        </svg>
        <span class="cart-count">0</span>
      </a>
    </nav>`;

  const footerMarkup = `
    <footer class="footer" id="site-footer">
      <div class="footer-bottom">
        <p>&copy; 2026 BusyBagz. All rights reserved.</p>
        <div class="footer-legal">
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/terms.html">Terms and Conditions</a>
        </div>
        <a class="footer-logo" href="/index.html" aria-label="BusyBagz home">
          <img src="https://res.cloudinary.com/sjnrfmjm/image/upload/v1788502910/busyBagz.png" alt="BusyBagz logo">
        </a>
      </div>
    </footer>`;

  const existingHeader = document.querySelector('.navbar, .topbar');
  if (existingHeader) {
    existingHeader.outerHTML = headerMarkup;
  } else {
    document.body.insertAdjacentHTML('afterbegin', headerMarkup);
  }

  const existingFooter = document.querySelector('.footer');
  if (existingFooter) {
    existingFooter.outerHTML = footerMarkup;
  } else {
    document.body.insertAdjacentHTML('beforeend', footerMarkup);
  }

  const createStoreButton = document.getElementById('open-store-modal');
  if (createStoreButton && !document.getElementById('store-modal')) {
    createStoreButton.addEventListener('click', () => {
      window.location.href = '/index.html#open-store-modal';
    });
  }
})();
