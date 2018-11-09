const parseIntentForSign = require('../parser').parseIntentForSign;
const parseDateIntent = require('../parser').parseDateIntent;
const MongoClient = require('mongodb').MongoClient;
const uuid = require('uuid');
const _ = require('lodash');

const registerCommand = (req, res, intent) => {
  const tagIntent = parseIntentForSign('#', intent);
  const dateIntent = parseIntentForSign('@', intent);
  const date = parseDateIntent(dateIntent);
  const note = parseIntentForSign('"', intent, '"');


  if(!date) {
    respondWithText(res, 'I did not understand the date format. Check `/absence` for help');
  }
  else if (!tagIntent) {
    respondWithText(res, 'I did not understand the tag. Check `/absence` for help');
  }
  else {
    console.log('body', req.body)
    MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
      const db = client.db(process.env.DB_NAME);
      db.collection('absences').save({
        _id: {
          _id: `WL.${uuid.v4().replace(new RegExp('-', 'g'), '')}`
        },
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

};

const respondWithText = (res, text) => {
  res.status(200).json({
    text: text,
    response_type: 'ephemeral',
    mrkdwn: true
  });
};

module.exports = registerCommand;