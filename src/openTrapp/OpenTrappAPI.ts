import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RegisterAbsenceDTO, WorkLogDTO } from './openTrappModel';
import * as moment from 'moment';


class OpenTrapp {
  static readonly API_ROOT_URL = `${process.env.OPEN_TRAPP_API_URL}/api/v1`;
  private static readonly API_CLIENT_ID = process.env.OPEN_TRAPP_CLIENT_ID;
  private static readonly API_SECRET = process.env.OPEN_TRAPP_SECRET;
  private readonly axiosInstance: AxiosInstance;
  private readonly axiosTokenInstance: AxiosInstance;

  constructor() {
    this.axiosTokenInstance = axios.create({
      baseURL: OpenTrapp.API_ROOT_URL
    });
    this.axiosInstance = axios.create({
      baseURL: OpenTrapp.API_ROOT_URL
    });
    this.axiosInstance.interceptors.request.use(
        this.decorateRequestWithAuthToken,
        err => Promise.reject(err)
    );
  }

  findAbsencesForDate(date: moment.Moment, tags: string[]): Promise<WorkLogDTO[]> {
    return this.axiosInstance.get<WorkLogDTO[]>(
        '/admin/work-log/entries',
        {params: {date: date.format('YYYY-MM-DD'), tags: tags.join(',')}}
    ).then(axiosResp => axiosResp.data);
  }

  findAbsencesAfterDate(date: moment.Moment, tags: string[], user: string): Promise<WorkLogDTO[]> {
    return this.axiosInstance.get<WorkLogDTO[]>(
        '/admin/work-log/entries',
        {params: {user, dateFrom: date.format('YYYY-MM-DD'), tags: tags.join(',')}}
    ).then(axiosResp => axiosResp.data);
  }

  registerAbsence(username: string, dto: RegisterAbsenceDTO): Promise<{id: string}> {
    return this.axiosInstance.post<{id: string}>(`/admin/work-log/${username}/entries`, dto)
        .then(axiosResp => axiosResp.data);
  }

  private decorateRequestWithAuthToken = (config: AxiosRequestConfig) => {
    return this.obtainApiToken()
        .then(token => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        })
  };

  private obtainApiToken(): Promise<string> {
    return this.axiosTokenInstance.post<{token: string}>('/authentication/service-token', {
      clientID: OpenTrapp.API_CLIENT_ID,
      secret: OpenTrapp.API_SECRET
    }).then(axiosResp => axiosResp.data.token);
  }
}

export const OPEN_TRAPP_API_URL = OpenTrapp.API_ROOT_URL;
export const OpenTrappAPI = new OpenTrapp();
