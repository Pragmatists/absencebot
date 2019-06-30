import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface UserInfoDTO {
  user: {
    id: string;
    profile: {
      email: string;
      first_name: string;
      last_name: string;
    }
  }
}

export class SlackAPI {
  static readonly API_ROOT_URL = 'https://slack.com/api';
  private static readonly AUTH_TOKEN = process.env.SLACK_AUTH_TOKEN;
  private static _instance: SlackAPI;
  private readonly axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: SlackAPI.API_ROOT_URL
    });
    this.axiosInstance.interceptors.request.use(
        this.decorateRequestWithAuthToken,
        err => Promise.reject(err)
    );
  }

  userInfo(userId: string): Observable<UserInfoDTO> {
    return from(this.axiosInstance.get<UserInfoDTO>('/users.info', {params: {user: userId}})).pipe(
        map(axiosResp => axiosResp.data)
    );
  }

  userEmail(userId: string): Observable<string> {
    return this.userInfo(userId).pipe(
        map(userInfo => userInfo.user.profile.email)
    );
  }

  post(message: string): Observable<any> {
    return from(axios.post(process.env.SLACK_HOOK, {text: message, mrkdwn: true})).pipe(
        map(axiosResp => axiosResp.data)
    );
  }

  private decorateRequestWithAuthToken = (config: AxiosRequestConfig) => {
    const token = SlackAPI.AUTH_TOKEN;
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  static get instance(): SlackAPI {
    if (!SlackAPI._instance) {
      SlackAPI._instance = new SlackAPI();
    }
    return SlackAPI._instance;
  }
}
