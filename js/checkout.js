
document.addEventListener('DOMContentLoaded', () => {
  // ✅ حماية: لو الصفحة مفيهاش mini-cart، نوقف التنفيذ
  if (!document.querySelector('.mini-cart')) return;

  // ---------- Helpers: Save / Load ----------
  function saveCart() {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (err) {
      console.warn('cart.js: Failed to save cart to localStorage', err);
    }
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem('cart');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (err) {
      console.warn('cart.js: Failed to parse cart from localStorage', err);
      return [];
    }
  }

  // ---------- DOM nodes (بحماية من null) ----------
  const AddtoCart = document.querySelectorAll('.item .Add_to_cart'); 
  const emptyMessage = document.querySelector('.shopping_cart_content .empty'); 
  const topTotalCart = document.querySelector('.top-total-cart');
  const cartContainer = document.querySelector('.cart-items');
  const totalCartBox = document.querySelector('.total-cart');
  const totalValue = document.querySelector('.totalValue');
  const cartCountDisplay = document.querySelector('.cart-count');
  const freeShipBox = document.querySelector('.free-ship');
  const buttonsBox = document.querySelector('.buttons');

  if (!cartContainer || !topTotalCart || !totalValue) {
    console.warn('cart.js: Required DOM nodes missing. Initialization aborted.');
    return;
  }

  let cart = loadCart();

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

    // تحديث عداد النص في الأعلى والعداد الصغير
    topTotalCart.textContent = `Cart(${cart.length})`;
    if (cartCountDisplay) cartCountDisplay.textContent = `(${cart.length})`;
  }

  // ---------- Utility: حساب وتحديث المجموع ----------
  function updateTotal() {
    let total = 0;
    cart.forEach(item => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      total += price * qty;
    });

    totalValue.textContent = total.toFixed(2);

    try {
      const threshold = 300;
      if (freeShipBox) {
        const remaining = Math.max(0, threshold - total);
        const remainingEl = freeShipBox.querySelector('.remaining-amount');
        if (remainingEl) remainingEl.textContent = `$${remaining.toFixed(2)}`;

        const percentEl = document.getElementById('progressBar');
        if (percentEl) {
          const percent = threshold === 0 ? 100 : Math.min(100, (total / threshold) * 100);
          percentEl.style.width = `${percent}%`;
        }
      }
    } catch (err) {
      // silent
    }
  }

  // ---------- Render: إعادة بناء DOM لعناصر الكارت ----------
  function renderCart() {
    cartContainer.innerHTML = '';

    if (!cart.length) {
      updateUIVisibility();
      updateTotal();
      saveCart();
      return;
    }

    const fragment = document.createDocumentFragment();

    cart.forEach(item => {
      const wrapper = document.createElement('div');
      wrapper.className = 'cart-item';

      wrapper.innerHTML = `
        <div class="cart-left">
          <img src="${item.img || ''}" alt="${escapeHtml(item.name)}" />
        </div>
        <div class="content-cart-right">
          <div class="product-name">
            <p>${escapeHtml(item.name)}</p>
          </div>

          <div class="product-quantity">
            <div class="quantity">
              <button type="button" class="minus">-</button>
              <span class="qty">${Number(item.qty)}</span>
              <button type="button" class="plus">+</button>
            </div>
          </div>

          <div class="product-subtotal">
            <span class="sub-price" data-price="${Number(item.price) || 0}">$${(Number(item.price) * Number(item.qty)).toFixed(2)}</span>
          </div>

          <div class="product-remove">
            <a href="#" class="remove" aria-label="remove item">×</a>
          </div>
        </div>
      `;

      fragment.appendChild(wrapper);
    });

    cartContainer.appendChild(fragment);

    updateUIVisibility();
    updateTotal();
    saveCart();
  }

  // Helper لتفادي XSS
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ---------- Events: زر إضافة إلى السلة ----------
  if (AddtoCart && AddtoCart.length) {
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
        if (existing) {
          existing.qty = Number(existing.qty) + 1;
        } else {
          cart.push({ name, price, img, qty: 1 });
        }

        renderCart();
      });
    });
  }

  // ---------- Events: Delegation +/- / remove ----------
  cartContainer.addEventListener('click', (e) => {
    const target = e.target;
    const cartItemEl = target.closest('.cart-item');
    if (!cartItemEl) return;

    const name = cartItemEl.querySelector('.product-name p')?.textContent?.trim();
    if (!name) return;

    const productIndex = cart.findIndex(i => i.name === name);
    if (productIndex === -1) return;

    if (target.classList.contains('minus')) {
      if (cart[productIndex].qty > 1) {
        cart[productIndex].qty -= 1;
      } else {
        cart.splice(productIndex, 1);
      }
      renderCart();
      return;
    }

    if (target.classList.contains('plus')) {
      cart[productIndex].qty += 1;
      renderCart();
      return;
    }

    if (target.classList.contains('remove')) {
      e.preventDefault();
      cart.splice(productIndex, 1);
      renderCart();
      return;
    }
  });

  // ---------- Init styles ----------
  try {
    if (cartContainer) {
      if (!cartContainer.style.maxHeight) cartContainer.style.maxHeight = '500px';
      if (!cartContainer.style.overflowY) cartContainer.style.overflowY = 'auto';
    }
  } catch (err) {}

  // ---------- Build initial UI ----------
  renderCart();

  // ---------- Optional API ----------
  window._miniCart = {
    getCart: () => JSON.parse(JSON.stringify(cart || [])),
    clearCart: () => { cart = []; renderCart(); },
    saveCartNow: () => saveCart()
  };
}); // DOMContentLoaded end
// document.addEventListener("DOMContentLoaded", () => {
//   const cart = JSON.parse(localStorage.getItem("cart")) || [];

