document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cartContainer");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = `<h4>Your cart is empty!</h4>
      <a href="/" class="btn btn-warning mt-3">Back to Menu</a>`;
    return;
  }

  let html = "<h3>🛒 Your Cart</h3>";
  html += `<form id="cartForm">`;

  cart.forEach((item, index) => {
    html += `
      <div class="border-bottom pb-3 mb-3">
        <h5>${item.burger}</h5>
        <p>Quantity: ${item.quantity}</p>

        <h6>Add Extras:</h6>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" name="addons-${index}" value="cheese">
          <label class="form-check-label">Extra Cheese (+₹30)</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" name="addons-${index}" value="colddrink">
          <label class="form-check-label">Cold Drink (+₹50)</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" name="addons-${index}" value="fries">
          <label class="form-check-label">Fries (+₹40)</label>
        </div>
      </div>
    `;
  });

  html += `<button type="submit" class="btn btn-success mt-3">Get Bill</button>`;
  html += `</form><div id="billResult" class="mt-4"></div>`;
  cartContainer.innerHTML = html;

  // Handle form submit
  document.getElementById("cartForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const orders = cart.map((item, index) => {
      const addons = formData.getAll(`addons-${index}`);
      return {
        burger: item.burger,
        quantity: item.quantity || 1,
        addons
      };
    });

    // Send to server
    const response = await fetch("/calculate-bill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orders })
    });

    const data = await response.json();
    document.getElementById("billResult").innerHTML =
      `<h4>Total Bill: ₹${data.total}</h4>
       <a href="/" class="btn btn-secondary mt-3">Back to Menu</a>`;
  });
});
