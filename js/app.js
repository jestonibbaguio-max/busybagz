/* ============================================
   BusyBagz — Product Data & Application Logic
   ============================================ */

const PRODUCTS = [
  {
    id: 6,
    name: 'Pickle Bag',
    category: 'UBEC Gigcase',
    breadcrumbCategory: 'UBEC Gigcase',
    price: 0,
    priceLabel: 'Pre-order',
    originalPrice: null,
    tag: 'Pre-order',
    description: 'PRE-ORDERS NOW OPEN! 🎒\nPickle Bag - Approved Standard Size',
    storeName: 'UBEC Gigcase',
    storeUrl: 'https://www.facebook.com/Ubecgigcase',
    storePageUrl: 'store/UBEC-Gigcase',
    reservationUrl: 'https://www.facebook.com/Ubecgigcase',
    colors: ['#d8e5ed'],
    rating: 0,
    reviews: 0,
    image: 'https://res.cloudinary.com/sjnrfmjm/image/upload/v1788514705/gigcase_bag_2_1.jpg',
    images: [
      'https://res.cloudinary.com/sjnrfmjm/image/upload/v1788514705/gigcase_bag_2_1.jpg',
      'https://res.cloudinary.com/sjnrfmjm/image/upload/v1788514705/gigcase_bag_2_2.jpg',
      'https://res.cloudinary.com/sjnrfmjm/image/upload/v1788514704/gigcase_bag_2_3.jpg'
    ],
    comments: []
  },
  {
    id: 5,
    name: 'UBEC Gigcase',
    category: 'Transparent Bags',
    breadcrumbCategory: 'UBEC Gigcase',
    breadcrumbName: 'Transparent bag',
    price: 0,
    priceLabel: 'Pre-order',
    originalPrice: null,
    tag: 'Pre-order',
    description: 'PRE-ORDERS NOW OPEN! 🎒\nTransparent Bag - Approved Standard Size & Model for School ✅\nMade of THICK PLASTIC material ✅',
    storeName: 'UBEC Gigcase',
    storeUrl: 'https://www.facebook.com/Ubecgigcase',
    storePageUrl: 'store/UBEC-Gigcase',
    reservationUrl: 'https://www.facebook.com/Ubecgigcase',
    colors: ['#d8e5ed'],
    rating: 0,
    reviews: 0,
    image: 'https://res.cloudinary.com/sjnrfmjm/image/upload/v1788513590/gigcase_bag_1.jpg',
    images: [
      'https://res.cloudinary.com/sjnrfmjm/image/upload/v1788513590/gigcase_bag_1.jpg',
      'https://res.cloudinary.com/sjnrfmjm/image/upload/v1788514172/gigcase_bag_1_3.jpg',
      'https://res.cloudinary.com/sjnrfmjm/image/upload/v1788514172/gigcase_bag_1_2.jpg'
    ],
    comments: []
  },
];

/* ---------- SVG Icons ---------- */
const ICONS = {
  cart: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"/></svg>`,
  starEmpty: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg>`,
  truck: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.079-.481 1.042-1.101-.037-.618-.306-2.025-.876-3.424a4.85 4.85 0 0 0-1.59-2.113L16.5 9.656V4.5h-4.5"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg>`,
  refresh: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"/></svg>`,
};

/* ---------- Utility ---------- */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === parseInt(id));
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

function generateStars(rating) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += ICONS.star;
  if (hasHalf) html += ICONS.starEmpty;
  for (let i = full + (hasHalf ? 1 : 0); i < 5; i++) html += ICONS.starEmpty;
  return html;
}

