import { RecurrenceRule, scheduleJob } from 'node-schedule';
import { absenceResponse } from './absenceResponse';
import { catchError, flatMap, tap } from 'rxjs/operators';
import { SlackAPI } from './slack/SlackAPI';
import { of } from 'rxjs';
import * as moment from 'moment-timezone';

const rule = new RecurrenceRule();
rule.dayOfWeek = [0, 1, 2, 3, 4];
rule.hour = 14;
rule.minute = 0;

const postAbsencesMessage = () => {
  console.log(new Date(), 'posting daily message');
  absenceResponse(moment().tz('Europe/Warsaw').add(1, 'days')).pipe(
      flatMap(message => SlackAPI.instance.post(message)),
      tap(response => console.log(new Date(), 'posted daily afternoon message, res: ', response)),
      catchError(e => {
        console.error(new Date(), 'failed to post daily afternoon message, res: ', e);
        return of(undefined);
      })
  ).subscribe();
};

console.log(new Date(), 'scheduled post daily morning message');

scheduleJob(rule, postAbsencesMessage);
