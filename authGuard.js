(function () {
  const token = localStorage.getItem("token");

  // الصفحات المسموح تدخلها من غير login
  const publicPages = [
    "/registration/login/travel_login_html.html",
    "/registration/signup.html",
    "/registration/login/reset-password.html",
    "/registration/login/travel_forgot_password.html"
  ];

  const currentPage = window.location.pathname;

  const isPublic = publicPages.some(page =>
    currentPage.includes(page)
  );

  // ❌ لو مفيش توكن ومش صفحة عامة → رجعه للوجين
  if (!token && !isPublic) {
    window.location.href = "/registration/login/travel_login_html.html";
  }
  // لو عامل login وفتح login page → رجعه للهوم
  if (token && currentPage.includes("travel_login_html.html")) {
    window.location.href = "/home/index.html";
  }

})();