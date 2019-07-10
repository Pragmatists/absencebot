import * as moment from 'moment';
import { dateFormat } from './time';

export function parseIntentForSign(sign: string, intent: string, breaker = ' ') {
  const indexOfSign = intent.indexOf(sign);
  if (indexOfSign < 0) {
    return '';
  }
  const start = indexOfSign + 1;
  const indexOfNextSpace = intent.indexOf(breaker, start);
  return intent.substring(start, indexOfNextSpace > 0 ? indexOfNextSpace : undefined)
}

export function parseDateIntent(dateIntent: string): moment.Moment | undefined {
  if (dateIntent === 'today') {
    return moment()
  } else if (dateIntent === 'tomorrow') {
    return moment().add(1, 'days');
  } else if (dateIntent.match(/\d{4}\/\d{1,2}\/\d{1,2}/)) {
    return moment(dateIntent, dateFormat);
  }
  return undefined;
}
