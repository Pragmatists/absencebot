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

  if (!date) {
    respondWithText(res, 'I did not understand the date format. Check `/absence` for help');
  }
  else if (!tagIntent) {
    respondWithText(res, 'Tag required. Check `/absence` for help');
  }
  if (intent.split('#').length - 1 > 1) {
    respondWithText(res, 'Multi tags are not supported. Check /absence for help.');
  }
  else if (!tag[tagIntent]) {
    respondWithText(res, 'Tag is not supported. Check /absence for help.');
  }
  else {
    MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, async (err, client) => {
      axios.get('https://slack.com/api/users.info', {
        params: { user: req.body.user_id },
        headers: { Authorization: process.env.AUTH_TOKEN }
      })
        .then(response => {
          if(response.data.ok === false) {
            respondWithText(res, 'There was an error trying to access Slack API! Please contact the maintainer.');
            console.log('Slack API call failed', response.data);
            return;
          }
          const db = client.db(process.env.DB_NAME);
          const email = response.data.user.profile.email;
          const userName = email.substring(0, email.indexOf('@'));
          db.collection('absences').save({
            _id: {
              _id: `WL.${uuid.v4().replace(new RegExp('-', 'g'), '')}`
            },
            employeeID: {
              _id: userName
            },
            day: {
              date: date
            },
            workload: {
              minutes: tag[tagIntent].workload
            },
            projectNames: [
              { name: tagIntent }
            ],
            note: {
              text: note
            },
            submittedBy: 'absencebot'
          }, (err, result) => {
            if (err) {
              console.log(err);
              respondWithText(res, 'Unexpected error occurred!')
            }
            if (tagIntent === 'sick') {
              respondWithText(res, 'I got it. Feel better soon!')
            }
            else {
              respondWithText(res, 'Alright, noted.');
            }
          })
        })
        .catch(err => {console.log('Error occured during registration ', err)});
    });
  }

};

const tag = {
  remote: {
    workload: 0
  },
  sick: {
    workload: 480
  },
  vacation: {
    workload: 480
  },
  holiday: {
    workload: 480
  },
};

const respondWithText = (res, text) => {
  res.status(200).json({
    text: text,
    response_type: 'ephemeral',
    mrkdwn: true
  });
};

module.exports = registerCommand;