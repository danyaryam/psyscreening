export const MEDICAL_DISCLAIMER =
  "PsyScreening hanya untuk screening awal dan edukasi, bukan diagnosis medis atau psikologis profesional.";

export const APP_ROUTES = {
  landing: "/",
  login: "/login",
  register: "/register",
  userDashboard: "/app/dashboard",
  profile: "/app/profile",
  screeningNew: "/app/screening/new",
  screeningResult: "/app/results/:id",
  history: "/app/history",
  adminDashboard: "/admin/dashboard",
  adminUsers: "/admin/users",
  adminScreenings: "/admin/screenings",
};

export const USER_NAV_ITEMS = [
  { label: "Dashboard", to: "/app/dashboard" },
  { label: "Mulai Screening", to: "/app/screening/new" },
  { label: "Riwayat", to: "/app/history" },
  { label: "Profil", to: "/app/profile" },
];

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Users", to: "/admin/users" },
  { label: "Screenings", to: "/admin/screenings" },
];
