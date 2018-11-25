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
        .sort((prev, next) => {
          const prevName = surname(prev);
          const nextName = surname(next);
          return prevName < nextName ? -1 : 1;
        })
        .reduce((acc, entry) => {
        return acc + `- *${entry.employeeID._id}* #${tags(entry)} ${note(_.get(entry, 'note.text', undefined))}\n`
      }, '');

      callback(`*Absent on ${date}:*\n${entriesText}`);
    });
};

const tags = entry => _.join(entry.projectNames.map(tag => tag.name).filter(projectName => tag[projectName]));

const surname = (entry) => {
  const employeeName = entry.employeeID._id;
  const indexOfSign = _.indexOf(employeeName, '.');
  const start = indexOfSign + 1;

  return employeeName.substring(start);
};

const filterBySupportedTags = (entry) => {
  return _.some(entry.projectNames, projectName => tag[projectName.name]);
};

const note = (noteText) => {
  return (!noteText || !noteText.length) ? '' : `_note: ${noteText}_`;
};

module.exports = absenceResponse;