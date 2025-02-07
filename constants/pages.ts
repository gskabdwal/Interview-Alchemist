export const appPages = [
  {
    path: "/ia/dashboard",
    title: "App Dashboard",
    breadcrumb: [{ name: "Dashboard", path: "/ia/dashboard" }],
  },
  {
    path: "/ia/interviews",
    title: "Interviews",
    breadcrumb: [{ name: "Interviews", path: "/ia/interviews" }],
  },
  {
    path: "/ia/results",
    title: "Results",
    breadcrumb: [{ name: "Results", path: "/ia/results" }],
  },
  {
    path: "/ia/invoices",
    title: "Invoices",
    breadcrumb: [{ name: "Invoices", path: "/ia/invoices" }],
  },
  {
    path: "/ia/me/update/profile",
    title: "Update Profile",
    breadcrumb: [{ name: "Update Profile", path: "/ia/me/update/profile" }],
  },
  {
    path: "/ia/me/update/password",
    title: "Update Password",
    breadcrumb: [{ name: "Update Password", path: "/ia/me/update/password" }],
  },
  {
    path: "/ia/unsubscribe",
    title: "Unsubscribe App",
    breadcrumb: [{ name: "Unsubscribe", path: "/ia/unsubscribe" }],
  },
];

export const nestedPages = [
  {
    path: "/ia/interviews/new",
    title: "Create New Interview",
    breadcrumb: [
      { name: "Interviews", path: "/ia/interviews" },
      { name: "New", path: "/ia/interviews/new" },
    ],
  },
  {
    path: "/ia/interviews/:id",
    title: "Interview Details",
    breadcrumb: [
      { name: "Interviews", path: "/ia/interviews" },
      { name: "Details", path: "/ia/interviews/:id" },
    ],
  },

  {
    path: "/ia/results/:id",
    title: "Result Details",
    breadcrumb: [
      { name: "Results", path: "/ia/results" },
      { name: "Details", path: "/ia/results/:id" },
    ],
  },
];

export const adminPages = [
  {
    path: "/admin/dashboard",
    title: "Admin Dashboard",
    breadcrumb: [{ name: "Admin Dashboard", path: "/admin/dashboard" }],
  },
  {
    path: "/admin/interviews",
    title: "Interviews",
    breadcrumb: [{ name: "Interviews", path: "/admin/interviews" }],
  },
  {
    path: "/admin/users",
    title: "Users",
    breadcrumb: [{ name: "Users", path: "/admin/users" }],
  },
];

export const pageIcons: { [key: string]: { icon: string; color: string } } = {
  "/ia/dashboard": {
    icon: "solar:spedometer-low-outline",
    color: "success",
  },
  "/ia/interviews": {
    icon: "solar:user-speak-bold",
    color: "primary",
  },
  "/ia/results": { icon: "tabler:report-analytics", color: "secondary" },
  "/ia/invoices": { icon: "tabler:file-invoice", color: "success" },
  "/ia/me/update/profile": { icon: "tabler:user-circle", color: "warning" },
  "/ia/me/update/password": { icon: "tabler:password-user", color: "default" },
  "/ia/unsubscribe": { icon: "tabler:octagon-minus", color: "danger" },

  "/admin/dashboard": {
    icon: "solar:spedometer-low-outline",
    color: "success",
  },
  "/admin/interviews": {
    icon: "solar:user-speak-bold",
    color: "primary",
  },
  "/admin/users": {
    icon: "solar:users-group-two-rounded-bold",
    color: "secondary",
  },
};
