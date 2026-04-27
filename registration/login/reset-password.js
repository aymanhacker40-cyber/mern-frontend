const form = document.getElementById("resetPasswordForm");
const messageBox = document.getElementById("resetMessage");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

// Password requirements elements
const reqLength = document.getElementById("req-length");
const reqUppercase = document.getElementById("req-uppercase");
const reqLowercase = document.getElementById("req-lowercase");
const reqNumber = document.getElementById("req-number");

function showMessage(text, type = "error") {
  messageBox.textContent = text;
  messageBox.className = `reset-message ${type}`;
  messageBox.style.display = "block";
}

// Password visibility toggle
document.querySelectorAll(".toggle-password").forEach((button) => {
  button.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target");
    const input = document.getElementById(targetId);

    if (input.type === "password") {
      input.type = "text";
      this.querySelector(".eye-icon").innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="1" y1="1" x2="23" y2="23" stroke="#666" stroke-width="2" stroke-linecap="round"/>
      `;
    } else {
      input.type = "password";
      this.querySelector(".eye-icon").innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    }
  });
});

// Password validation
function validatePassword(password) {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  return requirements;
}

// Update password requirements UI
newPasswordInput.addEventListener("input", function () {
  const password = this.value;
  const requirements = validatePassword(password);

  // Update UI for each requirement
  if (requirements.length) {
    reqLength.classList.add("valid");
  } else {
    reqLength.classList.remove("valid");
  }

  if (requirements.uppercase) {
    reqUppercase.classList.add("valid");
  } else {
    reqUppercase.classList.remove("valid");
  }

  if (requirements.lowercase) {
    reqLowercase.classList.add("valid");
  } else {
    reqLowercase.classList.remove("valid");
  }

  if (requirements.number) {
    reqNumber.classList.add("valid");
  } else {
    reqNumber.classList.remove("valid");
  }
});

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageBox.style.display = "none";

  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Validate password
  const requirements = validatePassword(newPassword);
  if (
    !requirements.length ||
    !requirements.uppercase ||
    !requirements.lowercase ||
    !requirements.number
  ) {
    showMessage("Please meet all password requirements");
    return;
  }

  if (newPassword !== confirmPassword) {
    showMessage("Passwords do not match");
    return;
  }

  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (!token) {
    showMessage("Invalid reset link");
    return;
  }

  try {
    const res = await fetch("https://final-pro-lgyf.onrender.com/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.message || "Failed to reset password");
      return;
    }

    showMessage("Password reset successfully! Redirecting to login...", "success");

    setTimeout(() => {
      window.location.href = "travel_login_html.html";
    }, 2000);

  } catch (error) {
    console.error(error);
    showMessage("Server error, please try again later");
  }
});
