const API_URL =
  "https://sivan-backend-demo-production.up.railway.app/api/orders/"; // change if needed

// Fetch Orders
async function fetchOrders() {
  try {
    const res = await fetch(API_URL);
    let orders = await res.json();

    // 🔥 SORT BY DATE (LATEST FIRST)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    renderTable(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
}

// Render Table
function renderTable(orders) {
  const tbody = document.querySelector("#ordersTable tbody");
  tbody.innerHTML = "";

  orders.forEach((order) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.email}</td>
      <td>${order.phone}</td>
      <td>₹${order.totalAmount}</td>
      <td>${order.paymentMethod}</td>
      <td>${formatDate(order.createdAt)}</td>
      <td>
        <button class="view-btn" onclick='showDetails(${JSON.stringify(
          order
        )})'>
          View
        </button>
        <button class="whatsapp-btn" onclick="sendWhatsApp('${order.phone}')">
          WhatsApp
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// Format Date
function formatDate(date) {
  return new Date(date).toLocaleString();
}

// Show Modal
function showDetails(order) {
  const modal = document.getElementById("modal");
  const detailsDiv = document.getElementById("orderDetails");

  let itemsHtml = "";

  order.items.forEach((item) => {
    itemsHtml += `
        <li>
          ${item.name} - ₹${item.price} x ${item.quantity}
        </li>
      `;
  });

  detailsDiv.innerHTML = `
      <h3>Order #${order.id}</h3>
      <p><b>Email:</b> ${order.email}</p>
      <p><b>Phone:</b> ${order.phone}</p>
      <p><b>Address:</b> ${order.address}, ${order.state}, ${order.pincode}</p>
      <p><b>Total:</b> ₹${order.totalAmount}</p>
      <p><b>Payment:</b> ${order.paymentMethod}</p>
      <hr/>
      <h4>Items:</h4>
      <ul>${itemsHtml}</ul>
    `;

  modal.style.display = "flex"; // 🔥 IMPORTANT
}
// Close Modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}
window.onclick = function (e) {
  const modal = document.getElementById("modal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

// WhatsApp Redirect
function sendWhatsApp(phone) {
  const message = encodeURIComponent("Hello! Regarding your order...");
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}

// Load on start
fetchOrders();
