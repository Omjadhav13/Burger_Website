// public/menu.js
document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".btn-warning");
  const viewCartBtn = document.getElementById("viewCartBtn");

  // Load current cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Handle Add to Cart click
  addToCartButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const card = e.target.closest(".card");
      const burgerName = card.querySelector(".card-title").textContent;

      // Check if quantity selector already exists
      if (card.querySelector(".quantity-control")) return;

      const qtyContainer = document.createElement("div");
      qtyContainer.classList.add("quantity-control", "mt-2");
      qtyContainer.innerHTML = `
        <div class="d-flex align-items-center justify-content-center gap-2">
          <button class="btn btn-sm btn-danger" id="minus">-</button>
          <span id="quantity" class="fw-bold fs-5">1</span>
          <button class="btn btn-sm btn-success" id="plus">+</button>
        </div>
      `;

      card.querySelector(".card-body").appendChild(qtyContainer);

      let quantity = 1;

      qtyContainer.querySelector("#plus").addEventListener("click", () => {
        quantity++;
        qtyContainer.querySelector("#quantity").textContent = quantity;
        updateCart(burgerName, quantity);
      });

      qtyContainer.querySelector("#minus").addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          qtyContainer.querySelector("#quantity").textContent = quantity;
          updateCart(burgerName, quantity);
        } else {
          // remove burger if quantity 0
          qtyContainer.remove();
          removeFromCart(burgerName);
        }
      });

      // Add first time
      updateCart(burgerName, quantity);
    });
  });

  // View cart button
  viewCartBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
  });

  // Helpers
  function updateCart(burgerName, quantity) {
    const index = cart.findIndex(item => item.burger === burgerName);
    if (index >= 0) {
      cart[index].quantity = quantity;
    } else {
      cart.push({ burger: burgerName, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function removeFromCart(burgerName) {
    cart = cart.filter(item => item.burger !== burgerName);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
});

// menu.js

const buttons = document.querySelectorAll('.btn-warning');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card');
    const burgerName = card.querySelector('.card-title').textContent;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add or increase quantity
    const existing = cart.find(item => item.burger === burgerName);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        burger: burgerName,
        quantity: 1,
        addons: [] // can add addons later in cart page
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${burgerName} added to cart!`);
  });
});

