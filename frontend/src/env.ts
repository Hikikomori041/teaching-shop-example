const DEFAULT_HOST = "35.180.57.114";

export const API_BASE =
	import.meta.env.VITE_API_BASE ?? `http://${DEFAULT_HOST}:5000/api`;

export const ADMIN_BASE_URL =
	import.meta.env.VITE_ADMIN_BASE ?? `http://${DEFAULT_HOST}:5000/admin/`;