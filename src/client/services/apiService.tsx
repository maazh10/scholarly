import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL =
  process.env.PROD_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001/api";

class ApiService {
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_URL,
    });
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, {
      withCredentials: true,
      ...config,
    });
    return response.data;
  }

  public async post<T, R>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    const response: AxiosResponse<R> = await this.instance.post(url, data, {
      withCredentials: true,
      ...config,
    });
    return response.data;
  }

  public async put<T, R>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    const response: AxiosResponse<R> = await this.instance.put(url, data, {
      withCredentials: true,
      ...config,
    });
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, {
      withCredentials: true,
      ...config,
    });
    return response.data;
  }
}

const apiService = new ApiService();

export default apiService;
