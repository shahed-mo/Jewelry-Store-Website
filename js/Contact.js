document.addEventListener("DOMContentLoaded", () => {
  const menuLeft = document.querySelector('.menu-left');
  const miniCart = document.querySelector('.mini-cart');
  const overlay = document.querySelector('.remove-cart-shadow');


  // زرار فتح المينيو
  const mOpen = document.querySelector('.navbar-toggle');
  if (mOpen && menuLeft) {
    mOpen.addEventListener('click', () => {
      menuLeft.classList.add('active');
    });
  }

  // زرار فتح الكارت
  const cartIcon = document.querySelector('.cart-icon');
  if (cartIcon && miniCart && overlay) {
    cartIcon.addEventListener('click', () => {
      miniCart.classList.add('active');
      overlay.classList.add('active');
    });
  }

  // زرار الإغلاق (X)
  const allCloseButtons = document.querySelectorAll('.cart-remove');
  allCloseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (menuLeft) menuLeft.classList.remove('active');
      if (miniCart) miniCart.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    });
  });

  // الضغط على الشادو يقفل الكارت
  if (overlay && miniCart) {
    overlay.addEventListener('click', () => {
      miniCart.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
});
// افتح المينيو لما ادوس على الخطوط (الهامبرجر)
const menuBtn = document.querySelector('.menu-lines');
const sideMenu = document.querySelector('.main-category-menu');
const closeBtn = document.querySelector('.close-menu');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        sideMenu.classList.add('active');
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        sideMenu.classList.remove('active');
    });
}


const allCloseButtons = document.querySelectorAll('.cart-remove');
const menuLeft = document.querySelector('.menu-left');
const miniCart = document.querySelector('.mini-cart');
const overlay = document.querySelector('.remove-cart-shadow');

const mOpen = document.querySelector('.navbar-toggle');
if (mOpen) {
  mOpen.addEventListener('click', () => {
    menuLeft.classList.add('active');
  });
}

const cartIcon = document.querySelector('.cart-icon');
if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    miniCart.classList.add('active');
    overlay.classList.add('active');
  });
}

allCloseButtons.forEach(btn => {
  btn.addEventListener('click', () => {

    if (btn.closest('.menu-left')) {
      menuLeft.classList.remove('active');
    }
    if (btn.closest('.mini-cart')) {
      miniCart.classList.remove('active');
      overlay.classList.remove('active');
    }
  });
});

if (overlay) {
  overlay.addEventListener('click', () => {
    miniCart.classList.remove('active');
    overlay.classList.remove('active');
  });
}


// ---------------------- GLOBAL ----------------------
let cart = []; // ← cart معرف عالمياً


