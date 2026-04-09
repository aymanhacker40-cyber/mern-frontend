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


document.getElementById("logoutBtn").addEventListener("click", async () => {
  localStorage.clear();
  sessionStorage.clear();

  window.location.href = "/frontend/registration/login/travel_login_html.html";
});



// Navigation functionality
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".content-section");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const todayCount = document.getElementById("todayCount");
const pendingCount = document.getElementById("pendingCount");

// Section data
const sectionData = {
  cars: {
    title: "Car Bookings",
    subtitle: "Manage and track all car rental bookings",

  },
  hotels: {
    title: "Hotel Bookings",
    subtitle: "Manage and track all hotel reservations",

  },
  flights: {
    title: "Flight Bookings",
    subtitle: "Manage and track all flight ticket bookings",

  },
};

// Switch between sections
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const sectionName = item.getAttribute("data-section");

    // Update active nav item
    navItems.forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");

    // Update active section
    sections.forEach((section) => section.classList.remove("active"));
    const activeSection = document.getElementById(`${sectionName}-section`);
    if (activeSection) {
      activeSection.classList.add("active");
    }

    // Update header content
    const data = sectionData[sectionName];
    if (data) {
      pageTitle.textContent = data.title;
      pageSubtitle.textContent = data.subtitle;
    }

    // 🔥 هنا تحط التحميل الديناميك
    if (sectionName === "cars") {
      loadCarBookings();
    }

    if (sectionName === "hotels") {
      loadHotelBookings();
    }
    if (sectionName === "flights") {
      loadFlightBookings();
    }


  });
});

