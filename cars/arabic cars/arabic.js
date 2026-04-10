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
   الحالة العامة
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
   Retry fetch (FIX 90% of errors)
================================ */
async function fetchCars(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch("https://final-pro-lgyf.onrender.com/api/cars?lang=ar");

      if (res.ok) return await res.json();

    } catch (err) {
      console.log("retry:", i + 1);
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  throw new Error("Failed to load cars");
}


/* ===============================
   تحميل السيارات (FIXED)
================================ */
document.addEventListener("DOMContentLoaded", async () => {
  showLoading();

  try {
    const cars = await fetchCars(3);

    allCars = cars || [];
    renderCars(allCars);

  } catch (err) {
    console.error(err);
    showMessage("تعذر تحميل السيارات، حاول تحديث الصفحة");
  }
});


/* ===============================
   عرض السيارات
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
          <span>⚙️ أوتوماتيك</span>
        </div>

        <div class="car-price">
          <strong>${car.pricePerDay} دولار</strong> / يوم
        </div>

        <button class="select-car-btn">اختر</button>
      </div>
    `;

    carsGrid.appendChild(carCard);

    const selectBtn = carCard.querySelector(".select-car-btn");

    selectBtn.addEventListener("click", () => {
      document.querySelectorAll(".car-card").forEach((card) => {
        card.classList.remove("selected");
        card.querySelector(".select-car-btn").textContent = "اختر";
      });

      carCard.classList.add("selected");
      selectBtn.textContent = "مُختار";

      selectedCarId = car._id;
      selectedCarName = car.name;
      selectedCarDisplayPrice = car.pricePerDay;

      updatePricePreview();
    });
  });
}


/* ===============================
   البحث (بدون تغيير مهم)
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
   السعر
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
    if (totalPriceEl) totalPriceEl.innerText = "";
    return;
  }

  const pickup = `${pickupDate.value}T${pickupTime.value}`;
  const dropoff = `${dropoffDate.value}T${dropoffTime.value}`;

  const days = calculateDays(pickup, dropoff);

  if (days <= 0) {
    if (totalPriceEl) totalPriceEl.innerText = "";
    showMessage("تاريخ التسليم يجب أن يكون بعد الاستلام");
    return;
  }

  let total = days * selectedCarDisplayPrice;
  if (privateDriverCheckbox?.checked) total += days * 100;

  if (totalPriceEl) {
    totalPriceEl.innerText = `السعر المقدر: ${total} دولار`;
  }
}


/* ===============================
   Booking (بدون تغيير كبير)
================================ */
const form = document.getElementById("bookingForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!selectedCarId) {
      showMessage("من فضلك اختر السياره اولا");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      showMessage("يجب تسجيل الدخول أولاً");
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
          pickupLocation: pickupLocation?.value,
          dropoffLocation: dropoffLocation?.value,
          lang: "ar",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      showMessage("✅ تم تأكيد الحجز بنجاح!", "success");

    } catch (err) {
      showMessage(err.message || "خطا في السرفير");
    }
  });
}


/* ===============================
   Auth button
================================ */
const authBtn = document.getElementById("authBtn");
const token = localStorage.getItem("token");

if (authBtn) {
  if (token) {
    authBtn.textContent = "تسجيل الخروج";
    authBtn.onclick = () => {
      localStorage.clear();
      location.reload();
    };
  } else {
    authBtn.textContent = "تسجيل الدخول";
    authBtn.onclick = () => {
      window.location.href = "../../registration/login/travel_login_html.html";
    };
  }
}