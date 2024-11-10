import axios, {
  Method,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';

type config = {
  headers: { [key: string]: string };
};

type invokeParams = {
  method: Method;
  endpoint: string;
  data?: unknown;
  isStream?: boolean;
  isAdmin?: boolean;
  options?: AxiosRequestConfig;
};

export type InvokeResponse<T> = Promise<{
  res: T | null;
  status?: number | undefined;
  error: string | null;
}>;

export async function invoke<T>({
  method,
  endpoint,
  data,
  isStream,
  isAdmin = true,
  options,
}: invokeParams): InvokeResponse<T> {
  const config: config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4500',
      'Access-Control-Allow-Credentials': 'true',
    },
  };

  const token = isAdmin
    ? Cookies.get('_auth_token')
    : Cookies.get('_user_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (isStream) {
    config.headers.Range = 'bytes=0-';
  }

  const baseUrl = 'http://localhost:4500/api/v1';
  const requestURL = `${baseUrl}${endpoint}`;

  const { headers: optionHeaders, ...opts } = options || {};

  try {
    const { data: res, status }: AxiosResponse = await axios({
      method,
      url: requestURL,
      data,
      headers: {
        ...config.headers,
        ...optionHeaders,
      },
      withCredentials: true,
      ...opts,
    });

    return { res, status, error: null };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error?.response) {
        if (error.response.data.message || error.response.data.detail) {
          const message =
            error.response.data.message || error.response.data.detail;
          return {
            res: null,
            status: error.response.status,
            error: message,
          };
        }

        return {
          res: null,
          status: error.response.status,
          error: error.response.data,
        };
      } else if (error.request) {
        return {
          res: null,
          status: error.response?.status,
          error: 'Error: No response received from the request',
        };
      } else {
        return {
          res: null,
          status: error.response?.status,
          error: error.message,
        };
      }
    }

    return {
      res: null,
      status: 500,
      error: 'An error occurred',
    };
  }
}
