const parseIntentForSign = require('../parser').parseIntentForSign;
const parseDateIntent = require('../parser').parseDateIntent;
const uuid = require('uuid');
const _ = require('lodash');
const axios = require('axios');
const AbsenceRepository = require('../absenceRepository');
const tag = require('../tag');

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
  if (intent.split("#").length - 1 > 1) {
    respondWithText(res, 'Multi tags are not supported. Check /absence for help.');
  }
  else if (!tag[tagIntent]) {
    respondWithText(res, 'Tag is not supported. Check /absence for help.');
  }
  else {
    axios.get('https://slack.com/api/users.info', {
      params: { user: req.body.user_id },
      headers: { Authorization: process.env.AUTH_TOKEN }
    })
      .then(userInfo => {
        const email = userInfo.data.user.profile.email;
        const userName = email.substring(0, email.indexOf('@'));

        AbsenceRepository.save({
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
        });
      })
      .catch(error => {
        console.log(error);
        respondWithText(res, 'Unexpected error occurred!')
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