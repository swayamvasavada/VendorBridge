const remoteBaseURL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://zhl2kcpp-5000.inc1.devtunnels.ms";

// Vite proxies /api in development, avoiding browser CORS restrictions.
export const baseURL = import.meta.env.DEV ? "" : remoteBaseURL;

export const Login = `${baseURL}/api/auth/login`;
export const forgotPassword = `${baseURL}/api/auth/request-reset-password`;
export const vendorRegistration = `${baseURL}/api/auth/vendor-registration`;
export const verifyEmail = `${baseURL}/api/auth/verify`;
