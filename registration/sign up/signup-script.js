const form = document.getElementById('signupForm');
const password = document.getElementById('password');
const repeatPassword = document.getElementById('repeatPassword');
const passwordMatch = document.getElementById('passwordMatch');
const nationalId = document.getElementById('nationalId');
const nationalIdHint = document.getElementById('nationalIdHint');
const phone = document.getElementById('phone');
const phoneHint = document.getElementById('phoneHint');
const age = document.getElementById('age');
const formMessage = document.getElementById('formMessage');

/* ================= HELPERS ================= */

function showMessage(message, type = 'error') {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = 'block';
}

function clearMessage() {
  formMessage.textContent = '';
  formMessage.style.display = 'none';
}

/* ================= PASSWORD RULES ================= */

const requirements = {
  length: document.getElementById('req-length'),
  upper: document.getElementById('req-upper'),
  lower: document.getElementById('req-lower'),
  number: document.getElementById('req-number'),
  special: document.getElementById('req-special')
};

function validatePassword() {
  const value = password.value;

  const checks = {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
  };

  Object.keys(checks).forEach((key) => {
    requirements[key].classList.toggle('valid', checks[key]);
    requirements[key].textContent =
      (checks[key] ? '✓ ' : '✗ ') + requirements[key].textContent.slice(2);
  });
}

function isPasswordValid() {
  return Object.values({
    length: password.value.length >= 8,
    upper: /[A-Z]/.test(password.value),
    lower: /[a-z]/.test(password.value),
    number: /[0-9]/.test(password.value),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value)
  }).every(Boolean);
}

/* ================= MATCH PASSWORD ================= */

function checkPasswordMatch() {
  if (!repeatPassword.value) {
    passwordMatch.textContent = '';
    passwordMatch.className = 'password-match';
  } else if (password.value === repeatPassword.value) {
    passwordMatch.textContent = '✓ Passwords match';
    passwordMatch.className = 'password-match success';
  } else {
    passwordMatch.textContent = '✗ Passwords do not match';
    passwordMatch.className = 'password-match error';
  }
}

/* ================= NATIONAL ID ================= */

function validateNationalId() {
  const valid = /^\d{14}$/.test(nationalId.value);
  nationalIdHint.textContent = valid
    ? '✓ Valid National ID'
    : 'Must be exactly 14 digits';
  nationalIdHint.className = valid
    ? 'input-hint success'
    : 'input-hint error';
}

/* ================= PHONE ================= */

function validatePhone() {
  const valid = /^\d{11}$/.test(phone.value);
  phoneHint.textContent = valid
    ? '✓ Valid Phone Number'
    : 'Must be exactly 11 digits';
  phoneHint.className = valid
    ? 'input-hint success'
    : 'input-hint error';
}

/* ================= EVENTS ================= */

password.addEventListener('input', () => {
  validatePassword();
  checkPasswordMatch();
  clearMessage();
});

repeatPassword.addEventListener('input', () => {
  checkPasswordMatch();
  clearMessage();
});

nationalId.addEventListener('input', () => {
  nationalId.value = nationalId.value.replace(/\D/g, '');
  validateNationalId();
});

phone.addEventListener('input', () => {
  phone.value = phone.value.replace(/\D/g, '');
  validatePhone();
});

/* ================= SUBMIT ================= */

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessage();

  if (parseInt(age.value) < 18)
    return showMessage('You must be at least 18 years old');

  if (!isPasswordValid())
    return showMessage('Password does not meet the required rules');

  if (password.value !== repeatPassword.value)
    return showMessage('Passwords do not match');

  const userData = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    age: parseInt(age.value),
    gender: document.getElementById('gender').value,
    nationalId: nationalId.value,
    phone: phone.value,
    email: document.getElementById('email').value.trim(),
    password: password.value
  };

  try {
    const res = await fetch('https://final-pro-lgyf.onrender.com/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (!res.ok)
      return showMessage(data.message || 'Signup failed');

    showMessage('Account created successfully 🎉', 'success');

    setTimeout(() => {
      window.location.href = '../login/travel_login_html.html';
    }, 1200);

  } catch (error) {
    showMessage('Server error. Please try again later.');
  }
});

