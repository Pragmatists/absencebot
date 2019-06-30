import { RecurrenceRule, scheduleJob } from 'node-schedule';
import { absenceResponse } from './absenceResponse';
import { catchError, flatMap, tap } from 'rxjs/operators';
import { SlackAPI } from './slack/SlackAPI';
import { of } from 'rxjs';

const rule = new RecurrenceRule();
rule.dayOfWeek = [1, 2, 3, 4, 5];
rule.hour = 6;
rule.minute = 0;

const postAbsencesMessage = () => {
  console.log(new Date(), 'posting daily message');
  absenceResponse().pipe(
      flatMap(message => SlackAPI.instance.post(message)),
      tap(response => console.log(new Date(), 'posted daily message, res: ', response)),
      catchError(e => {
        console.error(new Date(), 'failed to post daily message, res: ', e);
        return of(undefined);
      })
  ).subscribe();
};

console.log(new Date(), 'scheduled post daily message');

scheduleJob(rule, postAbsencesMessage);
