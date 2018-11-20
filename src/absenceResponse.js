const moment = require('moment');
const time = require('./time');
const _ = require('lodash');
const AbsenceRepository = require('./absenceRepository');
const tag = require('./tag');

const absenceResponse = (callback, date = moment().format(time.dateFormat)) => {

  AbsenceRepository.loadByDate(date,
    (err, result) => {
    if(err) {
      console.log('err', err);
    }
      const entriesText = result
        .filter(filterBySupportedTags)
        .reduce((acc, entry) => {
        return acc + `- *${entry.employeeID._id}* #${_.join(entry.projectNames.map(tag => tag.name))} ${note(_.get(entry, 'note.text', undefined))}\n`
      }, '');

      callback(`*Absent on ${date}:*\n${entriesText}`);
    });
};

const filterBySupportedTags = (entry) => {
  return _.some(entry.projectNames, projectName => tag[projectName.name]);
};

const note = (noteText) => {
  return (!noteText || !noteText.length) ? '' : `_note: ${noteText}_`;
};

module.exports = absenceResponse;