import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Flag to track ongoing token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Request Interceptor: Automatically injects Authorization header
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Seamless Silent Token Refresh & Auto-Logout
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If no response or not a 401 error, pass through
    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    // Do not attempt refresh on auth entry endpoints to prevent infinite loops
    if (
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/auth/register") ||
      requestUrl.includes("/api/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // Prevent retrying more than once
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      // No refresh token available &rarr; force logout
      handleForcedLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If a refresh is already in progress, enqueue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call backend token rotation endpoint
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/refresh-token`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const newAccessToken = data.token;
      const newRefreshToken = data.refreshToken;

      // Update stored tokens
      localStorage.setItem("authToken", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      processQueue(null, newAccessToken);
      return apiClient(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr as Error, null);
      handleForcedLogout();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * Clears local state and redirects cleanly to login when session expires (after 7 days)
 */
const handleForcedLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userRole");

  // Trigger storage event so all tabs react synchronously
  window.dispatchEvent(new Event("storage"));

  // Only redirect if not already on login or public pages
  if (
    !window.location.pathname.startsWith("/login") &&
    !window.location.pathname.startsWith("/register") &&
    !window.location.pathname.startsWith("/verify-email") &&
    window.location.pathname !== "/"
  ) {
    window.location.href = "/login?expired=1";
  }
};

export default apiClient;
