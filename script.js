document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((other) => {
        other.classList.remove('active');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
});

// ============================================
// YOUNG ADM — Shared cart engine
// ============================================

const CART_STORAGE_KEY = 'young-adm-cart';
const WHATSAPP_NUMBER = '2348126966400';

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Could not read cart:', err);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error('Could not save cart:', err);
  }
  updateCartCount();
  renderCartPanel();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: Number(product.price) || 0, quantity: 1 });
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
}

function changeQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart(cart);
  }
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return getCart().reduce((total, item) => total + (item.price * item.quantity), 0);
}

function formatNaira(amount) {
  return '₦' + amount.toLocaleString('en-NG');
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = getCartCount();
}

function buildWhatsAppCheckoutMessage() {
  const cart = getCart();
  if (cart.length === 0) return '';
  const lines = cart.map((item) => `- ${item.name} x${item.quantity} (${formatNaira(item.price * item.quantity)})`);
  const total = `\nTotal: ${formatNaira(getCartTotal())}`;
  const message = `Hi, I'd like to order:\n${lines.join('\n')}${total}`;
  return encodeURIComponent(message);
}

function renderCartPanel() {
  const itemsContainer = document.getElementById('cart-panel-items');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (!itemsContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    itemsContainer.innerHTML = `<p class="cart-empty-msg">Your cart is empty.</p>`;
    if (checkoutBtn) checkoutBtn.setAttribute('href', '#');
    return;
  }

  itemsContainer.innerHTML = cart.map((item) => `
    <div class="cart-item" data-cart-item-id="${item.id}">
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">${formatNaira(item.price)} each</span>
      </div>
      <div class="cart-item-qty">
        <button class="qty-minus" aria-label="Decrease quantity">−</button>
        <span>${item.quantity}</span>
        <button class="qty-plus" aria-label="Increase quantity">+</button>
        <button class="qty-remove" aria-label="Remove item">🗑</button>
      </div>
    </div>
  `).join('') + `<div class="cart-total-row">Total: <strong>${formatNaira(getCartTotal())}</strong></div>`;

  itemsContainer.querySelectorAll('.cart-item').forEach((row) => {
    const id = row.dataset.cartItemId;
    row.querySelector('.qty-minus').addEventListener('click', () => changeQuantity(id, -1));
    row.querySelector('.qty-plus').addEventListener('click', () => changeQuantity(id, 1));
    row.querySelector('.qty-remove').addEventListener('click', () => removeFromCart(id));
  });

  if (checkoutBtn) {
    const message = buildWhatsAppCheckoutMessage();
    checkoutBtn.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`);
  }
}

function openCartPanel() {
  document.getElementById('cart-panel')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
}

function closeCartPanel() {
  document.getElementById('cart-panel')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
}

function toggleMobileMenu() {
  document.querySelector('.nav-links')?.classList.toggle('mobile-open');
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCartPanel();

  document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-product-id]');
      if (!card) return;
      addToCart({
        id: card.dataset.productId,
        name: card.dataset.productName,
        price: card.dataset.productPrice
      });
      const originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => { btn.textContent = originalText; }, 1200);
    });
  });

  document.getElementById('cart-toggle-btn')?.addEventListener('click', openCartPanel);
  document.getElementById('cart-close-btn')?.addEventListener('click', closeCartPanel);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCartPanel);
  document.getElementById('nav-toggle')?.addEventListener('click', toggleMobileMenu);
});

// ============================================
// YOUNG ADM — Gallery data
// ============================================

const galleryItems = [
  { id: 'g001', name: 'Premium Wear Clothing — Style 1', image: 'AD.jpg', category: 'clothes' },
  { id: 'g002', name: 'Premium Wristwatch — Style 1', image: 'AD.jpg', category: 'watches' },
  { id: 'g003', name: 'Handmade Footwear — Style 1', image: 'AD.jpg', category: 'footwear' },
  { id: 'g004', name: 'Premium Wear Bag — Style 1', image: 'AD.jpg', category: 'bags' }
];

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('gallery-grid');
  if (!grid || typeof galleryItems === 'undefined') return;

  galleryItems.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.dataset.productId = item.id;
    card.dataset.productName = item.name;
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy" />
      <div class="gallery-card-overlay">
        <span class="gallery-card-name">${item.name}</span>
        <button class="btn btn-primary add-to-cart-btn">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-product-id]');
      if (!card) return;
      addToCart({ id: card.dataset.productId, name: card.dataset.productName });
      const originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => { btn.textContent = originalText; }, 1200);
    });
  });
});
