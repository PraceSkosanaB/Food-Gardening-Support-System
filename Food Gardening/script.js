// Modern navbar scroll effect
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  function onScroll() {
    if (window.scrollY > 8) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll);
  onScroll();
});
// Simple client-side auth and navigation
(function () {
  const USERS_KEY = "fg_users_v1";
  const CURRENT_KEY = "fg_current_user";
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function saveUsers(u) {
    localStorage.setItem(USERS_KEY, JSON.stringify(u));
  }
  function setCurrent(username) {
    localStorage.setItem(CURRENT_KEY, username);
  }
  function getCurrent() {
    return localStorage.getItem(CURRENT_KEY);
  }
  function logout() {
    localStorage.removeItem(CURRENT_KEY);
  }
  const path = window.location.pathname.split("/").pop();

  // Login/Register page
  if (path === "" || path === "index.html") {
    const form = document.getElementById("login-form");
    const userEl = document.getElementById("username");
    const passEl = document.getElementById("password");
    const regBtn = document.getElementById("register-btn");
    const feedback = document.getElementById("login-feedback");
    function show(msg) {
      if (feedback) feedback.textContent = msg;
    }
    if (getCurrent()) location.href = "home.html";
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const u = userEl.value.trim();
      const p = passEl.value;
      const users = getUsers();
      if (!users[u]) {
        show("User not found — try Register.");
        return;
      }
      if (users[u] !== p) {
        show("Incorrect password.");
        return;
      }
      setCurrent(u);
      location.href = "home.html";
    });
    regBtn.addEventListener("click", function () {
      const u = userEl.value.trim();
      const p = passEl.value;
      if (!u || !p) {
        show("Please provide username and password.");
        return;
      }
      const users = getUsers();
      if (users[u]) {
        show("User already exists, choose a different username.");
        return;
      }
      users[u] = p;
      saveUsers(users);
      setCurrent(u);
      location.href = "home.html";
    });
    return;
  }

  // Home page
  if (path === "home.html") {
    if (!getCurrent()) {
      location.href = "index.html";
      return;
    }
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn)
      logoutBtn.addEventListener("click", function () {
        logout();
        location.href = "index.html";
      });
    return;
  }

  // Section pages: redirect to login if not authenticated
  const protectedPages = [
    "educational.html",
    "profitability.html",
    "area.html",
    "planting.html",
    "soil.html",
  ];
  if (protectedPages.includes(path)) {
    if (!getCurrent()) {
      location.href = "index.html";
      return;
    }
  }

  // --- Calculator logic ---
  // Profitability
  if (path === "profitability.html") {
    document.addEventListener("DOMContentLoaded", function () {
      const form = document.getElementById("profit-form");
      const result = document.getElementById("profit-result");
      if (form && result) {
        form.addEventListener("submit", function (ev) {
          ev.preventDefault();
          // Defensive: check if elements exist
          const yEl = document.getElementById("yield-amount");
          const pEl = document.getElementById("price");
          const cEl = document.getElementById("costs");
          if (!yEl || !pEl || !cEl) {
            result.textContent = "Calculator error: missing input field.";
            return;
          }
          const y = parseFloat(yEl.value);
          const p = parseFloat(pEl.value);
          const c = parseFloat(cEl.value);
          if (isNaN(y) || isNaN(p) || isNaN(c)) {
            result.textContent = "Please fill all fields with valid numbers.";
            return;
          }
          const revenue = y * p;
          const profit = revenue - c;
          result.innerHTML = `<b>Revenue:</b> R${revenue.toFixed(2)}<br><b>Profit:</b> R${profit.toFixed(2)}`;
        });
      } else if (result) {
        result.textContent = "Calculator error: form not found.";
      }
    });
  }
  // Area
  if (path === "area.html") {
    const form = document.getElementById("area-form");
    const result = document.getElementById("area-result");
    if (form && result) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        const n = parseInt(document.getElementById("num-plants").value, 10);
        const a = parseFloat(document.getElementById("area-per-plant").value);
        if (isNaN(n) || isNaN(a) || n < 1 || a <= 0) {
          result.textContent = "Please fill all fields.";
          return;
        }
        const total = n * a;
        result.innerHTML = `<b>Total Area Needed:</b> ${total.toFixed(2)} m²`;
      });
    }
  }
})();