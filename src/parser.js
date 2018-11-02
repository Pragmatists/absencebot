const moment = require('moment');
const time = require('./time');

const parseIntentForSign = (sign, intent, breaker = ' ') => {
  const indexOfSign = intent.indexOf(sign);
  const start = indexOfSign + 1;

  if (indexOfSign < 0) {
    return '';
  }

  const indexOfNextSpace = intent.indexOf(breaker, start);
  return intent.substring(start, indexOfNextSpace > 0 ? indexOfNextSpace : undefined)
};

const parseDateIntent = (dateIntent) => {
  if (dateIntent === 'today') {
    return moment().format(time.dateFormat)
  }
  else if (dateIntent === 'tomorrow') {
    return moment().add(1, 'days').format(time.dateFormat);
  }
  else if (dateIntent.includes('/')) {
    return moment(dateIntent, time.dateFormat).format(time.dateFormat);
  }
};

module.exports = {
  parseIntentForSign,
  parseDateIntent
};