const STORES_STORAGE_KEY = 'busybagz-stores';
const DEFAULT_STORES = [
  {
    id: 'ubec-gigcase',
    name: 'UBEC Gigcase',
    category: 'Custom Bags',
    description: 'Custom bags that are hard to find in malls or stores.',
    image: 'https://res.cloudinary.com/sjnrfmjm/image/upload/v1788515161/gigcase_logo.jpg',
    specialties: ['Bike bag', 'Guitar bag', 'Free dive bag', 'Moto bag', 'Custom Pickle Ball bags', 'Other custom bags'],
    services: ['In-store shopping', 'Special Discount', 'Delivery', 'COD around Cebu city'],
    address: 'Sangi gate Barangay, Pajo, Lapu-Lapu City, Philippines, 6015',
    addressUrl: 'https://www.bing.com/maps/default.aspx?v=2&pc=FACEBK&mid=8100&where1=Sangi%20gate%20Barangay%2C%20Pajo%2C%20Lapu-Lapu%20City%2C%20Philippines%2C%206015&FORM=FBKPL1&mkt=en-GB&fbclid=IwcGRvZgFleHRuA2FlbQIxMABicmlkETEwZ08zVkh6Rk1TNVhMM1Flc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHuh33clNJI1g7nH_k4ggusO327iyq-f4tHzwXUbCvAzK-eiCukeldPHoj9gv_aem_BxufZ66sKpyOwh2ohDdG2A'
  },
  {
    id: 'all-in-the-van',
    name: 'All in the Van',
    category: 'Travel & Tour',
    description: 'All in the Van Travel & Tour is a premier, newly established transport and tour provider dedicated to delivering seamless, safe, and comfortable travel experiences. Specializing in private van rentals and customized tour packages, we cater to families, corporate groups, and independent travelers looking to explore the region’s top destinations. DM us to reserve yours today! 📩',
    image: 'https://res.cloudinary.com/sjnrfmjm/image/upload/v1788542559/store_van_logo.jpg',
    specialties: ['Private van rentals', 'Customized tour packages', 'Family travel', 'Corporate group transfers'],
    services: ['Safe and comfortable travel', 'Custom itineraries', 'Private van rental', 'Tour packages'],
    facebookUrl: 'https://www.facebook.com/gabriel.hamo'
  }
];

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}

function normalizeStoreSlug(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/%20/g, ' ')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getStores() {
  try {
    const stores = JSON.parse(localStorage.getItem(STORES_STORAGE_KEY) || '[]');
    const savedStores = (Array.isArray(stores) ? stores : []).filter(store => store.id !== 'busyReviewer' && store.name !== 'busyReviewer' && store.name.toLowerCase() !== 'gigcase');
    return [...DEFAULT_STORES, ...savedStores.filter(store => !DEFAULT_STORES.some(defaultStore => defaultStore.name === store.name))];
  } catch {
    return DEFAULT_STORES;
  }
}

function getStoreUrl(store) {
  return `store/${normalizeStoreSlug(store?.name || '')}`;
}

function setMetaContent(selector, content) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute('content', content);
}

function renderProductCard(product) {
  return `
    <article class="product-card" id="product-${product.id}">
      <a href="pdp.html?id=${product.id}" class="product-card-link">
        <div class="product-card-image">
          <img src="${product.image}" alt="${escapeHTML(product.name)}" loading="lazy">
          ${product.tag ? `<span class="product-card-tag">${escapeHTML(product.tag)}</span>` : ''}
          <div class="product-card-quick">Quick View →</div>
        </div>
        <div class="product-card-info">
          <h3 class="product-card-name">${escapeHTML(product.name)}</h3>
          <p class="product-card-category">${escapeHTML(product.category)}</p>
          <p class="product-card-price">
            ${product.priceLabel || formatPrice(product.price)}
            ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
          </p>
        </div>
      </a>

    </article>`;
}

function renderStoreCard(store) {
  const image = store.image || PRODUCTS[0].image;
  return `
    <article class="product-card store-card">
      <a href="${getStoreUrl(store)}" class="product-card-link">
        <div class="product-card-image">
          <img src="${escapeHTML(image)}" alt="${escapeHTML(store.name)} store" loading="lazy">
          <span class="product-card-tag">Store</span>
        </div>
        <div class="product-card-info">
          <h3 class="product-card-name">${escapeHTML(store.name)}</h3>
          <p class="product-card-category">${escapeHTML(store.category)}</p>
          <p class="store-card-description">${escapeHTML(store.description)}</p>
        </div>
      </a>
    </article>`;
}

/* ---------- Navbar Scroll Effect ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ---------- Home Page: Render Product Grid ---------- */
function renderProductGrid(query = '') {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const normalizedQuery = query.trim().toLowerCase();
  const products = PRODUCTS.filter(product => [5, 6].includes(product.id) && (!normalizedQuery || [product.name, product.category, product.description]
    .some(value => value.toLowerCase().includes(normalizedQuery))));
  const stores = getStores().filter(store => [store.name, store.category, store.description]
    .some(value => value.toLowerCase().includes(normalizedQuery)));
  const results = [...products.map(renderProductCard), ...stores.map(renderStoreCard)];

  grid.innerHTML = results.length
    ? results.join('')
    : `<p class="empty-search">No stores match “${escapeHTML(query)}”.</p>`;
}

