/* ===============================
   Logout
================================ */
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../registration/login/travel_login_html.html";
});


/* ===============================
   Global State
================================ */
const pickupLocation = document.getElementById("pickupLocation");
const dropoffLocation = document.getElementById("dropoffLocation");

let selectedCarId = null;
let selectedCarName = null;
let selectedCarDisplayPrice = null;
let allCars = [];

const formMessage = document.getElementById("formError");

function showMessage(text, type = "error") {
  if (!formMessage) return;
  formMessage.textContent = text;
  formMessage.className = `form-error ${type}`;
  formMessage.style.display = "block";
}


/* ===============================
   Loading state (FIX)
================================ */
function showLoading() {
  const carsGrid = document.getElementById("carsGrid");
  if (carsGrid) {
    carsGrid.innerHTML = "<p>Loading cars...</p>";
  }
}


/* ===============================
   Retry Fetch (IMPORTANT FIX)
================================ */
async function fetchCars(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch("https://final-pro-lgyf.onrender.com/api/cars?lang=en");

      if (res.ok) return await res.json();

    } catch (err) {
      console.log("retry:", i + 1);
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  throw new Error("Failed to load cars");
}


/* ===============================
   Load Cars
================================ */
document.addEventListener("DOMContentLoaded", async () => {
  showLoading();

  try {
    const cars = await fetchCars(3);
    allCars = cars || [];
    renderCars(allCars);
  } catch (err) {
    console.error(err);
    showMessage("Failed to load cars. Please refresh.");
  }
});


/* ===============================
   Render Cars
================================ */
function renderCars(cars) {
  const carsGrid = document.getElementById("carsGrid");
  if (!carsGrid) return;

  carsGrid.innerHTML = "";

  if (!cars || cars.length === 0) {
    carsGrid.innerHTML = "<p>No cars available</p>";
    return;
  }

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


/* ===============================
   Gmail display
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const savedGmail = localStorage.getItem("userGmail");
  const gmailElement = document.getElementById("displayGmail");

  if (gmailElement) {
    gmailElement.style.color = "white";
    gmailElement.textContent = savedGmail || "Sign in first";
  }
});


/* ===============================
   Search
================================ */
const searchInput = document.getElementById("carSearch");
const suggestions = document.getElementById("suggestions");

searchInput?.addEventListener("input", () => {
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
        .filter((b) => b?.toLowerCase().startsWith(value))
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
          (car) => car.brand.toLowerCase() === brand.toLowerCase()
        )
      );
    });

    suggestions.appendChild(li);
  });

  suggestions.style.display = brands.length ? "block" : "none";
});


/* ===============================
   Price Preview
================================ */
function calculateDays(start, end) {
  return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
}

const pickupDate = document.getElementById("pickupDate");
const pickupTime = document.getElementById("pickupTime");
const dropoffDate = document.getElementById("dropoffDate");
const dropoffTime = document.getElementById("dropoffTime");
const privateDriverCheckbox = document.getElementById("privateDriver");
const totalPriceEl = document.getElementById("totalPrice");

function updatePricePreview() {
  if (
    !pickupDate?.value ||
    !pickupTime?.value ||
    !dropoffDate?.value ||
    !dropoffTime?.value ||
    !selectedCarDisplayPrice
  ) {
    if (totalPriceEl) totalPriceEl.innerText = "";
    return;
  }

  const pickup = `${pickupDate.value}T${pickupTime.value}`;
  const dropoff = `${dropoffDate.value}T${dropoffTime.value}`;

  const days = calculateDays(pickup, dropoff);

  if (days <= 0) return;

  let total = days * selectedCarDisplayPrice;
  if (privateDriverCheckbox?.checked) total += days * 100;

  if (totalPriceEl) {
    totalPriceEl.innerText = `Estimated Price: ${total} USD`;
  }
}


/* ===============================
   Booking Submit
================================ */
const form = document.getElementById("bookingForm");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!selectedCarId) {
    showMessage("Please select a car first");
    return;
  }

  if (!pickupLocation?.value || !dropoffLocation?.value) {
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
        pickupLocation: pickupLocation.value,
        dropoffLocation: dropoffLocation.value,
        lang: "en",
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    showMessage("Booking confirmed successfully!", "success");

  } catch (err) {
    showMessage(err.message || "Server error");
  }
});


/* ===============================
   Auth Button
================================ */
const authBtn = document.getElementById("authBtn");
const token = localStorage.getItem("token");

if (authBtn) {
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
}