// ---------------------- MINI CART ----------------------
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.mini-cart')) return;

    // Helpers
    function saveCart() {
        try { localStorage.setItem('cart', JSON.stringify(cart)); }
        catch (err) { console.warn('cart.js: Failed to save cart', err); }
    }

    function loadCart() {
        try {
            const raw = localStorage.getItem('cart');
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
    }

    cart = loadCart(); // استخدام cart عالمي

    const AddtoCart = document.querySelectorAll('.add_to_cart');
    const cartContainer = document.querySelector('.cart-items');
    const totalValue = document.querySelector('.totalValue');
    const topTotalCart = document.querySelector('.top-total-cart');
    const cartCountDisplay = document.querySelector('.cart-count');
    const emptyMessage = document.querySelector('.shopping_cart_content .empty');
    const totalCartBox = document.querySelector('.total-cart');
    const freeShipBox = document.querySelector('.free-ship');
    const buttonsBox = document.querySelector('.buttons');

    if (!cartContainer || !topTotalCart || !totalValue) return;

    function updateUIVisibility() {
        if (cart.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            if (totalCartBox) totalCartBox.style.display = 'none';
            if (freeShipBox) freeShipBox.style.display = 'none';
            if (buttonsBox) buttonsBox.style.display = 'none';
        } else {
            if (emptyMessage) emptyMessage.style.display = 'none';
            if (totalCartBox) totalCartBox.style.display = 'flex';
            if (freeShipBox) freeShipBox.style.display = 'block';
            if (buttonsBox) buttonsBox.style.display = 'flex';
        }
        topTotalCart.textContent = `Cart(${cart.length})`;
        if (cartCountDisplay) cartCountDisplay.textContent = `(${cart.length})`;
    }

    function updateTotal() {
        let total = 0;
        cart.forEach(item => total += (Number(item.price) || 0) * (Number(item.qty) || 0));
        totalValue.textContent = total.toFixed(2);

        try {
            const threshold = 300;
            if (freeShipBox) {
                const remaining = Math.max(0, threshold - total);
                const remainingEl = freeShipBox.querySelector('.remaining-amount');
                if (remainingEl) remainingEl.textContent = `$${remaining.toFixed(2)}`;

                const percentEl = document.getElementById('progressBar');
                if (percentEl) percentEl.style.width = `${Math.min(100, (total/threshold)*100)}%`;
            }
        } catch {}
    }

    function escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                  .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    function renderCart() {
        cartContainer.innerHTML = '';
        if (!cart.length) {
            updateUIVisibility(); updateTotal(); saveCart(); return;
        }

        const fragment = document.createDocumentFragment();
        cart.forEach(item => {
            const wrapper = document.createElement('div');
            wrapper.className = 'cart-item';
            wrapper.innerHTML = `
                <div class="cart-left"><img src="${item.img || ''}" alt="${escapeHtml(item.name)}" /></div>
                <div class="content-cart-right">
                    <div class="product-name"><p>${escapeHtml(item.name)}</p></div>
                    <div class="product-quantity">
                        <div class="quantity">
                            <button type="button" class="minus">-</button>
                            <span class="qty">${Number(item.qty)}</span>
                            <button type="button" class="plus">+</button>
                        </div>
                    </div>
                    <div class="product-subtotal">
                        <span class="sub-price" data-price="${Number(item.price) || 0}">$${(Number(item.price)*Number(item.qty)).toFixed(2)}</span>
                    </div>
                    <div class="product-remove">
                        <a href="#" class="remove" aria-label="remove item">×</a>
                    </div>
                </div>
            `;
            fragment.appendChild(wrapper);
        });
        cartContainer.appendChild(fragment);
        updateUIVisibility(); updateTotal(); saveCart();
    }

    // Add to cart from product page
    if (AddtoCart.length) {
        AddtoCart.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productBox = e.target.closest('.item');
                if (!productBox) return;

                const nameEl = productBox.querySelector('.product-title a');
                const priceEl = productBox.querySelector('.price span:last-child');
                const imgEl = productBox.querySelector('.item-img img');

                const name = nameEl ? nameEl.textContent.trim() : 'Unnamed product';
                const priceText = priceEl ? priceEl.textContent.trim() : '$0';
                const price = parseFloat(priceText.replace(/[^0-9\.\-]+/g, '')) || 0;
                const img = imgEl ? imgEl.src : '';

                const existing = cart.find(i => i.name === name);
                if (existing) existing.qty += 1;
                else cart.push({ name, price, img, qty: 1 });

                window.renderCart();
            });
        });
    }

    // Delegation for + / - / remove
    cartContainer.addEventListener('click', (e) => {
        const target = e.target;
        const cartItemEl = target.closest('.cart-item');
        if (!cartItemEl) return;

        const name = cartItemEl.querySelector('.product-name p')?.textContent?.trim();
        if (!name) return;
        const index = cart.findIndex(i => i.name === name);
        if (index === -1) return;

        if (target.classList.contains('minus')) {
            if (cart[index].qty > 1) cart[index].qty -= 1;
            else cart.splice(index,1);
            renderCart(); return;
        }
        if (target.classList.contains('plus')) { cart[index].qty += 1; renderCart(); return; }
        if (target.classList.contains('remove')) { e.preventDefault(); cart.splice(index,1); renderCart(); return; }
    });

    window.renderCart = renderCart; // make it global
    renderCart();

    // Optional API
    window._miniCart = {
        getCart: () => JSON.parse(JSON.stringify(cart || [])),
        clearCart: () => { cart = []; renderCart(); },
        saveCartNow: () => saveCart()
    };
});
