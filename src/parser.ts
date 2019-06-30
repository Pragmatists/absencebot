import * as moment from 'moment';
import { dateFormat } from './time';

export const parseIntentForSign = (sign: string, intent: string, breaker = ' ') => {
  const indexOfSign = intent.indexOf(sign);
  if (indexOfSign < 0) {
    return '';
  }
  const start = indexOfSign + 1;
  const indexOfNextSpace = intent.indexOf(breaker, start);
  return intent.substring(start, indexOfNextSpace > 0 ? indexOfNextSpace : undefined)
};

export const parseDateIntent = (dateIntent) => {
  if (dateIntent === 'today') {
    return moment()
  } else if (dateIntent === 'tomorrow') {
    return moment().add(1, 'days');
  } else if (dateIntent.includes('/')) {
    return moment(dateIntent, dateFormat);
  }
};
