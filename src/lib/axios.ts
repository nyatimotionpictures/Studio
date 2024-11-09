import axios, {
  Method,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosRequestHeaders,
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

interface InvokeResponse {
  res: unknown | null;
  status: number;
  headers: AxiosRequestHeaders | null;
  error: Error | string | null;
}

export async function invoke({
  method,
  endpoint,
  data,
  isStream,
  isAdmin = true,
  options,
}: invokeParams) {
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
    const {
      data: res,
      status,
      headers,
    }: AxiosResponse = await axios({
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

    return { res, status, headers, error: null };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error?.response) {
        if (error.response.data.message) {
          return {
            res: null,
            headers: error.response.headers ?? null,
            status: 500,
            error: new Error(error.response.data.message),
          };
        }

        return { res: null, status: 500, error: error.response.data };
      } else if (error.request) {
        return {
          res: null,
          headers: error.response?.headers ?? null,
          status: 500,
          error: 'Error: No response received from the request',
        };
      } else {
        return {
          res: null,
          headers: error.response?.headers ?? null,
          status: 500,
          error: error.message,
        };
      }
    }
  }
}