function renderSearchResults(query = '') {
  const resultsContainer = document.getElementById('search-results');
  if (!resultsContainer) return;

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    resultsContainer.innerHTML = '';
    return;
  }

  const stores = getStores().filter(store => [store.name, store.category, store.description]
    .some(value => value.toLowerCase().includes(normalizedQuery)))
    .slice(0, 5)
    .map(store => `
      <a class="search-result" role="option" href="${getStoreUrl(store)}">
        <img src="${escapeHTML(store.image || PRODUCTS[0].image)}" alt="">
        <span><strong>${escapeHTML(store.name)}</strong><span>${escapeHTML(store.category)}</span></span>
        <span class="search-result-type">Store</span>
      </a>`);
  const products = PRODUCTS.filter(product => [5, 6].includes(product.id) && [product.name, product.category, product.description]
    .some(value => value.toLowerCase().includes(normalizedQuery)))
    .slice(0, 5)
    .map(product => `
      <a class="search-result" role="option" href="pdp.html?id=${product.id}">
        <img src="${product.image}" alt="">
        <span><strong>${escapeHTML(product.name)}</strong><span>${escapeHTML(product.category)}</span></span>
        <span class="search-result-type">Product</span>
      </a>`);
  const results = [...products, ...stores];
  resultsContainer.innerHTML = results.length
    ? results.join('')
    : '<p class="search-no-results">No stores found.</p>';
}

function initHomeSearch() {
  const search = document.getElementById('site-search');
  const input = document.getElementById('search-input');
  if (!search || !input) return;

  search.addEventListener('submit', event => event.preventDefault());
  input.addEventListener('input', event => {
    renderProductGrid(event.target.value);
    renderSearchResults(event.target.value);
  });
}

function initStoreCreation() {
  const modal = document.getElementById('store-modal');
  const openButton = document.getElementById('open-store-modal');
  const form = document.getElementById('store-form');
  const message = document.getElementById('store-form-message');
  if (!modal || !openButton || !form || !message) return;

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  openButton.addEventListener('click', () => {
    modal.hidden = false;
    form.elements.name.focus();
    document.body.style.overflow = 'hidden';
  });
  modal.addEventListener('click', event => {
    if (event.target.hasAttribute('data-close-store-modal')) closeModal();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const store = {
      id: Date.now(),
      name: data.get('name').trim(),
      category: data.get('category').trim(),
      description: data.get('description').trim(),
      image: data.get('image').trim()
    };
    localStorage.setItem(STORES_STORAGE_KEY, JSON.stringify([...getStores(), store]));
    form.reset();
    renderProductGrid(document.getElementById('search-input').value);
    renderSearchResults(document.getElementById('search-input').value);
    message.textContent = `${store.name} is now searchable.`;
    setTimeout(() => {
      message.textContent = '';
      closeModal();
    }, 1400);
  });
}

