// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
app.use(express.json()); // built-in body parser
app.use(express.static(path.join(__dirname, 'public')));

const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Burger and Addon prices
const burgerPrices = {
  'Classic Burger': 150,
  'Spicy Burger': 170,
  'Veggie Burger': 130,
  'Cheese Deluxe': 180
};
const addonPrices = {
  cheese: 30,
  colddrink: 50,
  fries: 40
};

// Helper to read orders from JSON file
function getOrders() {
  if (!fs.existsSync(ORDERS_FILE)) return [];
  const data = fs.readFileSync(ORDERS_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

// Helper to save an order to JSON file
function saveOrder(order) {
  const orders = getOrders();
  orders.push(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

// Calculate bill endpoint
app.post('/calculate-bill', (req, res) => {
  console.log("Received request body:", req.body);

  try {
    const { orders } = req.body;
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ error: 'Invalid orders format' });
    }

    let total = 0;
    orders.forEach(order => {
      const base = burgerPrices[order.burger] || 0;
      const addonsCost = (order.addons || []).reduce((sum, a) => sum + (addonPrices[a] || 0), 0);
      const qty = order.quantity || 1;
      total += (base + addonsCost) * qty;
    });

    res.json({ total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not calculate bill' });
  }
});

// Place order endpoint
app.post('/place-order', (req, res) => {
  const { customerName, contact, orders } = req.body;

  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ error: 'Invalid order format' });
  }

  const total = orders.reduce((sum, o) => {
    const base = burgerPrices[o.burger] || 0;
    const addonsCost = (o.addons || []).reduce((s, a) => s + (addonPrices[a] || 0), 0);
    return sum + (base + addonsCost) * (o.quantity || 1);
  }, 0);

  const order = {
    id: Date.now(),
    time: new Date().toISOString(),
    customerName: customerName || 'Guest',
    contact: contact || null,
    orders,
    total
  };

  saveOrder(order);

  res.json({ success: true, message: 'Order received!', order });
});

// Get all orders endpoint
app.get('/orders', (req, res) => {
  const orders = getOrders();
  res.json(orders);
});

// Utility: get local IP for LAN access
function getLocalIp() {
  const ifaces = os.networkInterfaces();
  for (let name in ifaces) {
    for (let iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Start server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Burger Shop server running!');
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Network: http://${getLocalIp()}:${PORT}`);
});
