const form = document.getElementById("loginForm");
const messageBox = document.getElementById("loginMessage");

function showMessage(text, type = "error") {
  messageBox.textContent = text;
  messageBox.className = `login-message ${type}`;
  messageBox.style.display = "block";
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

  try {
    const res = await fetch("https://final-pro-lgyf.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      // if (data.user.isAdmin) {
      //   window.location.href = "/admin/admin.html";
      // } else {
      //   window.location.href = "/home/index.html";
      // } 
    }

    if (!res.ok) {
      showMessage(data.message || "Invalid email or password");
      return;
    }

    // Save token
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