/* ---------- PDP: Render Product Detail ---------- */
function renderPDP() {
  const container = document.getElementById('pdp-content');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const product = getProductById(productId);

  if (!product) {
    container.innerHTML = `
      <div style="text-align:center; padding:6rem 2rem;">
        <h2 style="margin-bottom:1rem;">Product Not Found</h2>
        <p style="color:var(--color-text-muted); margin-bottom:2rem;">The product you're looking for doesn't exist.</p>
        <a href="index.html" class="hero-cta">Back to Shop ${ICONS.arrowRight}</a>
      </div>`;
    return;
  }

  // Update page title
  document.title = `${product.name} — BusyBagz`;
  const productUrl = `https://busybagz.com/pdp.html?id=${product.id}`;
  const productDescription = product.description.replace(/\n/g, ' ');
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = productUrl;
  setMetaContent('meta[property="og:title"]', `${product.name} — BusyBagz`);
  setMetaContent('meta[property="og:description"]', productDescription);
  setMetaContent('meta[property="og:url"]', productUrl);
  setMetaContent('meta[property="og:image"]', product.image);
  setMetaContent('meta[name="description"]', productDescription);
  injectProductJsonLd(product);

  // Breadcrumb
  const breadcrumb = document.getElementById('pdp-breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="index.html">Home</a>
      <span class="separator">/</span>
      <a href="${product.storePageUrl || 'index.html'}">${product.breadcrumbCategory || product.category}</a>
      <span class="separator">/</span>
      <span class="current">${product.breadcrumbName || product.name}</span>`;
  }

  container.innerHTML = `
    <div class="pdp-main">
      <!-- Gallery -->
      <div class="pdp-gallery">
        <div class="pdp-image-main">
          <img id="pdp-main-img" src="${product.images[0]}" alt="${product.name}">
        </div>
        <div class="pdp-thumbnails">
          ${product.images.map((img, i) => `
            <div class="pdp-thumb ${i === 0 ? 'active' : ''}" onclick="switchImage('${img}', this)">
              <img src="${img}" alt="${product.name} view ${i + 1}">
            </div>`).join('')}
        </div>
      </div>

      <!-- Details -->
      <div class="pdp-details">
        <p class="pdp-category">${product.category}</p>
        <h1 class="pdp-title">${product.name}</h1>

        ${product.reviews ? `<div class="pdp-rating">
          <div class="pdp-stars">${generateStars(product.rating)}</div>
          <span class="pdp-rating-text">${product.rating} (${product.reviews} reviews)</span>
        </div>` : ''}

        <p class="pdp-price">
          ${product.priceLabel || formatPrice(product.price)}
          ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
        </p>
        ${product.priceLabel ? '' : `<p class="pdp-installment">or 4 interest-free payments of ${formatPrice(product.price / 4)} with Afterpay</p>`}

        <p class="pdp-description">${escapeHTML(product.description).replace(/\n/g, '<br>')}</p>
        ${product.reservationUrl ? `<p class="pdp-reservation"><a href="${product.reservationUrl}" target="_blank" rel="noopener noreferrer">DM us to reserve yours today! 📩</a></p>` : ''}
        ${product.storeUrl ? `<p class="pdp-seller">Available at <a href="${product.storePageUrl || product.storeUrl}" ${product.storePageUrl ? '' : 'target="_blank" rel="noopener noreferrer"'}>${escapeHTML(product.storeName)}</a></p>` : ''}

        <p class="pdp-option-label">Color</p>
        <div class="pdp-colors">
          ${product.colors.map((color, i) => `
            <div class="color-swatch ${i === 0 ? 'active' : ''}"
                 style="background:${color}"
                 onclick="selectColor(this)"></div>`).join('')}
        </div>

        <div class="pdp-actions">
          <button class="btn-wishlist">${ICONS.heart}</button>
        </div>

        <div class="pdp-features">
          <div class="pdp-feature">${ICONS.truck} <span>Free Shipping</span></div>
          <div class="pdp-feature">${ICONS.shield} <span>2-Year Warranty</span></div>
          <div class="pdp-feature">${ICONS.refresh} <span>30-Day Returns</span></div>
        </div>
      </div>
    </div>

  `;

  // Render related products
  renderRelated(product.id);
  initPDPImageZoom();
}

function injectProductJsonLd(product) {
  const scriptId = 'pdp-product-schema';
  let schemaScript = document.getElementById(scriptId);

  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = scriptId;
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [product.image],
    description: product.description,
    sku: String(product.id),
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: product.storeName || 'BusyBagz'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PHP',
      price: String(product.price || 0),
      availability: product.priceLabel && product.priceLabel.toLowerCase().includes('pre-order')
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  if (product.rating > 0 && product.reviews > 0) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(product.rating),
      reviewCount: String(product.reviews)
    };
  }

  schemaScript.textContent = JSON.stringify(productSchema);
}

function initPDPImageZoom() {
  const mainImage = document.getElementById('pdp-main-img');
  if (!mainImage) return;

  let overlay = document.getElementById('pdp-zoom-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'pdp-zoom-overlay';
    overlay.className = 'pdp-zoom-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <button class="pdp-zoom-close" type="button" aria-label="Close image view">&times;</button>
      <button class="pdp-zoom-nav pdp-zoom-prev" type="button" aria-label="Previous image">&#10094;</button>
      <img class="pdp-zoom-image" src="" alt="Product image zoom view">
      <button class="pdp-zoom-nav pdp-zoom-next" type="button" aria-label="Next image">&#10095;</button>
    `;
    document.body.appendChild(overlay);
  }

  const zoomImage = overlay.querySelector('.pdp-zoom-image');
  const closeButton = overlay.querySelector('.pdp-zoom-close');
  const prevButton = overlay.querySelector('.pdp-zoom-prev');
  const nextButton = overlay.querySelector('.pdp-zoom-next');
  const productImages = Array.from(document.querySelectorAll('.pdp-thumb img')).map((img) => img.src);
  const state = {
    currentIndex: 0,
    pointerStartX: 0,
    pointerStartY: 0,
  };

  const setZoomImage = (index) => {
    if (productImages.length === 0) return;
    const safeIndex = (index + productImages.length) % productImages.length;
    state.currentIndex = safeIndex;
    zoomImage.src = productImages[safeIndex];
    zoomImage.alt = (document.querySelector('.pdp-thumb.active img') || mainImage).alt || 'Product image zoom view';
  };

  const openZoom = (index = 0) => {
    if (productImages.length === 0) {
      productImages.push(mainImage.src);
    }
    setZoomImage(index);
    overlay.hidden = false;
    document.body.classList.add('pdp-zoom-open');
  };

  const closeZoom = () => {
    overlay.hidden = true;
    document.body.classList.remove('pdp-zoom-open');
  };

  const findCurrentImageIndex = () => {
    const currentSrc = mainImage.src;
    const index = productImages.indexOf(currentSrc);
    return index >= 0 ? index : 0;
  };

  mainImage.onclick = () => {
    openZoom(findCurrentImageIndex());
  };
  mainImage.onkeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openZoom(findCurrentImageIndex());
    }
  };
  mainImage.setAttribute('tabindex', '0');
  mainImage.setAttribute('role', 'button');
  mainImage.setAttribute('aria-label', 'Open full-size product image');

  prevButton.onclick = () => setZoomImage(state.currentIndex - 1);
  nextButton.onclick = () => setZoomImage(state.currentIndex + 1);
  closeButton.onclick = closeZoom;

  overlay.onclick = (event) => {
    if (event.target === overlay) {
      closeZoom();
    }
  };

  overlay.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    state.pointerStartX = touch.clientX;
    state.pointerStartY = touch.clientY;
  }, { passive: true });

  overlay.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - state.pointerStartX;
    const deltaY = touch.clientY - state.pointerStartY;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        setZoomImage(state.currentIndex + 1);
      } else {
        setZoomImage(state.currentIndex - 1);
      }
    }
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.hidden) {
      closeZoom();
    }
  });
}

