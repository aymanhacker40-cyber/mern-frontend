const form = document.getElementById("forgotPasswordForm");
const messageBox = document.getElementById("resetMessage");

function showMessage(text, type = "error") {
  messageBox.textContent = text;
  messageBox.className = `reset-message ${type}`;
  messageBox.style.display = "block";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  messageBox.style.display = "none";

  const email = document.getElementById("email").value.trim();

  if (!email) {
    showMessage("Please enter your email address");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage("Please enter a valid email address");
    return;
  }

  try {
    const res = await fetch("https://final-pro-lgyf.onrender.com/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.message || "Failed to send reset link");
      return;
    }

    showMessage(
      "Password reset link has been sent to your email. Please check your inbox.",
      "success"
    );

    // Clear the form after successful submission
    setTimeout(() => {
      form.reset();
    }, 1500);
  } catch (error) {
    console.error(error);
    showMessage("Server error, please try again later");
  }
});

// Back to login button
document.getElementById("backToLogin").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "travel_login_html.html";
});