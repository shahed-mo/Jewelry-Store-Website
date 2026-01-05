const searchbtn = document.querySelector('.search-toggle i');
const search_overlay= document.querySelector('.search-overlay')
const close_search = document.querySelector('.close-search i')
const next = document.querySelector('.right i');
const prev = document.querySelector('.left i');
const back_img = document.querySelector('.bwp-title')
const content = document.querySelector('.main-content h1')
const contentSpan = document.querySelector('.arrows span')
const colorOptions  = document.querySelectorAll('.product-attribute .color');


let count=0;


// open&close  search-overly
searchbtn.addEventListener('click',()=>{
    search_overlay.style.opacity='1';
    search_overlay.style.visibility='visible'
})

close_search.addEventListener('click',()=>{
    search_overlay.style.opacity='0';
    search_overlay.style.visibility='hidden'
})


//first slider
let imgslid=[
{
    imgSrc:'../images/g1.jpg',
    title:'Diverse Design'
},    
{
    imgSrc:'../images/g2.jpg',
    title:'luxury jewelry'
},
{
    imgSrc:'../images/g3.jpg',
    title:'fashion jewelry'
},

]

function showSlide(index){
    back_img.style.backgroundImage =`url(${imgslid[index].imgSrc})`
    content.textContent=imgslid[index].title
    contentSpan.textContent = (index + 1).toString().padStart(2, '0');
}


next.addEventListener('click',()=>{
    count++;
    if(count>=imgslid.length) {
        count=0;
    }
    showSlide(count)
})

prev.addEventListener('click',()=>{
    count--;
    if(count<0) {
        count=imgslid.length-1;
    }
    showSlide(count)
})

setInterval(()=>{
    count++;
    if (count >= imgslid.length) count = 0;
  showSlide(count);
},7000)
showSlide(count)


  // home.js — robust products slider + tab switch
document.addEventListener('DOMContentLoaded', () => {
  const right = document.querySelector('.products .right');
  const left = document.querySelector('.products .left');
  const tabs = document.querySelectorAll('.order-by li');
  const containers = document.querySelectorAll('.slider-container');

  if (!right || !left) {
    console.warn('arrows (.right or .left) not found');
    return;
  }

  // show first container by default if none visible
  if (!Array.from(containers).some(c => window.getComputedStyle(c).display !== 'none')) {
    containers.forEach((c, i) => c.style.display = (i === 0 ? 'block' : 'none'));
  }

  function getVisibleContainer() {
    return Array.from(containers).find(c => {
      const cs = window.getComputedStyle(c);
      return cs.display !== 'none' && cs.visibility !== 'hidden' && c.offsetWidth > 0 && c.offsetHeight > 0;
    }) || null;
  }

  function getVisibleSlider() {
    const cont = getVisibleContainer();
    return cont ? cont.querySelector('.slider') : null;
  }

  function getItemFullWidth(slider) {
    const item = slider && slider.querySelector('.item');
    if (!item) return 0;
    const rect = item.getBoundingClientRect();
    const st = window.getComputedStyle(item);
    const ml = parseFloat(st.marginLeft) || 0;
    const mr = parseFloat(st.marginRight) || 0;
    return Math.round(rect.width + ml + mr);
  }

  function getPos(slider) {
    return Number(slider.dataset.position) || 0;
  }

  function setPos(slider, pos) {
    slider.dataset.position = String(pos);
    slider.style.transition = slider.style.transition || 'transform 320ms ease';
    slider.style.transform = `translateX(${pos}px)`;
  }

  // ➤ arrows navigation
  right.addEventListener('click', () => {
    const slider = getVisibleSlider();
    if (!slider) return;
    const itemW = getItemFullWidth(slider);
    if (!itemW) return;
    let pos = getPos(slider);
    const maxMove = Math.max(0, slider.scrollWidth - slider.clientWidth);
    if (Math.abs(pos) < maxMove - 1) {
      pos -= itemW;
      if (Math.abs(pos) > maxMove) pos = -maxMove;
      setPos(slider, pos);
    }
  });

  left.addEventListener('click', () => {
    const slider = getVisibleSlider();
    if (!slider) return;
    const itemW = getItemFullWidth(slider);
    if (!itemW) return;
    let pos = getPos(slider);
    if (pos < 0) {
      pos += itemW;
      if (pos > 0) pos = 0;
      setPos(slider, pos);
    }
  });

  // ➤ tab switching + active color (brown)
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // إزالة اللون من كل العناصر
      tabs.forEach(t => t.classList.remove('active-tab'));

      // تفعيل اللون للبند المختار
      tab.classList.add('active-tab');

      // عرض الكونتينر المطلوب وإخفاء الباقي
      const value = tab.getAttribute('data-value');
      containers.forEach(c => {
        if (c.classList.contains(value)) {
          c.style.display = 'block';
        } else {
          c.style.display = 'none';
        }
      });
    });
  });
});


