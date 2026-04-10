const form = document.getElementById("loginForm");
const messageBox = document.getElementById("loginMessage");
const submitBtn = form.querySelector("button");

function showMessage(text, type = "error") {
  messageBox.textContent = text;
  messageBox.className = `login-message ${type}`;
  messageBox.style.display = "block";
}

async function loginRequest(email, password) {
  return await fetch("https://final-pro-lgyf.onrender.com/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
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
    let res = await loginRequest(email, password);

    // 🔁 Retry مرة كمان لو السيرفر لسه صاحي (Render cold start)
    if (!res.ok) {
      res = await loginRequest(email, password);
    }

    const data = await res.json();

    // ❌ لو فيه error
    if (!res.ok) {
      showMessage(data.message || "Invalid email or password");
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
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
    console.error(error);
    showMessage("Server error, please try again later");
  }

  // 🔓 رجع الزرار تاني
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