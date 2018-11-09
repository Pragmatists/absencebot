const parseIntentForSign = require('../parser').parseIntentForSign;
const parseDateIntent = require('../parser').parseDateIntent;
const MongoClient = require('mongodb').MongoClient;
const uuid = require('uuid');
const _ = require('lodash');
const axios = require('axios');

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
    MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, async (err, client) => {
      const userInfo = await axios.get('https://slack.com/api/users.info', {params: {user: req.body.user_id},headers: {Authorization: 'Bearer xoxp-2181358781-137998587217-475918326482-4962f0a65c73d0638d609895ad6630a2'}});
      const db = client.db(process.env.DB_NAME);
      const email = userInfo.data.user.profile.email;
      const userName = email.substring(0, email.indexOf('@'));
      db.collection('absences').save({
        _id: {
          _id: `WL.${uuid.v4().replace(new RegExp('-', 'g'), '')}`
        },
        employeeID: {
          _id: userName
        },
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