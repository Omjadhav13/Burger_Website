document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".btn-warning");
  const viewCartBtn = document.getElementById("viewCartBtn");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  addToCartButtons.forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();
      const card = e.target.closest(".card");
      const burgerName = card.querySelector(".card-title").textContent;

      const existing = cart.find(item => item.burger === burgerName);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ burger: burgerName, quantity: 1, addons: [] });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${burgerName} added to cart!`);
    });
  });

  viewCartBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
});
