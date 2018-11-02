const moment = require('moment');
const time = require('./time');

const parseIntentForSign = (sign, intent, breaker = ' ') => {
  const indexOfSign = intent.indexOf(sign) + 1;
  const indexOfNextSpace = intent.indexOf(breaker, indexOfSign);
  return intent.substring(indexOfSign, indexOfNextSpace > 0 ? indexOfNextSpace : undefined)
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