// Action buttons functionality
document.addEventListener("click", async (e) => {
  const target = e.target.closest(".action-btn");
  if (!target) return;

  const row = target.closest("tr");
  const bookingId = row.dataset.id;
  const token = localStorage.getItem("token");

  if (!bookingId) return;

  // =========================
  // CONFIRM BOOKING
  // =========================
  if (target.classList.contains("confirm")) {
    if (!confirm("Confirm this booking?")) return;

    try {
      const response = await fetch(
        `https://final-pro-lgyf.onrender.com/api/car-bookings/${bookingId}/confirm`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to confirm");

      // تحديث الـ UI
      const statusSpan = row.querySelector(".status-badge");
      statusSpan.textContent = "confirmed";
      statusSpan.className = "status-badge confirmed";

      alert("Booking confirmed successfully!");
    } catch (error) {
      console.error(error);
      alert("Error confirming booking");
    }
  }

  // =========================
  // DELETE BOOKING
  // =========================
  if (target.classList.contains("delete")) {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(
        `https://final-pro-lgyf.onrender.com/api/car-bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      // حذف من UI
      row.style.animation = "fadeOut 0.3s ease";
      setTimeout(() => row.remove(), 300);

      alert("Booking deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error deleting booking");
    }
  }
});

// Logout functionality
document.querySelector(".logout-btn").addEventListener("click", () => {
  
    // Clear any stored tokens
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    window.location.href = "/frontend/registration/login/travel_login_html.html";
  
});

// Add fade out animation
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }
`;
document.head.appendChild(style);

// Mobile sidebar toggle (for responsive design)
function createMobileToggle() {
  if (window.innerWidth <= 768) {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");

    // Create toggle button if it doesn't exist
    if (!document.querySelector(".mobile-toggle")) {
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "mobile-toggle";
      toggleBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
      toggleBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1000;
        background: var(--primary);
        border: none;
        border-radius: 8px;
        padding: 10px;
        cursor: pointer;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-md);
      `;

      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });

      document.body.appendChild(toggleBtn);

      // Close sidebar when clicking outside
      mainContent.addEventListener("click", () => {
        if (sidebar.classList.contains("open")) {
          sidebar.classList.remove("open");
        }
      });
    }
  }
}

// Initialize mobile toggle on load and resize
createMobileToggle();
window.addEventListener("resize", createMobileToggle);

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = "smooth";

console.log("Admin Dashboard loaded successfully!");

// ==========================================
// LOAD CAR BOOKINGS FROM BACKEND
// ==========================================

async function loadCarBookings() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    const response = await fetch(
      "https://final-pro-lgyf.onrender.com/api/car-bookings",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch bookings");

    const bookings = await response.json();

    // 🔥 احسب الإحصائيات بعد ما تجيب البيانات
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    ).length;

    todayCount.textContent = totalBookings;
    pendingCount.textContent = pendingBookings;

    const tableBody = document.querySelector("#cars-section tbody");

    if (!tableBody) {
      console.error("Cars table not found");
      return;
    }

    tableBody.innerHTML = "";

    bookings.forEach((booking) => {
      const row = document.createElement("tr");
      row.dataset.id = booking._id;

      row.innerHTML = `
<td>${booking.phone || "-"}</td>

<td>
  <strong>${booking.firstName || ""} ${booking.lastName || ""}</strong>
  <br>
  <small>${booking.email || "-"}</small>
</td>

<td>${booking.carName}</td>

<td>${new Date(booking.pickupDateTime).toLocaleDateString()}</td>

<td>${new Date(booking.dropoffDateTime).toLocaleDateString()}</td>

<td>
  <span class="status-badge ${booking.status}">
    ${booking.status}
  </span>
</td>

<td>$${booking.totalPrice}</td>

<td class="actions">
  <div class="actions-wrapper">
    <button class="action-btn confirm-btn">
      <span>✓</span>
      <span>Confirm</span>
    </button>

    <button class="action-btn delete-btn">
      <span>🗑</span>
      <span>Delete</span>
    </button>
  </div>
</td>
`;

      const confirmBtn = row.querySelector(".confirm-btn");
      const deleteBtn = row.querySelector(".delete-btn");

      // Confirm
      confirmBtn.addEventListener("click", async () => {
        try {
          const response = await fetch(
            `https://final-pro-lgyf.onrender.com/api/car-bookings/${booking._id}/confirm`,
            { method: "PUT" }
          );

          if (!response.ok) throw new Error("Failed to confirm");

          loadCarBookings(); // 🔥 بدل location.reload()
        } catch (error) {
          console.error(error);
          
        }
      });

      // Delete
      deleteBtn.addEventListener("click", async () => {

        try {
          const response = await fetch(
            `https://final-pro-lgyf.onrender.com/api/car-bookings/${booking._id}`,
            { method: "DELETE" }
          );

          if (!response.ok) throw new Error("Failed to delete");

          loadCarBookings(); // 🔥 تحديث بدون reload
        } catch (error) {
          console.error(error);
          console.log("Error deleting booking");
        }
      });

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading bookings:", error);
  }
}
async function loadHotelBookings() {
  try {
    const response = await fetch(
      "https://final-pro-lgyf.onrender.com/api/hotels"
    );

    if (!response.ok) throw new Error("Failed to fetch hotels");

    const bookings = await response.json();

    // 🔥 احسب الإحصائيات
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    ).length;

    todayCount.textContent = totalBookings;
    pendingCount.textContent = pendingBookings;

    const tableBody = document.querySelector(
      "#hotels-section tbody"
    );

    if (!tableBody) return;

    tableBody.innerHTML = "";

    bookings.forEach((booking) => {
      const row = document.createElement("tr");
      row.dataset.id = booking._id;

      const firstGuest =
        booking.guests && booking.guests.length > 0
          ? booking.guests[0]
          : null;

      row.innerHTML = `
<td>${firstGuest?.name || "-"}</td>

<td>${firstGuest?.phone || "-"}</td>

<td>${firstGuest?.email || "-"}</td>

<td>${booking.hotelName}</td>

<td>${new Date(booking.checkInDate).toLocaleDateString()}</td>

<td>${new Date(booking.checkOutDate).toLocaleDateString()}</td>

<td>${booking.numRooms}</td>

<td>
  <span class="status-badge ${booking.status}">
    ${booking.status}
  </span>
</td>

<td class="actions">
  <div class="actions-wrapper">
    <button class="action-btn confirm-btn">
      ✓ Confirm
    </button>

    <button class="action-btn delete-btn">
      🗑 Delete
    </button>
  </div>
</td>
`;




      // Confirm
      row.querySelector(".confirm-btn")
        .addEventListener("click", async () => {
          await fetch(
            `https://final-pro-lgyf.onrender.com/api/hotels/${booking._id}/confirm`,
            { method: "PUT" }
          );

          loadHotelBookings(); // 🔥 تحديث بدون reload
        });

      // Delete
      row.querySelector(".delete-btn")
        .addEventListener("click", async () => {
          await fetch(
            `https://final-pro-lgyf.onrender.com/api/hotels/${booking._id}`,
            { method: "DELETE" }
          );

          loadHotelBookings(); // 🔥 تحديث بدون reload
        });

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading hotel bookings:", error);
  }
}
// ==========================================
// LOAD FLIGHT BOOKINGS
// ==========================================

async function loadFlightBookings() {
  try {
    const response = await fetch(
      "https://final-pro-lgyf.onrender.com/api/flight-bookings"
    );

    if (!response.ok) throw new Error("Failed to fetch flight bookings");

    const bookings = await response.json();

    // إحصائيات
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    ).length;

    todayCount.textContent = totalBookings;
    pendingCount.textContent = pendingBookings;

    const tableBody = document.querySelector(
      "#flights-section tbody"
    );

    tableBody.innerHTML = "";

    bookings.forEach((booking) => {
      const row = document.createElement("tr");
      row.dataset.id = booking._id;

      row.innerHTML = `
<td>
  <strong>${booking.fullName || "-"}</strong>
  <br>
  <small>${booking.email || "-"}</small>
</td>

<td>${booking.toCity} → ${booking.fromCity}</td>


<td>${new Date(booking.departureDate).toLocaleDateString()}</td>

<td>
  ${booking.returnDate
          ? new Date(booking.returnDate).toLocaleDateString()
          : "-"
        }
</td>

<td>
  <span class="status-badge ${booking.status}">
    ${booking.status}
  </span>
</td>

<td class="actions">
  <div class="actions-wrapper">
    <button class="action-btn confirm-btn">
      ✓ Confirm
    </button>

    <button class="action-btn delete-btn">
      🗑 Delete
    </button>
  </div>
</td>
`;

      // Confirm
      row.querySelector(".confirm-btn")
        .addEventListener("click", async () => {
          await fetch(
            `https://final-pro-lgyf.onrender.com/api/flight-bookings/${booking._id}/confirm`,
            { method: "PUT" }
          );

          loadFlightBookings();
        });

      // Delete
      row.querySelector(".delete-btn")
        .addEventListener("click", async () => {
          await fetch(
            `https://final-pro-lgyf.onrender.com/api/flight-bookings/${booking._id}`,
            { method: "DELETE" }
          );

          loadFlightBookings();
        });

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading flight bookings:", error);
  }
}
// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  loadCarBookings();
  loadHotelBookings();
  loadFlightBookings();
});


