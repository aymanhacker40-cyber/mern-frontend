  document.getElementById("logoutBtn").addEventListener("click", async () => {
  localStorage.clear(); 
  sessionStorage.clear();
  window.location.href = "../registration/login/travel_login_html.html";
});

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

let hotels = [];
let currentLang = "ar"; // default Arabic

// DOM Elements
const continentSelect = document.getElementById("continentSelect");
const countrySelect = document.getElementById("countrySelect");
const citySelect = document.getElementById("citySelect");
const hotelsGrid = document.getElementById("hotelsGrid");
const resultsCount = document.getElementById("resultsCount");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const searchInput = document.getElementById("searchInput");
const ratingSelect = document.getElementById("ratingSelect");
const viewChecks = document.querySelectorAll(".viewCheck");
const langToggle = document.getElementById("lang-toggle");

// Footer translation object
const footerElements = {
  "footer-company-title": { ar: "الشركة", en: "Company" },
  "footer-about": { ar: "من نحن", en: "About Us" },
  "footer-services": { ar: "خدماتنا", en: "Our Services" },
  "footer-privacy": { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  "footer-affiliate": { ar: "برنامج الشركاء", en: "Affiliate Program" },
  "footer-help-title": { ar: "المساعدة", en: "Get Help" },
  "footer-faq": { ar: "الأسئلة الشائعة", en: "FAQ" },
  "footer-booking": { ar: "الحجز", en: "Booking" },
  "footer-cancel": { ar: "الإلغاء", en: "Cancellation" },
  "footer-payment": { ar: "الدفع", en: "Payment" },
  "footer-hotels": { ar: "الفنادق", en: "Hotels" },
  "footer-cars": { ar: "السيارات", en: "Cars" },
  "footer-flight": { ar: "الطيران", en: "Flight" },
  "footer-services-title": { ar: "الخدمات", en: "Services" },
  "footer-social-title": { ar: "تابعنا", en: "Follow Us" },
  "footer-copy": { ar: "© 2026 رحال", en: "© 2026 Rahal" }
};

// Views translation object
const viewTranslations = {
  "sea": { ar: "بحر", en: "Sea" },
  "city": { ar: "مدينة", en: "City" },
  "pool": { ar: "مسبح", en: "Pool" },
  "garden": { ar: "حديقة", en: "Garden" },
  "river": { ar: "نهر", en: "River" },
  "mountain": { ar: "جبل", en: "Mountain" },
  "lake": { ar: "بحيرة", en: "Lake" },
  "harbor": { ar: "ميناء", en: "Harbor" }
};

// Load JSON
fetch("hotels.json")
  .then(res => res.json())
  .then(data => {
    hotels = data;
    populateFilters();
    renderHotels();
  })
  .catch(err => console.error("Error loading hotels:", err));

// Populate filters dynamically
function populateFilters() {
  // Continent
  const continents = [...new Set(hotels.map(h => h.continent))];
  continentSelect.innerHTML = `<option value="">${currentLang === "ar" ? "الكل" : "All"}</option>` +
                              continents.map(c => `<option value="${c}">${c}</option>`).join("");

  // Country
  const countries = [...new Set(hotels.map(h => h.country[currentLang]))];
  countrySelect.innerHTML = `<option value="">${currentLang === "ar" ? "الكل" : "All"}</option>` +
                            countries.map(c => `<option value="${c}">${c}</option>`).join("");

  // City
  const cities = [...new Set(hotels.map(h => h.city[currentLang]))];
  citySelect.innerHTML = `<option value="">${currentLang === "ar" ? "الكل" : "All"}</option>` +
                         cities.map(c => `<option value="${c}">${c}</option>`).join("");

  // Rating
  ratingSelect.innerHTML = `<option value="">${currentLang === "ar" ? "كل التقييمات" : "All Ratings"}</option>
                            <option value="5">⭐⭐⭐⭐⭐</option>
                            <option value="4">⭐⭐⭐⭐+</option>
                            <option value="3">⭐⭐⭐+</option>`;

  // Reset all inputs to default
  continentSelect.value = '';
  countrySelect.value = '';
  citySelect.value = '';
  ratingSelect.value = '';
  minPriceInput.value = '';
  maxPriceInput.value = '';
  searchInput.value = '';
  viewChecks.forEach(cb => cb.checked = false);
}

// Render hotels
function renderHotels() {
  hotelsGrid.innerHTML = "";
  const filtered = hotels.filter(h => {
    if (continentSelect.value && h.continent !== continentSelect.value) return false;
    if (countrySelect.value && h.country[currentLang] !== countrySelect.value) return false;
    if (citySelect.value && h.city[currentLang] !== citySelect.value) return false;

    const minPrice = parseFloat(minPriceInput.value);
    if (!isNaN(minPrice) && h.price < minPrice) return false;
    const maxPrice = parseFloat(maxPriceInput.value);
    if (!isNaN(maxPrice) && h.price > maxPrice) return false;

    if (ratingSelect.value && h.rating < parseInt(ratingSelect.value)) return false;

    if (searchInput.value && !h.name[currentLang].toLowerCase().includes(searchInput.value.toLowerCase())) return false;

    const selectedViews = Array.from(viewChecks).filter(v => v.checked).map(v => v.value);
    if (selectedViews.length && !selectedViews.some(v => h.views.includes(v))) return false;

    return true;
  });

  resultsCount.textContent = currentLang === "ar" ? `تم العثور على ${filtered.length} فندق` 
                                                   : `${filtered.length} Hotels found`;

  filtered.forEach(hotel => {
    hotelsGrid.innerHTML += `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <img src="${hotel.image}" class="h-56 w-full object-cover">
        <div class="p-5">
          <h3 class="text-xl font-bold">${hotel.name[currentLang]}</h3>
          <p class="text-gray-600">${hotel.city[currentLang]} - ${hotel.country[currentLang]}</p>
          <p class="mt-2 font-bold">${currentLang === "ar" ? "السعر" : "Price"}: ${hotel.price} $</p>
          <p class="mt-1 text-sm text-gray-500">⭐ ${hotel.rating} | ${hotel.views.join(', ')}</p>
        </div>
      </div>
    `;
  });
}

// Event Listeners
[continentSelect, countrySelect, citySelect, ratingSelect].forEach(el => {
  el.addEventListener("change", renderHotels);
});
[minPriceInput, maxPriceInput, searchInput].forEach(el => {
  el.addEventListener("input", renderHotels);
});
viewChecks.forEach(v => v.addEventListener("change", renderHotels));

// Reset Filters button
document.getElementById('resetFilters').addEventListener('click', () => {
  populateFilters();
  renderHotels();
});

// Function to update footer texts
function updateFooterTexts() {
  Object.keys(footerElements).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = footerElements[id][currentLang];
  });
}

