// * ---- Slider (الكود الأصلي) ----
const images = document.querySelectorAll(".slider img");
let start = 0;

function updateActive() {
  images.forEach((img) => img.classList.remove("active"));

  for (let i = 0; i < 3; i++) {
    images[(start + i) % images.length].classList.add("active");
  }
}

document.getElementById("next").onclick = () => {
  start = (start + 1) % images.length;
  updateActive();
};

document.getElementById("prev").onclick = () => {
  start = (start - 1 + images.length) % images.length;
  updateActive();
};

updateActive();

setInterval(() => {
  document.getElementById("next").click();
}, 3000);

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

// * =============================== *
// * -------- Search Logic --------- *
// * =============================== *

// حط هنا لينك السيرفر
const BASE_URL = "https://final-pro-lgyf.onrender.com";
// لو على ريندر استخدم ده:
// const BASE_URL = "https://graduation-project-isx1.onrender.com";

// Toggle ذهاب / ذهاب وعودة
const btnOneway = document.getElementById("btn-oneway");
const btnRoundtrip = document.getElementById("btn-roundtrip");
const returnWrap = document.getElementById("return-date-wrap");

btnOneway.addEventListener("click", () => {
  returnWrap.classList.remove("visible");
  btnOneway.style.background = "rgb(67,118,185)";
  btnOneway.style.color = "white";
  btnRoundtrip.style.background = "aliceblue";
  btnRoundtrip.style.color = "black";
});

btnRoundtrip.addEventListener("click", () => {
  returnWrap.classList.add("visible");
  btnRoundtrip.style.background = "rgb(67,118,185)";
  btnRoundtrip.style.color = "white";
  btnOneway.style.background = "aliceblue";
  btnOneway.style.color = "black";
});

// زرار البحث (دلوقتي بيروح للسيرفر)
document.getElementById("search-btn").addEventListener("click", async () => {
  const fromVal = document.getElementById("from-city").value.trim();
  const toVal = document.getElementById("to-city").value.trim();
  const departVal = document.getElementById("depart-date").value;
  const hasLuggage = document.getElementById("has-luggage").checked;

  const tripType = returnWrap.classList.contains("visible")
    ? "roundtrip"
    : "oneway";

  const resultsSection = document.getElementById("results-section");
  const grid = document.getElementById("flights-grid");
  const noResults = document.getElementById("no-results");
  const title = document.getElementById("results-title");

  try {
    const res = await fetch(
      `${BASE_URL}/api/flights?from=${fromVal}&to=${toVal}&date=${departVal}&luggage=${hasLuggage}&tripType=${tripType}`,
    );

    const results = await res.json();

    if (fromVal && toVal) {
      title.textContent =
        "رحلات من " +
        fromVal +
        " إلى " +
        toVal +
        (departVal ? " — " + formatDate(departVal) : "");
    } else {
      title.textContent = "نتائج الرحلات المتاحة";
    }

    grid.innerHTML = "";

    if (!results || results.length === 0) {
      noResults.classList.add("visible");
    } else {
      noResults.classList.remove("visible");
      results.forEach((f) => {
        grid.innerHTML += buildCard(f);
      });
    }

    resultsSection.classList.add("visible");
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Error fetching flights:", error);
    alert("حدث خطأ في السيرفر");
  }
});

// تنسيق التاريخ
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// بناء كارد الرحلة (متوافق مع الداتا الجاية من MongoDB)
function buildCard(f) {
  const luggageHtml = f.hasLuggage
    ? `<div class="luggage-badge"><i class="fa-solid fa-suitcase-rolling"></i> أمتعة مشمولة</div>`
    : `<div class="luggage-badge no-luggage"><i class="fa-solid fa-ban"></i> بدون أمتعة</div>`;

  return `
    <div class="flight-card">
      <div class="airline-info">
        <div class="airline-logo">✈️</div>
        <div class="airline-name">${f.airline}</div>
      </div>

      <div class="flight-route">
        <div class="route-point">
          <div class="route-time">${f.departTime}</div>
          <div class="route-city">${f.fromCode}</div>
        </div>
        <div class="route-line">
          <div class="duration-text">${f.duration}</div>
          <div class="line-with-plane">
            <div class="route-dash"></div>
            <div class="plane-icon"><i class="fa-solid fa-plane"></i></div>
            <div class="route-dash"></div>
          </div>
          <div class="stop-badge">${f.stops}</div>
        </div>
        <div class="route-point">
          <div class="route-time">${f.arrivalTime}</div>
          <div class="route-city">${f.toCode}</div>
        </div>
      </div>

      <div class="flight-details">
        <div class="flight-class">${f.flightClass}</div>
        ${luggageHtml}
      </div>

      <div class="price-book">
        <div class="price-wrap">
          <span class="price-tag">${Number(f.price).toLocaleString("ar-EG")}</span>
          <span class="price-currency">${f.currency}</span>
        </div>
            <button class="book-now-btn" onclick='goToBooking(${JSON.stringify(f)})'> احجز الان</button>
      </div>
    </div>
  `;
}

// --------------

// !
// await fetch("/logout", {
//   method: "POST"
// });

document.getElementById("logoutBtn").addEventListener("click", async () => {
  localStorage.clear();
  sessionStorage.clear();

  window.location.href = "../registration/login/travel_login_html.html";
});

// -----------------
const user = JSON.parse(localStorage.getItem("user"));

if (user.isAdmin) {
  document.getElementById("adminLink").classList.add("adminLink");
} else {
  document.getElementById("adminLink").classList.add("notAdmin");
}


// ================================
// Go To Booking Page
// ================================
function goToBooking(flight) {

  const flightData = {
    from: flight.fromCity,
    to: flight.toCity,
    departure: flight.departDate
      ? new Date(flight.departDate).toISOString().split("T")[0]
      : "",
    returnDate: flight.returnDate
      ? new Date(flight.returnDate).toISOString().split("T")[0]
      : "",
    tripType: flight.tripType
  };

  localStorage.setItem("selectedFlight", JSON.stringify(flightData));

  window.location.href = "../rahal-flight-booking.html";
}