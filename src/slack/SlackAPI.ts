import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface UserInfoDTO {
  data: {
    user: {
      profile: {
        email: string;
      }
    }
  }
}

class Slack {
  static readonly API_ROOT_URL = 'https://slack.com/api';
  private static AUTH_TOKEN = process.env.SLACK_AUTH_TOKEN;
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: Slack.API_ROOT_URL
    });
    this.axiosInstance.interceptors.request.use(
        this.decorateRequestWithAuthToken,
        err => Promise.reject(err)
    );
  }

  userInfo(userId: string): Promise<UserInfoDTO> {
    return this.axiosInstance.get<UserInfoDTO>('/users.info', {params: {user: userId}})
        .then(axiosResp => axiosResp.data);
  }

  private decorateRequestWithAuthToken = (config: AxiosRequestConfig) => {
    const token = Slack.AUTH_TOKEN;
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };
}

export const SLACK_API_URL = Slack.API_ROOT_URL;
export const SlackAPI = new Slack();
