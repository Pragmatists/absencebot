import { parseDateIntent, parseIntentForSign } from '../parser';
import { absenceResponse } from '../absenceResponse';
import { Command } from './Command';
import { Observable, of } from 'rxjs';

export class StatusCommand extends Command {
  protected handleRequest(intent: string, userId: string): Observable<string> {
    if (intent.includes('@')) {
      const dateIntent = parseIntentForSign('@', intent);
      const date = parseDateIntent(dateIntent);
      if (!date) {
        return of('I did not understand the date format. Check `/absence` for help.');
      } else {
        return absenceResponse(date);
      }
    }
    return absenceResponse();
  }
}
