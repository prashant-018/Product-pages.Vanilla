import './style.css';

// DOM Elements
const mainImage = document.getElementById('mainImage');
const thumbnails = document.getElementById('thumbnails');
const colorSwatches = document.querySelectorAll('.color-swatch');
const sizeOptions = document.querySelectorAll('.size-option');
const quantityInput = document.querySelector('.quantity-input');
const minusBtn = document.querySelector('.quantity-btn.minus');
const plusBtn = document.querySelector('.quantity-btn.plus');
const wishlistBtn = document.querySelector('.wishlist-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const compareColorsBtn = document.getElementById('compareColorsBtn');
const compareColorsModal = document.getElementById('compareColorsModal');
const sizeChartBtn = document.getElementById('openSizeChart');
const sizeChartModal = document.getElementById('sizeChartModal');
const modalCloseBtns = document.querySelectorAll('.modal-close');
const modalOverlays = document.querySelectorAll('.modal-overlay');
const sizeTabBtns = document.querySelectorAll('.size-tab-btn');
const quickAddBtns = document.querySelectorAll('.quick-add-btn');
const accordionHeaders = document.querySelectorAll('.accordion-header');
const faqQuestions = document.querySelectorAll('.faq-question');
const personalizeCheckbox = document.getElementById('personalizeCheckbox');
const fontOptions = document.querySelectorAll('.font-option');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const cartBtn = document.querySelector('.cart-btn');
const cartDrawer = document.getElementById('cartDrawer');
const cartCloseBtn = document.querySelector('.cart-close');
const cartOverlay = document.querySelector('.cart-overlay');
const notification = document.querySelector('.notification');

// Product State
let productState = {
  color: 'Red',
  size: 'M',
  quantity: 1,
  price: 129.99,
  inWishlist: false,
  personalization: {
    enabled: false,
    text: '',
    font: 'serif'
  }
};

// Initialize the product page
function initProductPage() {
  // Set up thumbnail click events
  thumbnails.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', () => {
      const largeImageUrl = img.dataset.large;
      updateMainImage(largeImageUrl);
      highlightThumbnail(img);
    });
  });

  // Set up color swatch selection
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.dataset.color;
      updateProductState('color', color);
      updateSelectedColor(color);
      updateMainImageBasedOnColor(color);
    });
  });

  // Set up size selection
  sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      if (!option.classList.contains('unavailable')) {
        const size = option.dataset.size;
        updateProductState('size', size);
        updateSelectedSize(size);
      }
    });
  });

  // Quantity selector
  minusBtn.addEventListener('click', () => {
    if (productState.quantity > 1) {
      updateProductState('quantity', productState.quantity - 1);
      updateQuantityInput();
    }
  });

  plusBtn.addEventListener('click', () => {
    if (productState.quantity < 10) {
      updateProductState('quantity', productState.quantity + 1);
      updateQuantityInput();
    }
  });

  quantityInput.addEventListener('change', () => {
    const value = parseInt(quantityInput.value);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      updateProductState('quantity', value);
    } else {
      quantityInput.value = productState.quantity;
    }
  });

  // Wishlist toggle
  wishlistBtn.addEventListener('click', () => {
    productState.inWishlist = !productState.inWishlist;
    updateWishlistButton();
    showNotification(productState.inWishlist ? 'Added to wishlist' : 'Removed from wishlist');
  });

  // Tab navigation
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      switchTab(tabId);
    });
  });

  // Compare colors modal
  compareColorsBtn.addEventListener('click', openCompareColorsModal);

  // Size chart modal
  sizeChartBtn.addEventListener('click', openSizeChartModal);

  // Modal close buttons
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', closeAllModals);
  });

  // Size chart unit tabs
  sizeTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const unit = btn.dataset.unit;
      switchSizeChartUnit(unit);
    });
  });

  // Quick add buttons
  quickAddBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showNotification('Item added to cart');
      updateCartCount(1);
    });
  });

  // Accordion functionality
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
    });
  });

  // FAQ accordion
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      item.classList.toggle('active');
    });
  });

  // Personalization toggle
  personalizeCheckbox.addEventListener('change', (e) => {
    productState.personalization.enabled = e.target.checked;
    const personalizationField = document.querySelector('.personalization-field');
    const input = personalizationField.querySelector('input');
    
    if (e.target.checked) {
      personalizationField.style.display = 'block';
      input.disabled = false;
      input.focus();
    } else {
      personalizationField.style.display = 'none';
      input.disabled = true;
    }
  });

  // Font selection
  fontOptions.forEach(option => {
    option.addEventListener('click', () => {
      fontOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      const font = option.dataset.font;
      productState.personalization.font = font;
    });
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    document.querySelector('.main-nav').classList.toggle('active');
  });

  // Cart drawer toggle
  cartBtn.addEventListener('click', () => {
    cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  cartCloseBtn.addEventListener('click', closeCartDrawer);
  cartOverlay.addEventListener('click', closeCartDrawer);

  // Close modals on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeCartDrawer();
    }
  });

  // Initialize first thumbnail as selected
  if (thumbnails.children.length > 0) {
    thumbnails.children[0].classList.add('selected');
  }
}

