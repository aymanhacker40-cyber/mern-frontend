const form = document.getElementById("loginForm");
const messageBox = document.getElementById("loginMessage");
const submitBtn = form.querySelector("button");

function showMessage(text, type = "error") {
  messageBox.textContent = text;
  messageBox.className = `login-message ${type}`;
  messageBox.style.display = "block";
}

// ⏱️ fetch مع timeout
function fetchWithTimeout(url, options, timeout = 10000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Server timeout, try again")), timeout)
    )
  ]);
}

// 📡 request login
async function loginRequest(email, password) {
  return await fetchWithTimeout(
    "https://final-pro-lgyf.onrender.com/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    },
    10000
  );
}

// 🔁 retry + delay
async function loginWithRetry(email, password, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await loginRequest(email, password);

      if (res.ok) return res;

      // لو مش ok استنى وجرب تاني
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (err) {
      // network error
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  throw new Error("either email or password is incorrect, or server is down. Please try again later.");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  messageBox.style.display = "none";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMessage("Please enter email and password");
    return;
  }

  // 🔒 منع الضغط مرتين
  submitBtn.disabled = true;
  submitBtn.textContent = "Logging in...";

  try {
    const res = await loginWithRetry(email, password);
    const data = await res.json();

    // ❌ error من السيرفر
    if (!res.ok) {
      showMessage(data.message || "Invalid email or password");
      return;
    }

    // ✅ نجاح
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    localStorage.setItem("userGmail", data.user.email);

    showMessage("Login successful, redirecting...", "success");

    setTimeout(() => {
      window.location.href = window.location.origin + "/home/index.html";
    }, 800);

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    showMessage(error.message || "Server error, please try again later");
  }

  // 🔓 رجع الزرار
  submitBtn.disabled = false;
  submitBtn.textContent = "Login";
});


// Google login (later)
document.querySelector(".google-btn").addEventListener("click", () => {
  showMessage("Google login will be available soon");
});


// Forgot password (later)
document.getElementById("forgotPassword").addEventListener("click", (e) => {
  e.preventDefault();
  showMessage("Password reset feature will be added soon");
});