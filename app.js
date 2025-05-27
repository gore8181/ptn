(() => {
  // --- Constants ---
  const GAMES = ["dice", "plinko", "crash", "mines", "wallet", "leaderboard", "history"];
  const CRYPTOCURRENCIES = ["BTC", "ETH", "USDT"];
  const STORAGE_KEY = "stakeclone_users";
  const SESSION_KEY = "stakeclone_session";
  const BET_HISTORY_KEY = "stakeclone_bethistory";
  const LEADERBOARD_SIZE = 8;

  // --- State ---
  let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  let session = JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
  let betHistory = JSON.parse(localStorage.getItem(BET_HISTORY_KEY)) || [];
  let leaderboard = []; // simulated leaderboard data

  // Current page state
  let currentPage = "dice";

  // --- Helpers ---
  function saveUsers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  function saveSession() {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  }

  function saveBetHistory() {
    localStorage.setItem(BET_HISTORY_KEY, JSON.stringify(betHistory));
  }

  function createElement(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const key in attrs) {
      if (key.startsWith("on") && typeof attrs[key] === "function") {
        el.addEventListener(key.substring(2), attrs[key]);
      } else if (key === "html") {
        el.innerHTML = attrs[key];
      } else if (key === "className") {
        el.className = attrs[key];
      } else {
        el.setAttribute(key, attrs[key]);
      }
    }
    for (const child of children) {
      if (child) {
        if (typeof child === "string") {
          el.appendChild(document.createTextNode(child));
        } else {
          el.appendChild(child);
        }
      }
    }
    return el;
  }

  // Format number to 4 decimals, trim trailing zeros
  function formatNumber(num) {
    return Number.parseFloat(num).toFixed(4).replace(/\.?0+$/, "");
  }

  // Random int in range [min, max]
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Random float in range [min, max]
  function randFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Generate fake leaderboard data (simulate top players with random balances)
  function generateLeaderboard() {
    leaderboard = [];
    for (let i = 1; i <= LEADERBOARD_SIZE; i++) {
      leaderboard.push({
        username: "User" + (1000 + i),
        balance: {
          BTC: randFloat(0.01, 0.2),
          ETH: randFloat(0.1, 2),
          USDT: randFloat(50, 1000),
        },
        rank: i,
      });
    }
  }

  // Add bet record to history (max 30 entries)
  function addBetRecord(record) {
    betHistory.unshift(record);
    if (betHistory.length > 30) betHistory.pop();
    saveBetHistory();
  }

  // --- Auth ---
  const authModal = document.getElementById("auth-modal");
  const authTitle = document.getElementById("auth-title");
  const authForm = document.getElementById("auth-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const authSubmitBtn = document.getElementById("auth-submit");
  const authSwitchP = document.getElementById("auth-switch");
  const authSwitchLink = document.getElementById("switch-to-register");
  const authError = document.getElementById("auth-error");
  const logoutBtn = document.getElementById("logout-btn");
  const navButtons = document.querySelectorAll(".nav-btn");

  let authMode = "login"; // or "register"

  function showAuthModal() {
    authError.textContent = "";
    authForm.reset();
    authModal.style.display = "flex";
    usernameInput.focus();
    authMode = "login";
    authTitle.textContent = "Login";
    authSubmitBtn.textContent = "Login";
    authSwitchP.innerHTML = `Don't have an account? <a href="#" id="switch-to-register">Register</a>`;
  }

  function switchAuthMode() {
    authMode = authMode === "login" ? "register" : "login";
    authTitle.textContent = authMode === "login" ? "Login" : "Register";
    authSubmitBtn.textContent = authMode === "login" ? "Login" : "Register";
    authError.textContent = "";
    authForm.reset();
    authSwitchP.innerHTML = authMode === "login"
      ? `Don't have an account? <a href="#" id="switch-to-register">Register</a>`
      : `Already have an account? <a href="#" id="switch-to-register">Login</a>`;
    document.getElementById("switch-to-register").addEventListener("click", e => {
      e.preventDefault();
      switchAuthMode();
    });
  }

  authSwitchLink.addEventListener("click", e => {
    e.preventDefault();
    switchAuthMode();
  });

  authForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!username || !password) {
      authError.textContent = "Please fill all fields.";
      return;
    }

    if (authMode === "login") {
      if (!users[username]) {
        authError.textContent = "User not found.";
        return;
      }
      if (users[username].password !== password) {
        authError.textContent = "Incorrect password.";
        return;
      }
      session = { username };
      saveSession();
      authModal.style.display = "none";
      initAfterLogin();
    } else {
      // Register
      if (users[username]) {
        authError.textContent = "Username already taken.";
        return;
      }
      // Create new user with default wallet balances
      users[username] = {
        password,
        wallet: {
          BTC: 0.05,
          ETH: 0.5,
          USDT: 100,
        },
      };
      saveUsers();
      session = { username };
      saveSession();
      authModal.style.display = "none";
      init
