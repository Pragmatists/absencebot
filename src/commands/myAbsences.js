const moment = require('moment');
const time = require('../time');
const AbsenceRepository = require('../absenceRepository');

const myAbsences = (req, res, intent) => {

  AbsenceRepository.loadByUser(req.body.user_name, (err, result) => {
    const entriesText = result
      .filter(entry => moment(entry.date, time.dateFormat).diff(moment().format(time.dateFormat), 'days') >= 0)
      .reduce((acc, entry) => {
        return acc + `- *${entry.employeeID._id}* #${_.join(entry.projectNames.map(tag => tag.name))} ${note(entry.note.text)}\n`
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

module.exports = myAbsences;