//goldbtn &silver btn
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item');

  items.forEach(item => {
    const buttons = item.querySelectorAll('[data-title]');
    const imgs = item.querySelectorAll('.item-img img');

    if (!imgs.length || !buttons.length) return;

    const originalSrcs = Array.from(imgs).map(img => img.src);

    buttons.forEach((btn, btnIndex) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        buttons.forEach(b => b.classList.remove('active-color'));
        btn.classList.add('active-color');

        const srcFromBtn = btn.dataset.src;
        const mainSrc = srcFromBtn || originalSrcs[btnIndex] || originalSrcs[0];
        imgs[0].src = mainSrc;
        if (imgs[1]) {
          const altSrc = originalSrcs.find(s => s !== mainSrc) || originalSrcs[0];
          imgs[1].src = altSrc;
        }
      });
    });
  });
});

// home.js — robust holiday_gift slider

document.addEventListener('DOMContentLoaded', () => {
  const sliderContainer = document.querySelector('.holiday_gift .slider-container.rating');
  const slider = sliderContainer?.querySelector('.slider');
  const right = document.querySelector('.holiday_gift .right');
  const left = document.querySelector('.holiday_gift .left');

  if (!slider || !right || !left) {
    console.warn('Slider or arrows not found');
    return;
  }

  let pos = 0;

  function getItemFullWidth() {
    const item = slider.querySelector('.item');
    if (!item) return 0;
    const style = window.getComputedStyle(item);
    const margin = parseFloat(style.marginRight) || 0;
    return item.offsetWidth + margin;
  }

  function setPos(newPos) {
    pos = newPos;
    slider.style.transition = 'transform 0.3s ease';
    slider.style.transform = `translateX(${pos}px)`;
  }

  right.addEventListener('click', () => {
    const itemWidth = getItemFullWidth();
    const maxMove = slider.scrollWidth - slider.clientWidth;
    if (Math.abs(pos) < maxMove - 1) {
      const newPos = Math.max(pos - itemWidth, -maxMove);
      setPos(newPos);
    }
  });


  left.addEventListener('click', () => {
    const itemWidth = getItemFullWidth();
    if (pos < 0) {
      const newPos = Math.min(pos + itemWidth, 0);
      setPos(newPos);
    }
  });

  function checkArrows() {
    if (slider.scrollWidth <= slider.clientWidth + 5) {
      right.style.display = 'none';
      left.style.display = 'none';
    } else {
      right.style.display = 'flex';
      left.style.display = 'flex';
    }
  }

  checkArrows();
  window.addEventListener('resize', checkArrows);
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



// Add_to_cart
/**
 * cart.js
 * - LocalStorage persistence
 * - Build cart on load
 * - Add / remove / qty +/- handling
 * - Defensive checks to avoid `null` errors
 */

document.addEventListener('DOMContentLoaded', () => {
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
      // احسب رقمياً بدقة
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      total += price * qty;
    });

    // عرض المجموع
    totalValue.textContent = total.toFixed(2);

    // لو في تقدم للشحن المجاني (لو عنصر موجود) — نحدث العرض إن وُجد
    try {
      // مثال: threshold ثابت — عدله لو تحب
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
      // لا نريد أن يكسر الثانويات التطبيق
    }
  }

  // ---------- Render: إعادة بناء DOM لعناصر الكارت ----------
  function renderCart() {
    // نعيد بناء الـ innerHTML بأمان
    cartContainer.innerHTML = '';

    if (!cart.length) {
      updateUIVisibility();
      updateTotal();
      saveCart();
      return;
    }

    // لكل عنصر نصيّاً نقوم ببناء ال HTML
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

  // Helper لتفادي XSS بسيطة عند إدراج نصوص المستخدم
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

        // قراءة البيانات بحماية
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

  // ---------- Events: Delegation لعمليات +/- و remove داخل cartContainer ----------
  cartContainer.addEventListener('click', (e) => {
    const target = e.target;
    const cartItemEl = target.closest('.cart-item');
    if (!cartItemEl) return;

    const name = cartItemEl.querySelector('.product-name p')?.textContent?.trim();
    if (!name) return;

    const productIndex = cart.findIndex(i => i.name === name);
    if (productIndex === -1) return;

    // minus
    if (target.classList.contains('minus')) {
      if (cart[productIndex].qty > 1) {
        cart[productIndex].qty = Number(cart[productIndex].qty) - 1;
      } else {
        // إذا كانت الكمية 1 والضغط على minus => إزاله العنصر
        cart.splice(productIndex, 1);
      }
      renderCart();
      return;
    }

    // plus
    if (target.classList.contains('plus')) {
      cart[productIndex].qty = Number(cart[productIndex].qty) + 1;
      renderCart();
      return;
    }

    // remove (رابط الحذف)
    if (target.classList.contains('remove')) {
      e.preventDefault();
      cart.splice(productIndex, 1);
      renderCart();
      return;
    }
  });

  // ---------- Init: ضبط الستايل الافتراضي لمناطق الواجهة إذا كانت موجودة ----------
  try {
    // اجعل منطقة المنتجات scroll محددة إذا لم تكن CSS فعلت ذلك
    if (cartContainer) {
      // يفضل أن تضبط maxHeight و overflow عبر CSS، لكن هذا fallback آمن:
      if (!cartContainer.style.maxHeight) cartContainer.style.maxHeight = '500px';
      if (!cartContainer.style.overflowY) cartContainer.style.overflowY = 'auto';
    }
  } catch (err) {
    // silent
  }

  // ---------- Build initial UI from saved cart ----------
  renderCart();

  // ---------- Optional: expose a small API على window لو احتجت تستعمله من Console ----------
  window._miniCart = {
    getCart: () => JSON.parse(JSON.stringify(cart || [])),
    clearCart: () => { cart = []; renderCart(); },
    saveCartNow: () => saveCart()
  };

}); // DOMContentLoaded end




document.addEventListener('DOMContentLoaded', () => {
    const HeartBtns = document.querySelectorAll('.item .wishlist');
    

    HeartBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const Product = e.target.closest(".item");
            if (!Product) return;

            const nameP = Product.querySelector('.product-title a');
            const PriceP = Product.querySelector('.price span:last-child');
            const imgP = Product.querySelector('.item-img img');

            const ProductData = {
                name: nameP.textContent,
                Price: PriceP.textContent,
                img: imgP.src
            };

            // استرجاع wishlist موجودة من localStorage
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

            // لو موجودة بالفعل → شيلها، لو مش موجودة → اضفها
            const existing = wishlist.find(item => item.name === ProductData.name);
            if (!existing) {
                wishlist.push(ProductData);
            }

            // خزنيها في localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            // ممكن تضيفي alert أو تغير لون القلب
            alert(`${ProductData.name} added to wishlist!`);
        });
    });
});
