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


document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartPageContainer = document.querySelector(".cart-table-body");
  const woocommerce = document.querySelector(".woocommerce");
  const table = document.querySelector(".cart-table");
  const list = document.querySelector(".woocommerce ul");

  console.log("Loaded ✅", cartPageContainer, cart);

  if (!cartPageContainer) {
    console.error("❌ عنصر cart-table-body مش موجود في الصفحة!");
    return;
  }

  // ===== حفظ السلة =====
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ===== عرض السلة =====
  function renderCartPage() {
    cartPageContainer.innerHTML = "";

    // ✅ لو السلة فاضية
    if (cart.length === 0) {
      woocommerce.querySelector(".wc-empty-cart-message").style.display = "block";
      woocommerce.querySelector(".return-to-shop").style.display = "block";

      if (table) {
        table.style.display = "none";
        list.style.display = "none";
      }

      // ✅ اخفاء الإجمالي كمان لو السلة فاضية
      const totalsContainer = document.querySelector(".cart_totals");
      if (totalsContainer) totalsContainer.innerHTML = "";
      return;
    } else {
      woocommerce.querySelector(".wc-empty-cart-message").style.display = "none";
      woocommerce.querySelector(".return-to-shop").style.display = "none";
      if (table) {
        table.style.display = "table";
        list.style.display = "block";
      }
    }

    // ✅ إنشاء صفوف المنتجات
    cart.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="product-thumbnail">
          <a><img src="${item.img}" width="70"/></a>
          <div class="product-name"><a>${item.name}</a></div>
        </td>

        <td class="product-price">
          <span class="woocommerce-Price-amount amount">
            <bdi>
              <span class="woocommerce-Price-currencySymbol">$</span>${item.price.toFixed(2)}
            </bdi>
          </span>
        </td>

        <td class="product-quantity">
          <div class="quantity">
            <button type="button" class="minus" data-index="${index}">-</button>
            <input type="number" class="input-text qty text" value="${item.qty}" min="1" readonly>
            <button type="button" class="plus" data-index="${index}">+</button>
          </div>
        </td>

        <td class="product-subtotal" data-title="Subtotal">
          <span class="woocommerce-Price-amount amount">
            <bdi>
              <span class="woocommerce-Price-currencySymbol">$</span>${(item.price * item.qty).toFixed(2)}
            </bdi>
          </span>
        </td>

        <td class="product-remove">
          <a class="remove" aria-label="Remove this item" data-index="${index}">×</a>
        </td>
      `;
      cartPageContainer.appendChild(tr);
    });

    // ====== إنشاء صف الأزرار (footer داخل tbody) ======
    const trFooter = document.createElement("tr");
    trFooter.classList.add("cart-footer-row");
    trFooter.innerHTML = `
      <td colspan="5" class="cart-actions" style="text-align:center; padding: 20px;">
        <h2 class="clear-cart" style="margin-right:10px;">🗑 Clear Cart</h2>
        <h2><a href="#" style="margin-right:15px;">Continue Shopping</a></h2>
      </td>
    `;
    cartPageContainer.appendChild(trFooter);

    // ====== ربط الأحداث ======
    trFooter.querySelector(".clear-cart").addEventListener("click", () => {
      cart = [];
      saveCart();
      renderCartPage(); // ✅ هيخفي الجدول تلقائيًا
    });

    attachQtyHandlers();

    // ✅ حساب الإجمالي + عرض قسم Cart Totals
    renderCartTotals();
  }

  // ====== التعامل مع أزرار + و - و × ======
  function attachQtyHandlers() {
    const plusButtons = document.querySelectorAll(".plus");
    const minusButtons = document.querySelectorAll(".minus");
    const removeButtons = document.querySelectorAll(".remove");

    plusButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart[index].qty++;
        saveCart();
        renderCartPage();
      });
    });

    minusButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        if (cart[index].qty > 1) {
          cart[index].qty--;
        } else {
          cart.splice(index, 1);
        }
        saveCart();
        renderCartPage();
      });
    });

    removeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart.splice(index, 1);
        saveCart();
        renderCartPage();
      });
    });
  }

  // ===== حساب الإجمالي + الشحن =====
  function renderCartTotals() {
    const totalsContainer = document.querySelector(".cart_totals");
    if (!totalsContainer) return;

    // لو السلة فاضية اخفي الإجمالي
    if (cart.length === 0) {
      totalsContainer.innerHTML = "";
      return;
    }

    // حساب الإجمالي
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = 0.0; // 👈 هنا قيمة الشحن (ممكن تعدليها)
    const total = subtotal + shipping;

    // HTML الخاص بـ Cart Totals
    totalsContainer.innerHTML = `
      <div class="cart-totals-box">
        <h2>Cart totals</h2>
        <div class="cart-subtotal">
			<div class="title">Subtotal</div>
			<div data-title="Subtotal">
            <span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>${subtotal.toFixed(2)}</bdi></span></div>
		</div>
        <div class="woocommerce-shipping-totals shipping">
        <h2>Shipping</h2>
        <div data-title="Shipping">
       <ul id="shipping_method" class="woocommerce-shipping-methods">
              <li>
                <input type="hidden" checked class="shipping_method" id="shipping_method_0_flat_rate2">
                <label for="shipping_method_0_flat_rate2">Flat rate</label>
              </li>
            </ul>
        <p class="woocommerce-shipping-destination">Shipping to <strong>Egypt</strong>.</p>
        <form class="woocommerce-shipping-calculator">
        <a href="#" class="shipping-calculator-button" role="button">Change address</a>
        </form>
        </div>
        </div>
        <div class="order-total">
			<div class="title">Total</div>
			<div data-title="Total"><strong><span class="woocommerce-Price-amount amount">
            <bdi><span class="woocommerce-Price-currencySymbol">$</span>${total.toFixed(2)}</bdi></span></strong> </div>
		</div>
        <div class="wc-proceed-to-checkout">
        <a href="#" class="checkout-button button alt wc-forward">Proceed to checkout</a>
        </div>
      </div>
    `;

    // ✅ عند الضغط على الزر يروح لصفحة الدفع
    totalsContainer.querySelector(".checkout-button").addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }

  // ===== أول تحميل للصفحة =====
  renderCartPage();
});

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


// Add_to_cart
/**
 * cart.js
 * - LocalStorage persistence
 * - Build cart on load
 * - Add / remove / qty +/- handling
 * - Defensive checks to avoid `null` errors
 */

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
