const moment = require('moment');
const time = require('../time');
const AbsenceRepository = require('../absenceRepository');

const statusCommand = (req, res, intent) => {

  AbsenceRepository.loadByUser(req.body.user_name, (err, result) => {
    const entriesText = result
      .filter(entry => moment(entry.date, time.dateFormat).diff(moment().format(time.dateFormat), 'days') >= 0)
      .reduce((acc, entry) => {
        return acc + `- *${entry.date}* #${entry.tag} ${note(entry.note)}\n`
      }, '');
    respondWithText(res, `*Your absences:*\n${entriesText}`);
  });
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

module.exports = statusCommand;
