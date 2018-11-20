const moment = require('moment');
const time = require('../time');
const AbsenceRepository = require('../absenceRepository');
const tag = require('../tag');
const axios = require('axios');
const _ = require('lodash');


const myAbsences = (req, res, intent) => {
  axios.get('https://slack.com/api/users.info', {
    params: { user: req.body.user_id },
    headers: { Authorization: process.env.AUTH_TOKEN }
  })
    .then(userInfo => {
      const email = userInfo.data.user.profile.email;
      const userName = email.substring(0, email.indexOf('@'));

      AbsenceRepository.loadByUser(userName, (err, result) => {
        if (err) {
          console.log(err);
        }
        const entriesText = result
        .filter(filterBySupportedTags)
        .filter(entry => moment(entry.day.date, time.dateFormat).diff(moment().format(time.dateFormat), 'days') >= 0)
          .reduce((acc, entry) => {
            return acc + `*${entry.day.date}* #${_.join(entry.projectNames.map(tag => tag.name))} ${note(_.get(entry, 'note.text', undefined))}\n`
          }, '');
        respondWithText(res, `*Your absences:*\n${entriesText}`);
      });
    })
    .catch(error => {
      console.log(error);
      respondWithText(res, 'Unexpected error occurred!')
    });
};

const filterBySupportedTags = (entry) => {
  return _.some(entry.projectNames, projectName => tag[projectName.name]);
};

const note = (noteText) => {
  return (!noteText || !noteText.length) ? '' : `_note: ${noteText}_`;
};

const respondWithText = (res, text) => {
  res.status(200).json({
    text: text,
    response_type: 'ephemeral',
    mrkdwn: true
  });
};

module.exports = myAbsences;