// Update main product image
function updateMainImage(imageUrl) {
  mainImage.src = imageUrl;
  mainImage.alt = `Main Product - ${productState.color} variant`;
}

function highlightThumbnail(thumbnail) {
  document.querySelectorAll('#thumbnails img').forEach(img => {
    img.classList.remove('selected');
  });
  thumbnail.classList.add('selected');
}

// Update product state
function updateProductState(key, value) {
  productState[key] = value;
  updateUI();
}

function updateUI() {
  updateSelectedColor(productState.color);
  updateSelectedSize(productState.size);
  updateQuantityInput();
  updateWishlistButton();
}

function updateSelectedColor(color) {
  // Update color swatches
  colorSwatches.forEach(swatch => {
    swatch.classList.remove('active');
    if (swatch.dataset.color === color) {
      swatch.classList.add('active');
    }
  });

  // Update selected color text
  document.getElementById('selectedColor').textContent = color;
}

function updateSelectedSize(size) {
  // Update size options
  sizeOptions.forEach(option => {
    option.classList.remove('active');
    if (option.dataset.size === size) {
      option.classList.add('active');
    }
  });

  // Update selected size text
  document.getElementById('selectedSize').textContent = size;
}

function updateQuantityInput() {
  quantityInput.value = productState.quantity;
}

function updateWishlistButton() {
  if (productState.inWishlist) {
    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Saved';
    wishlistBtn.classList.add('active');
  } else {
    wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Save';
    wishlistBtn.classList.remove('active');
  }
}

function updateMainImageBasedOnColor(color) {
  // In a real app, you would have a mapping of color to image
  let imageUrl = 'assets/1.jpg';
  switch (color) {
    case 'Blue':
      imageUrl = 'assets/2.jpg';
      break;
    case 'Green':
      imageUrl = 'assets/3.jpg';
      break;
    case 'Black':
      imageUrl = 'assets/4.jpeg';
      break;
    case 'White':
      imageUrl = 'assets/5.jpeg';
      break;
  }
  updateMainImage(imageUrl);
}

// Tab functionality
function switchTab(tabId) {
  // Update tab buttons
  tabBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    }
  });

  // Update tab contents
  tabContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === tabId) {
      content.classList.add('active');
    }
  });
}

// Modal functionality
function openCompareColorsModal() {
  compareColorsModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function openSizeChartModal() {
  sizeChartModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

function closeCartDrawer() {
  cartDrawer.classList.remove('active');
  document.body.style.overflow = '';
}

// Size chart unit switching
function switchSizeChartUnit(unit) {
  // Update tab buttons
  sizeTabBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.unit === unit) {
      btn.classList.add('active');
    }
  });

  // In a real app, you would update the size chart values based on unit
  const sizeChart = document.querySelector('.size-chart');
  if (unit === 'cm') {
    // Convert inches to cm
    sizeChart.querySelectorAll('td').forEach(cell => {
      if (cell.textContent.includes('"')) {
        const inches = parseFloat(cell.textContent);
        const cm = Math.round(inches * 2.54);
        cell.textContent = `${cm}cm`;
      }
    });
  } else {
    // Convert cm to inches
    sizeChart.querySelectorAll('td').forEach(cell => {
      if (cell.textContent.includes('cm')) {
        const cm = parseFloat(cell.textContent);
        const inches = (cm / 2.54).toFixed(1);
        cell.textContent = `${inches}"`;
      }
    });
  }
}

// Image zoom functionality
function setupImageZoom() {
  const zoom = document.getElementById('imageZoom');
  
  mainImage.addEventListener('mousemove', (e) => {
    if (!zoom.style.backgroundImage) {
      zoom.style.backgroundImage = `url('${mainImage.src}')`;
    }
    
    const { left, top, width, height } = mainImage.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    
    zoom.style.backgroundPosition = `${x}% ${y}%`;
    zoom.style.opacity = '1';
    zoom.style.transform = 'scale(1)';
  });
  
  mainImage.addEventListener('mouseleave', () => {
    zoom.style.opacity = '0';
    zoom.style.transform = 'scale(0)';
  });
}

// Notification system
function showNotification(message) {
  const notification = document.querySelector('.notification');
  notification.querySelector('span').textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Cart functionality
function updateCartCount(change) {
  const cartCount = document.querySelector('.cart-count');
  let count = parseInt(cartCount.textContent) || 0;
  count += change;
  cartCount.textContent = count;
  
  // Animate the cart icon
  cartBtn.classList.add('animate');
  setTimeout(() => {
    cartBtn.classList.remove('animate');
  }, 500);
}

// Initialize the product page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initProductPage();
  setupImageZoom();
  
  // Add animation to cart button when items are added
  cartBtn.addEventListener('animationend', () => {
    cartBtn.classList.remove('animate');
  });
});