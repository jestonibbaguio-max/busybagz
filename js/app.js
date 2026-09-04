/* ============================================
   BusyBagz — Product Data & Application Logic
   ============================================ */

const PRODUCTS = [
  {
    id: 1,
    name: 'Voyager Canvas Backpack',
    category: 'Backpacks',
    price: 189.00,
    originalPrice: 249.00,
    tag: 'Best Seller',
    description: 'Crafted from premium waxed canvas, the Voyager is the ultimate everyday companion. Featuring a padded 15" laptop sleeve, hidden anti-theft pocket, and water-resistant lining, it blends timeless style with modern functionality. The adjustable leather straps and brass hardware age beautifully over time.',
    colors: ['#2c3e50', '#8b7355', '#3a3a3a', '#c8a97e'],
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165b27?w=600&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c661c4293?w=600&h=600&fit=crop&q=80',
    ],
    comments: [
      { author: 'Mia R.', text: 'The quality feels premium and the straps are incredibly comfortable for daily use.', rating: 5 },
      { author: 'Alvin T.', text: 'Looks sharp and durable. It fits my laptop and everyday essentials without feeling bulky.', rating: 5 },
      { author: 'Nina S.', text: 'Beautiful design and solid craftsmanship. Definitely worth it for the price.', rating: 4 }
    ]
  },
  {
    id: 2,
    name: 'Élise Leather Tote',
    category: 'Tote Bags',
    price: 279.00,
    originalPrice: 349.00,
    tag: 'New Arrival',
    description: 'The Élise Tote redefines luxury with its buttery-soft Italian full-grain leather. Spacious enough for work, refined enough for evening — featuring a magnetic snap closure, interior zippered pocket, and suede lining. Each bag develops a unique patina that tells your story.',
    colors: ['#c8a97e', '#5c3a21', '#1a1a2e', '#d4a574'],
    rating: 4.9,
    reviews: 187,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop&q=80',
    ],
    comments: [
      { author: 'Ella P.', text: 'The leather is soft and the design is elegant enough for both work and evenings out.', rating: 5 },
      { author: 'Jules M.', text: 'It looks beautiful in person and the size is perfect for everyday essentials.', rating: 5 },
      { author: 'Sera K.', text: 'I get compliments whenever I carry it. The finish feels expensive and polished.', rating: 4 }
    ]
  },
  {
    id: 3,
    name: 'Sierra Crossbody Sling',
    category: 'Crossbody',
    price: 149.00,
    originalPrice: null,
    tag: 'Trending',
    description: 'Minimalist by design, maximalist in function. The Sierra sling features a sleek profile with surprisingly generous capacity. Made from water-resistant recycled nylon with genuine leather accents, it includes RFID-blocking technology and quick-access front pocket for your essentials.',
    colors: ['#3a3a3a', '#2c3e50', '#5c3a21'],
    rating: 4.7,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473188588951-1d53a5c1e463?w=600&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop&q=80',
    ],
    comments: [
      { author: 'Priya W.', text: 'Lightweight, functional, and easy to carry everywhere. I love the hidden pocket.', rating: 5 },
      { author: 'Chris D.', text: 'Very sleek and durable. It feels premium without being bulky.', rating: 4 },
      { author: 'Lena G.', text: 'Perfect for everyday errands and travel.', rating: 5 }
    ]
  },
  {
    id: 4,
    name: 'Nomad Weekend Duffle',
    category: 'Duffle Bags',
    price: 329.00,
    originalPrice: 429.00,
    tag: 'Limited Edition',
    description: 'Built for the discerning traveler, the Nomad Duffle features a heritage-inspired silhouette in rugged full-grain leather. With a dedicated shoe compartment, trolley sleeve, and brass YKK zippers, it handles every journey in style. The canvas-lined interior keeps belongings organized and protected.',
    colors: ['#8b7355', '#3a3a3a', '#2c3e50'],
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c661c4293?w=600&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165b27?w=600&h=600&fit=crop&q=80',
    ],
    comments: [
      { author: 'Marcus L.', text: 'The storage is excellent and the bag handles travel really well.', rating: 5 },
      { author: 'Hannah B.', text: 'It feels substantial and high-end without being too heavy.', rating: 5 },
      { author: 'Tina R.', text: 'The pockets are smart and the leather has a beautiful finish.', rating: 4 }
    ]
  }
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

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}

function getStores() {
  try {
    const stores = JSON.parse(localStorage.getItem(STORES_STORAGE_KEY) || '[]');
    return Array.isArray(stores) ? stores : [];
  } catch {
    return [];
  }
}

