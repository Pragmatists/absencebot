import { Observable, of } from 'rxjs';
import { catchError, flatMap, map, mapTo } from 'rxjs/operators';
import * as moment from 'moment';
import { parseIntentForSign, parseDateIntent } from '../parser';
import { SlackAPI } from '../slack/SlackAPI';
import { OpenTrappAPI } from '../openTrapp/OpenTrappAPI';
import { dateFormat } from '../time';
import { Command } from './Command';
import { supportedTags } from '../tag';

export class RegisterCommand extends Command {
  protected handleRequest(intent: string, userId: string): Observable<string> {
    const tagIntent = parseIntentForSign('#', intent);
    const dateIntent = parseIntentForSign('@', intent);
    const date = parseDateIntent(dateIntent);
    const note = parseIntentForSign('"', intent, '"');
    if (!date) {
      return of('I did not understand the date format. Check `/absence` for help.');
    } else if (!tagIntent) {
      return of('Tag required. Check `/absence` for help.');
    }
    if (intent.split("#").length - 1 > 1) {
      return of('Multi tags are not supported. Check /absence for help.');
    } else if (!supportedTags.includes(tagIntent)) {
      return of('Tag is not supported. Check /absence for help.');
    } else {
      return this.register(userId, date, tagIntent, note);
    }
  }

  private register(userId: string, date: moment.Moment, tagIntent: string, note?: string) {
    return SlackAPI.instance.userEmail(userId).pipe(
        map(email => email.substring(0, email.indexOf('@'))),
        flatMap(username => OpenTrappAPI.instance.registerAbsence(username, {
          day: date.format(dateFormat),
          projectNames: [tagIntent],
          workload: RegisterCommand.workloadForTag(tagIntent),
          note: note
        })),
        mapTo(tagIntent === 'sick' ? 'I got it. Feel better soon!' : 'Alright, noted.'),
        catchError(e => {
          console.log(e);
          return of('Unexpected error occurred!');
        })
    );
  }

  private static workloadForTag(tag: string): string {
    return tag === 'remote' ? '0m' : '1d';
  }
}
