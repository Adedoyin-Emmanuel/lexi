import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface QueuedRequest {
  resolve: (value: AxiosResponse) => void;
  reject: (reason: unknown) => void;
  config: InternalAxiosRequestConfig;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const Axios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      Axios(request.config).then(request.resolve).catch(request.reject);
    }
  });
  failedQueue = [];
};

Axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
          config: originalRequest,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await Axios.post("/auth/refresh-token", {}, {
        withCredentials: true,
        _retry: true,
      } as CustomAxiosRequestConfig);

      if (refreshResponse.data.data.accessToken) {
        localStorage.setItem(
          "accessToken",
          refreshResponse.data.data.accessToken
        );
      }

      processQueue();

      return Axios(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
