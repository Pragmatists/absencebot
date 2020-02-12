import * as moment from 'moment-timezone';
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
    return moment().tz('Europe/Warsaw')
  } else if (dateIntent === 'tomorrow') {
    return moment().tz('Europe/Warsaw').add(1, 'days');
  } else if (dateIntent.match(/\d{4}\/\d{1,2}\/\d{1,2}/)) {
    return moment(dateIntent, dateFormat).tz('Europe/Warsaw');
  }
  return undefined;
}