/* ---------- PDP Interactions ---------- */
function switchImage(src, thumbEl) {
  const mainImage = document.getElementById('pdp-main-img');
  if (mainImage) mainImage.src = src;
  document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
  thumbEl.classList.add('active');
}

function selectColor(el) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

function changeQty(delta) {
  const input = document.getElementById('qty-input');
  const val = Math.max(1, parseInt(input.value) + delta);
  input.value = val;
}

/* ---------- Related Products ---------- */
function renderRelated(currentId) {
  const section = document.getElementById('related-grid');
  if (!section) return;

  const related = PRODUCTS.filter(p => p.id !== currentId).slice(0, 3);
  section.innerHTML = related.map(product => `
    <a href="pdp.html?id=${product.id}" class="product-card">
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.tag ? `<span class="product-card-tag">${product.tag}</span>` : ''}
        <div class="product-card-quick">Quick View →</div>
      </div>
      <div class="product-card-info">
        <h3 class="product-card-name">${product.name}</h3>
        <p class="product-card-category">${product.category}</p>
        <p class="product-card-price">
          ${product.priceLabel || formatPrice(product.price)}
          ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
        </p>
      </div>
    </a>
  `).join('');
}

/* ---------- Add to Cart Animation ---------- */
function initAddToCart() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#btn-add-cart');
    if (!btn) return;
    btn.innerHTML = `✓ Added to Cart`;
    btn.style.background = '#2d6a4f';
    setTimeout(() => {
      btn.innerHTML = `${ICONS.cart} Add to Cart`;
      btn.style.background = '';
    }, 2000);
  });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderProductGrid();
  initHomeSearch();
  initStoreCreation();
  renderPDP();
  initAddToCart();
});