//   const itemsBox = document.querySelector(".order-items");
//   const subtotalEl = document.querySelector(".subtotal");
//   const totalEl = document.querySelector(".total-price");

  
//   if (!itemsBox) return;

//   let total = 0;

//   if (cart.length === 0) {
//     itemsBox.innerHTML = "<p>Your cart is empty</p>";
//     return;
//   }

//   cart.forEach(item => {
//     const subtotal = item.price * item.qty;
//     total += subtotal;

//     itemsBox.innerHTML += `
//       <div class="order-item">
//         <div class="item-info">
//           <img src="${item.img}" width="50">
//           <span>${item.name} × ${item.qty}</span>
//         </div>
//         <strong>$${subtotal.toFixed(2)}</strong>
//       </div>
//     `;
//   });

//   subtotalEl.textContent = `$${total.toFixed(2)}`;
//   totalEl.textContent = `$${total.toFixed(2)}`;
// });
document.addEventListener("DOMContentLoaded", () => {
  const woocommerce = document.querySelector(".woocommerce");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const list = document.querySelector(".woocommerce ul");

  const itemsBox = document.querySelector(".order-items");
  const subtotalEl = document.querySelector(".subtotal");
  const totalEl = document.querySelector(".total-price");
  const returnToShop = document.querySelector(".return-to-shop");

  if (!itemsBox || !subtotalEl || !totalEl) return;

  // 🛒 لو السلة فاضية
  if (cart.length === 0) {
    if (returnToShop) returnToShop.style.display = "block";
     list.style.display = "none";
     woocommerce.querySelector(".woocommerce-cart-page").style.display = "none";
    woocommerce.querySelector(".empty_message").style.display = "block";
    subtotalEl.textContent = "$0.00";
    totalEl.textContent = "$0.00";
    return;
  }

  // 🛒 السلة فيها منتجات
  if (returnToShop) returnToShop.style.display = "none";
  list.style.display = "block";
    woocommerce.querySelector(".woocommerce-cart-page").style.display = "flex";
     woocommerce.querySelector(".empty_message").style.display = "none";
  let total = 0;
  itemsBox.innerHTML = "";

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    itemsBox.innerHTML += `
      <div class="order-item">
        <div class="item-info">
          <img src="${item.img}" width="50" alt="">
          <span>${item.name} × ${item.qty}</span>
        </div>
        <strong>$${subtotal.toFixed(2)}</strong>
      </div>
    `;
  });

  subtotalEl.textContent = `$${total.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
});
const searchbtn = document.querySelector('.search-toggle i');
const search_overlay= document.querySelector('.search-overlay')
const close_search = document.querySelector('.close-search i')
// open&close  search-overly
searchbtn.addEventListener('click',()=>{
    search_overlay.style.opacity='1';
    search_overlay.style.visibility='visible'
})

close_search.addEventListener('click',()=>{
    search_overlay.style.opacity='0';
    search_overlay.style.visibility='hidden'
})
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
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-category .menu-lines");
  const menu = document.querySelector(".main-category-menu");
  const closeBtn = document.querySelector(".close-menu");
  const overlay = document.createElement("div");

  // إنشاء خلفية غامقة (Overlay)
  overlay.classList.add("menu-overlay");
  document.body.appendChild(overlay);

  // فتح القائمة
  menuBtn.addEventListener("click", () => {
    menu.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // يمنع التمرير وقت فتح المنيو
  });

  const closeMenu = () => {
    menu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
  };

  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
});