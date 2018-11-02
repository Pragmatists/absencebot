const MongoClient = require('mongodb').MongoClient;
const absenceResponse = require('./absenceResponse');
const moment = require('moment');

const dateFormat = 'YYYY/MM/DD';

const absenceController = (req, res) => {

  const intent = req.body.text;

  if (!intent.length) {
    respondWithText(res, helpMessage());
  } else if (intent === 'status') {
    absenceResponse((text) => respondWithText(res, text));
  }
  else {
    const tagIntent = parseIntentForSign('#', intent);
    const dateIntent = parseIntentForSign('@', intent);
    const date = parseDateIntent(dateIntent);
    const note = parseIntentForSign('"', intent, '"');

    if (!date || !tagIntent) {
      respondWithText(res, 'Sorry I did not get that. Check `/absence` for help');
    }
    else {
      MongoClient.connect(process.env.DB_URI, (err, client) => {
        const db = client.db('absencebot');
        db.collection('absences').save({
          user: req.body.user_name,
          date: date,
          tag: tagIntent,
          note: note
        }, (err, result) => {
          if (tagIntent === 'sick') {
            respondWithText(res, 'I got it. Feel better soon!')
          }
          else {
            respondWithText(res, 'Alright, noted.');
          }
        })
      });
    }
  }
};

const helpMessage = () => {
  return `*Absence bot help:*\n
  *Want to check who's out today?* \`/absence status\`\n
  *Registering absence:*
  *Supported tags:* #vacation #sick
  *Supported date formats:* @today @tomorrow @YYYY/MM/DD
  *You can attach a note wrapping it in double quotes.*
  *Example1*: \`/absence #vacation @tomorrow\`
  *Example2*: \`/absence #sick @today\`
  *Example3*: \`/absence #vacation @2018/11/02 "I'll be there after lunch."\``;
};

const parseIntentForSign = (sign, intent, breaker = ' ') => {
  const indexOfSign = intent.indexOf(sign) + 1;
  const indexOfNextSpace = intent.indexOf(breaker, indexOfSign);
  return intent.substring(indexOfSign, indexOfNextSpace > 0 ? indexOfNextSpace : undefined)
};

const parseDateIntent = (dateIntent) => {
  if (dateIntent === 'today') {
    return moment().format(dateFormat)
  }
  else if (dateIntent === 'tomorrow') {
    return moment().add(1, 'days').format(dateFormat);
  }
  else if (dateIntent.contains('/')) {
    return moment(dateIntent, dateFormat).format(dateFormat);
  }
};

const respondWithText = (res, text) => {
  res.status(200).json({
    text: text,
    response_type: 'ephemeral',
    mrkdwn: true
  });
};

module.exports = absenceController;