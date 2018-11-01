const MongoClient = require('mongodb').MongoClient;
const absenceResponse = require('./absenceResponse');
const moment = require('moment');

const absenceController = (req, res) => {

  let responseText;

  const intent = req.body.text;

  if (!intent.length) {
    responseText = helpMessage();
  } else if (intent === 'status') {
    responseText = absenceResponse()
  }
  else {
    const tagIntent = parseIntentForSign('#', intent);
    const dateIntent = parseIntentForSign('@', intent);
    const date = parseDateIntent(dateIntent);

    if(!date || !tagIntent) {
      responseText = 'Sorry I did not get that. Check `/absence` for help';
    }
    else {


      if(tagIntent === 'sick') {
        responseText = 'I got it. Feel better soon!';
      }
      else {
        responseText = 'Alright, noted.';
      }
    }
  }

  res.status(200).json({
    text: responseText,
    response_type: 'ephemeral',
    mrkdwn: true
  });
};

const helpMessage = () => {
  return `*Absence bot help:*\n
  *Want to check who's out today?* \`/absence status\`\n
  *Supported tags:* #vacation #sick\n
  *Supported date formats:* @today @tomorrow\n
  *Example1*: \`/absence #vacations @tomorow\`\n
  *Example2*: \`/absence #sick @today\``;
};

const parseIntentForSign = (sign, intent) => {
  const indexOfSign = intent.indexOf(sign) + 1;
  const indexOfNextSpace = intent.indexOf(' ', indexOfSign);
  return intent.substring(indexOfSign, indexOfNextSpace > 0 ? indexOfNextSpace : undefined)
};

const parseDateIntent = (dateIntent) => {
  if (dateIntent === 'today') {
    return moment()
  }
  else if (dateIntent === 'tomorow') {
    return moment().add(1, 'days');
  }
};


// MongoClient.connect('mongodb://localhost:27017/animals', function (err, client) {
//   if (err) throw err
//
//   var db = client.db('animals')
//
//   db.collection('mammals').find().toArray(function (err, result) {
//     if (err) throw err
//
//     console.log(result)
//   })
// })

module.exports = absenceController;