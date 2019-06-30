import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RegisterAbsenceDTO, AbsenceDTO } from './openTrappModel';
import * as moment from 'moment';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export class OpenTrappAPI {
  static readonly API_ROOT_URL = `${process.env.OPEN_TRAPP_API_URL}/api/v1`;
  private static readonly API_CLIENT_ID = process.env.OPEN_TRAPP_CLIENT_ID;
  private static readonly API_SECRET = process.env.OPEN_TRAPP_SECRET;
  private static _instance: OpenTrappAPI;
  private readonly axiosInstance: AxiosInstance;
  private readonly axiosTokenInstance: AxiosInstance;

  constructor() {
    this.axiosTokenInstance = axios.create({
      baseURL: OpenTrappAPI.API_ROOT_URL
    });
    this.axiosInstance = axios.create({
      baseURL: OpenTrappAPI.API_ROOT_URL
    });
    this.axiosInstance.interceptors.request.use(
        this.decorateRequestWithAuthToken,
        err => Promise.reject(err)
    );
  }

  findAbsencesForDate(date: moment.Moment, tags: string[]): Observable<AbsenceDTO[]> {
    const params = {date: date.format('YYYY-MM-DD'), tags: tags.join(',')}
    return from(this.axiosInstance.get<AbsenceDTO[]>('/admin/work-log/entries', {params})).pipe(
        map(axiosResp => axiosResp.data)
    );
  }

  findAbsencesAfterDate(date: moment.Moment, tags: string[], user: string): Observable<AbsenceDTO[]> {
    const params = {user, dateFrom: date.format('YYYY-MM-DD'), tags: tags.join(',')};
    return from(this.axiosInstance.get<AbsenceDTO[]>('/admin/work-log/entries', {params})).pipe(
        map(axiosResp => axiosResp.data)
    );
  }

  registerAbsence(username: string, dto: RegisterAbsenceDTO): Observable<{id: string}> {
    return from(this.axiosInstance.post<{id: string}>(`/admin/work-log/${username}/entries`, dto)).pipe(
        map(axiosResp => axiosResp.data)
    );
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
      clientID: OpenTrappAPI.API_CLIENT_ID,
      secret: OpenTrappAPI.API_SECRET
    }).then(axiosResp => axiosResp.data.token);
  }

  static get instance(): OpenTrappAPI {
    if (!OpenTrappAPI._instance) {
      OpenTrappAPI._instance = new OpenTrappAPI();
    }
    return OpenTrappAPI._instance;
  }
}