function renderProductCard(product) {
  const comments = Array.isArray(product.comments) ? product.comments.slice(0, 3) : [];

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
            ${formatPrice(product.price)}
            ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
          </p>
        </div>
      </a>

      ${comments.length ? `
        <div class="product-card-comments">
          ${comments.map(comment => `
            <div class="product-card-comment">
              <div class="product-card-comment-head">
                <span class="product-card-stars">${'★'.repeat(comment.rating)}${'☆'.repeat(5 - comment.rating)}</span>
                <strong>${escapeHTML(comment.author)}</strong>
              </div>
              <p>${escapeHTML(comment.text)}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </article>`;
}

function renderStoreCard(store) {
  const image = store.image || PRODUCTS[0].image;
  return `
    <article class="product-card store-card">
      <div class="product-card-image">
        <img src="${escapeHTML(image)}" alt="${escapeHTML(store.name)} store" loading="lazy">
        <span class="product-card-tag">Store</span>
      </div>
      <div class="product-card-info">
        <h3 class="product-card-name">${escapeHTML(store.name)}</h3>
        <p class="product-card-category">${escapeHTML(store.category)}</p>
        <p class="store-card-description">${escapeHTML(store.description)}</p>
      </div>
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
  const products = PRODUCTS.filter(product => [product.name, product.category, product.description]
    .some(value => value.toLowerCase().includes(normalizedQuery)));
  const stores = getStores().filter(store => [store.name, store.category, store.description]
    .some(value => value.toLowerCase().includes(normalizedQuery)));
  const results = [...products.map(renderProductCard), ...stores.map(renderStoreCard)];

  grid.innerHTML = results.length
    ? results.join('')
    : `<p class="empty-search">No products or stores match “${escapeHTML(query)}”.</p>`;
}

function renderSearchResults(query = '') {
  const resultsContainer = document.getElementById('search-results');
  if (!resultsContainer) return;

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    resultsContainer.innerHTML = '';
    return;
  }

  const products = PRODUCTS.filter(product => [product.name, product.category, product.description]
    .some(value => value.toLowerCase().includes(normalizedQuery)))
    .slice(0, 5)
    .map(product => `
      <a class="search-result" role="option" href="pdp.html?id=${product.id}">
        <img src="${product.image}" alt="">
        <span><strong>${escapeHTML(product.name)}</strong><span>${escapeHTML(product.category)}</span></span>
        <span class="search-result-type">Product</span>
      </a>`);
  const stores = getStores().filter(store => [store.name, store.category, store.description]
    .some(value => value.toLowerCase().includes(normalizedQuery)))
    .slice(0, 5)
    .map(store => `
      <a class="search-result" role="option" href="#collections">
        <img src="${escapeHTML(store.image || PRODUCTS[0].image)}" alt="">
        <span><strong>${escapeHTML(store.name)}</strong><span>${escapeHTML(store.category)}</span></span>
        <span class="search-result-type">Store</span>
      </a>`);
  const results = [...products, ...stores];
  resultsContainer.innerHTML = results.length
    ? results.join('')
    : '<p class="search-no-results">No products or stores found.</p>';
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

  // Breadcrumb
  const breadcrumb = document.getElementById('pdp-breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="index.html">Home</a>
      <span class="separator">/</span>
      <a href="index.html">${product.category}</a>
      <span class="separator">/</span>
      <span class="current">${product.name}</span>`;
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

        <div class="pdp-rating">
          <div class="pdp-stars">${generateStars(product.rating)}</div>
          <span class="pdp-rating-text">${product.rating} (${product.reviews} reviews)</span>
        </div>

        <p class="pdp-price">
          ${formatPrice(product.price)}
          ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
        </p>
        <p class="pdp-installment">or 4 interest-free payments of ${formatPrice(product.price / 4)} with Afterpay</p>

        <p class="pdp-description">${product.description}</p>

        <p class="pdp-option-label">Color</p>
        <div class="pdp-colors">
          ${product.colors.map((color, i) => `
            <div class="color-swatch ${i === 0 ? 'active' : ''}"
                 style="background:${color}"
                 onclick="selectColor(this)"></div>`).join('')}
        </div>

        <div class="pdp-actions">
          <div class="qty-selector">
            <button class="qty-btn" onclick="changeQty(-1)">−</button>
            <input class="qty-value" id="qty-input" type="text" value="1" readonly>
            <button class="qty-btn" onclick="changeQty(1)">+</button>
          </div>
          <button class="btn-add-cart" id="btn-add-cart">
            ${ICONS.cart} Add to Cart
          </button>
          <button class="btn-wishlist">${ICONS.heart}</button>
        </div>

        <div class="pdp-features">
          <div class="pdp-feature">${ICONS.truck} <span>Free Shipping</span></div>
          <div class="pdp-feature">${ICONS.shield} <span>2-Year Warranty</span></div>
          <div class="pdp-feature">${ICONS.refresh} <span>30-Day Returns</span></div>
        </div>
      </div>
    </div>

    <div class="pdp-comments">
      <h2>Customer Reviews</h2>
      <div class="pdp-comments-list">
        ${(product.comments || []).slice(0, 3).map(comment => `
          <article class="pdp-comment">
            <div class="pdp-comment-head">
              <strong>${escapeHTML(comment.author)}</strong>
              <span>${'★'.repeat(comment.rating)}${'☆'.repeat(5 - comment.rating)}</span>
            </div>
            <p>${escapeHTML(comment.text)}</p>
          </article>
        `).join('')}
      </div>
    </div>
  `;

  // Render related products
  renderRelated(product.id);
}

/* ---------- PDP Interactions ---------- */
function switchImage(src, thumbEl) {
  document.getElementById('pdp-main-img').src = src;
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
          ${formatPrice(product.price)}
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
