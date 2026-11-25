// Shared homepage content. Endpoints and URLs are example data.

// TODO: point these at real routes once import and auth exist.
export const IMPORT_HREF = "#"
export const SIGN_IN_HREF = "#"

export const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Example", href: "#example" },
]

export const SERVER_URL = "https://mcp.apimint.example/s/bookings"

export const ENDPOINTS = [
  { method: "GET", path: "/bookings", tool: "list_bookings" },
  { method: "GET", path: "/customers", tool: "list_customers" },
  { method: "POST", path: "/bookings", tool: "create_booking" },
  { method: "DELETE", path: "/bookings/{id}", tool: "delete_booking" },
] as const

export const METHOD_COLORS = {
  GET: "text-leaf",
  POST: "text-method-post",
  DELETE: "text-destructive",
}