// Language toggle with icon update
langToggle.addEventListener("click", () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  langToggle.textContent = currentLang === "ar" ? "AR" : "EN";

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

  // Update static texts
  document.getElementById("company-name").textContent = currentLang === "ar" ? "رحال" : "Rahal";
  document.getElementById("nav-home").textContent = currentLang === "ar" ? "الصفحة الرئيسية" : "Home";
  document.getElementById("nav-hotels").textContent = currentLang === "ar" ? "الفنادق" : "Hotels";
  document.getElementById("nav-cars").textContent = currentLang === "ar" ? "تأجير السيارات" : "Cars";
  // document.getElementById("nav-airlines").textContent = currentLang === "ar" ? "الطيران" : "Airlines";
  document.getElementById("hero-title").textContent = currentLang === "ar" ? "احجز فندقك بأفضل الأسعار" : "Book Your Hotel at Best Price";
  document.getElementById("hero-subtitle").textContent = currentLang === "ar" ? "استمتع بتجربة إقامة مميزة" : "Enjoy a Unique Stay Experience";
  document.getElementById("hero-btn").textContent = currentLang === "ar" ? "إحجز الان" : "Book Now";
  document.getElementById("filters-title").textContent = currentLang === "ar" ? "الفلاتر" : "Filters";
  document.getElementById("search-label").textContent = currentLang === "ar" ? "بحث" : "Search";
  document.getElementById("continent-label").textContent = currentLang === "ar" ? "القارة" : "Continent";
  document.getElementById("country-label").textContent = currentLang === "ar" ? "الدولة" : "Country";
  document.getElementById("city-label").textContent = currentLang === "ar" ? "المدينة" : "City";
  document.getElementById("price-label").textContent = currentLang === "ar" ? "السعر" : "Price";
  document.getElementById("rating-label").textContent = currentLang === "ar" ? "التقييم" : "Rating";
  document.getElementById("views-label").textContent = currentLang === "ar" ? "الإطلالة" : "Views";
  document.getElementById("resetFilters").textContent = currentLang === "ar" ? "إعادة التعيين" : "Reset";


  // Translate price input placeholders
  minPriceInput.placeholder = currentLang === "ar" ? "حد أدنى" : "Min";
  maxPriceInput.placeholder = currentLang === "ar" ? "حد أقصى" : "Max";

  // Translate view checkboxes
  viewChecks.forEach(cb => {
    const label = cb.parentElement;
    if (label && viewTranslations[cb.value]) {
      label.childNodes[1].textContent = viewTranslations[cb.value][currentLang];
    }
  });

  // Update footer texts
  updateFooterTexts();

  populateFilters(); 
  renderHotels();
});

// Profile toggle
document.getElementById("profile-btn").addEventListener("click", () => {
  document.getElementById("profile-info").classList.toggle("hidden");
});
