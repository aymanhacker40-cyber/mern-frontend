  document.getElementById("logoutBtn").addEventListener("click", async () => {
  localStorage.clear(); 
  sessionStorage.clear();

  window.location.href = "../../registration/login/travel_login_html.html";
});
// -----------------


/* ===============================
   Global State
================================ */
const pickupLocation = document.getElementById("pickupLocation");
const dropoffLocation = document.getElementById("dropoffLocation");

let selectedCarId = null;
let selectedCarName = null;
let selectedCarDisplayPrice = null; // UI only
let allCars = [];

const formMessage = document.getElementById("formError");

function showMessage(text, type = "error") {
  formMessage.textContent = text;
  formMessage.className = `form-error ${type}`;
  formMessage.style.display = "block";
}

/* ===============================
   Tab Switching
================================ */
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
  });
});

/* ===============================
   Smooth Scroll
================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

/* ===============================
   Load Cars FROM API ✅
================================ */
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://final-pro-lgyf.onrender.com/api/cars?lang=en")
    .then((res) => res.json())
    .then((cars) => {
      allCars = cars;
      renderCars(allCars);
    })
    .catch((err) => console.error("Error loading cars:", err));
});

/* ===============================
   Render Cars
================================ */
function renderCars(cars) {
  const carsGrid = document.getElementById("carsGrid");
  carsGrid.innerHTML = "";

  cars.forEach((car) => {
    const carCard = document.createElement("div");
    carCard.className = "car-card";

    carCard.innerHTML = `
      <img src="${car.image}" alt="${car.name}" class="car-image">

      <div class="car-details">
        <h3 class="car-name">${car.name}</h3>

        <div class="car-specs">
          <span>👥 ${car.seats}</span>
          <span>🧳 ${car.bags}</span>
          <span>⚙️ ${car.transmission}</span>
        </div>

        <div class="car-price">
          <strong>USD ${car.pricePerDay}</strong> / day
        </div>

        <button class="select-car-btn">Select</button>
      </div>
    `;

    carsGrid.appendChild(carCard);

    const selectBtn = carCard.querySelector(".select-car-btn");

    selectBtn.addEventListener("click", () => {
      document.querySelectorAll(".car-card").forEach((card) => {
        card.classList.remove("selected");
        card.querySelector(".select-car-btn").textContent = "Select";
      });

      carCard.classList.add("selected");
      selectBtn.textContent = "Selected";

      selectedCarId = car._id;
      selectedCarName = car.name;
      selectedCarDisplayPrice = car.pricePerDay;

      updatePricePreview();
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const savedGmail = localStorage.getItem("userGmail");
  const gmailElement = document.getElementById("displayGmail");
  gmailElement.style.color = "white";

  if (savedGmail) {
    gmailElement.textContent = savedGmail;
  } else {
    gmailElement.textContent = "Sign in first";
  }
});

/* ===============================
   Search
================================ */
const searchInput = document.getElementById("carSearch");
const suggestions = document.getElementById("suggestions");

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  suggestions.innerHTML = "";

  if (!value) {
    suggestions.style.display = "none";
    renderCars(allCars);
    return;
  }

  const brands = [
    ...new Set(
      allCars
        .map((car) => car.brand)
        .filter((b) => b?.toLowerCase().startsWith(value)),
    ),
  ];

  brands.forEach((brand) => {
    const li = document.createElement("li");
    li.textContent = brand;

    li.addEventListener("click", () => {
      searchInput.value = brand;
      suggestions.style.display = "none";
      renderCars(
        allCars.filter(
          (car) => car.brand.toLowerCase() === brand.toLowerCase(),
        ),
      );
    });

    suggestions.appendChild(li);
  });

  suggestions.style.display = brands.length ? "block" : "none";
});

/* ===============================
   Price Preview (UI ONLY)
================================ */
function calculateDays(start, end) {
  const diff = new Date(end) - new Date(start);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const pickupDate = document.getElementById("pickupDate");
const pickupTime = document.getElementById("pickupTime");
const dropoffDate = document.getElementById("dropoffDate");
const dropoffTime = document.getElementById("dropoffTime");
const privateDriverCheckbox = document.getElementById("privateDriver");
const totalPriceEl = document.getElementById("totalPrice");

function updatePricePreview() {
  if (
    !pickupDate.value ||
    !pickupTime.value ||
    !dropoffDate.value ||
    !dropoffTime.value ||
    !selectedCarDisplayPrice
  ) {
    totalPriceEl.innerText = "";
    return;
  }

  const pickup = `${pickupDate.value}T${pickupTime.value}`;
  const dropoff = `${dropoffDate.value}T${dropoffTime.value}`;

  const days = calculateDays(pickup, dropoff);
  if (days <= 0) return;

  let total = days * selectedCarDisplayPrice;
  if (privateDriverCheckbox.checked) total += days * 100;

  totalPriceEl.innerText = `Estimated Price: ${total} USD`;
}

[
  pickupDate,
  pickupTime,
  dropoffDate,
  dropoffTime,
  privateDriverCheckbox,
].forEach((el) => el.addEventListener("change", updatePricePreview));

/* ===============================
   Booking Submit ✅
================================ */
const form = document.getElementById("bookingForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!selectedCarId) {
    showMessage("Please select a car first");
    return;
  }

  if (!pickupLocation.value || !dropoffLocation.value) {
    showMessage("Please enter pickup and dropoff locations");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    showMessage("You must be logged in first");
    return;
  }

  try {
    const res = await fetch("https://final-pro-lgyf.onrender.com/api/car-bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        carId: selectedCarId,

        pickupDateTime: `${pickupDate.value}T${pickupTime.value}`,
        dropoffDateTime: `${dropoffDate.value}T${dropoffTime.value}`,

        pickupLocation: pickupLocation.value,
        dropoffLocation: dropoffLocation.value,

        privateDriver: privateDriverCheckbox.checked,
        lang: "en",
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    showMessage("✅ Booking confirmed successfully!", "success");
  } catch (err) {
    showMessage(err.message || "Server error");
  }
});


/* ===============================
   Auth Button
================================ */
const authBtn = document.getElementById("authBtn");
const token = localStorage.getItem("token");

if (token) {
  authBtn.textContent = "Logout";
  authBtn.onclick = () => {
    localStorage.clear();
    location.reload();
  };
} else {
  authBtn.textContent = "Login";
  authBtn.onclick = () => {
    window.location.href = "../../registration/login/travel_login_html.html";
  };
}
