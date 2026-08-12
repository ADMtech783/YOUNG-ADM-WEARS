document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      console.log('Menu toggle clicked');
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other open items first
      faqItems.forEach((other) => {
        other.classList.remove('active');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Then open this one, unless it was already open (acts as a toggle)
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
// YOUNG ADM — Shared cart engine
// Used by index.html, products.html, and gallery.html so the cart
// stays in sync no matter which page items were added from.

const CART_STORAGE_KEY = 'young-adm-cart';

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
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartCount();
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    countEl.textContent = getCartCount();
  }
}

function buildWhatsAppCheckoutMessage() {
  const cart = getCart();
  if (cart.length === 0) return '';

  const lines = cart.map((item) => `- ${item.name} x${item.quantity}`);
  const message = `Hi, I'd like to order:\n${lines.join('\n')}`;
  return encodeURIComponent(message);
}

// Sync the cart count badge as soon as any page loads
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-product-id]');
      if (!card) return;

      addToCart({
        id: card.dataset.productId,
        name: card.dataset.productName
      });

      // Quick visual feedback
      const originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1200);
    });
  });
});
// YOUNG ADM — Gallery data
// One entry per photo. Add new photos by adding a new object to this array —
// no HTML needs to be touched when you add more.

const galleryItems = [
  {
    id: 'g001',
    name: 'Premium Wear Clothing — Style 1',
    image: 'assets/images/gallery/clothes-01.jpg',
    category: 'clothes'
  },
  {
    id: 'g002',
    name: 'Premium Wristwatch — Style 1',
    image: 'assets/images/gallery/watch-01.jpg',
    category: 'watches'
  },
  {
    id: 'g003',
    name: 'Handmade Footwear — Style 1',
    image: 'assets/images/gallery/footwear-01.jpg',
    category: 'footwear'
  },
  {
    id: 'g004',
    name: 'Premium Wear Bag — Style 1',
    image: 'assets/images/gallery/bag-01.jpg',
    category: 'bags'
  }

  // Keep adding entries in this same shape as you add photos.
  // id must be unique for every photo (g005, g006, g007...).
];
// YOUNG ADM — Gallery renderer
// Builds every gallery card from galleryItems (see gallery-data.js)
// and wires up its Add to Cart button.

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

  // cart.js's own DOMContentLoaded listener already ran by the time
  // these cards exist, so their Add to Cart buttons need wiring up here too.
  grid.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-product-id]');
      if (!card) return;

      addToCart({
        id: card.dataset.productId,
        name: card.dataset.productName
      });

      const originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1200);
    });
  });
});
