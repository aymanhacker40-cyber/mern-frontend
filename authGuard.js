// check token from local OR session storage
const token = localStorage.getItem("token") || sessionStorage.getItem("token");

if (!token) {
  window.location.href =
    window.location.origin + "/registration/login/travel_login_html.html";
}
