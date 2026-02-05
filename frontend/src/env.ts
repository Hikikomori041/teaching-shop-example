const DEFAULT_HOST = typeof window !== "undefined" ? window.location.hostname : "localhost";

export const API_BASE =
	import.meta.env.VITE_API_BASE ?? `http://${DEFAULT_HOST}:5000/api`;

export const ADMIN_BASE_URL =
	import.meta.env.VITE_ADMIN_BASE ?? `http://${DEFAULT_HOST}:5000/admin/`;