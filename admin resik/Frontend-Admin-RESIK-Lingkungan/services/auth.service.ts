const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Helper fetch dengan auto-attach token dari localStorage
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('resik_admin_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Terjadi kesalahan');
  }

  return data;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminRegisterPayload {
  nama: string;
  email: string;
  telepon: string;
  password: string;
}

export interface AdminUser {
  id: number;
  nama: string;
  email: string;
  role: string;
}

const REMEMBER_ADMIN_KEY = 'resik_admin_remember_me';
const REMEMBERED_ADMIN_EMAIL_KEY = 'resik_admin_remembered_email';

export function getRememberedAdminLogin(): {
  remember: boolean;
  email: string;
} {
  if (typeof window === 'undefined') return { remember: false, email: '' };
  const remember = localStorage.getItem(REMEMBER_ADMIN_KEY) === 'true';
  return {
    remember,
    email: remember
      ? localStorage.getItem(REMEMBERED_ADMIN_EMAIL_KEY) ?? ''
      : '',
  };
}

export function saveRememberedAdminLogin(email: string, remember: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REMEMBER_ADMIN_KEY, String(remember));
  if (remember && email.trim()) {
    localStorage.setItem(REMEMBERED_ADMIN_EMAIL_KEY, email.trim());
  } else {
    localStorage.removeItem(REMEMBERED_ADMIN_EMAIL_KEY);
  }
}

/**
 * Login admin
 */
export async function loginAdmin(payload: AdminLoginPayload): Promise<{ data: AdminUser; token: string }> {
  const result = await apiFetch('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  // Simpan token
  if (typeof window !== 'undefined') {
    localStorage.setItem('resik_admin_token', result.token);
    localStorage.setItem('resik_admin_user', JSON.stringify(result.data));
  }
  return result;
}

/**
 * Membuat akun admin baru dari sesi admin yang sudah terautentikasi.
 */
export async function registerAdmin(
  payload: AdminRegisterPayload,
): Promise<{ data: AdminUser; message: string }> {
  return apiFetch('/auth/admin/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Logout admin
 */
export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('resik_admin_token');
    localStorage.removeItem('resik_admin_user');
  }
}

/**
 * Get current admin dari localStorage
 */
export function getCurrentAdmin(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('resik_admin_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

/**
 * Cek apakah admin sudah login
 */
export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('resik_admin_token');
}

export { apiFetch };
export default {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  getCurrentAdmin,
  isAdminLoggedIn,
  getRememberedAdminLogin,
  saveRememberedAdminLogin,
};
