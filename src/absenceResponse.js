const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');
const time = require('./time');


const absenceResponse = (callback, date = moment().format(time.dateFormat)) => {
  MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
    const db = client.db(process.env.DB_NAME);
    db.collection('absences').find({ date: date }).toArray((err, result) => {

      const entriesText = result.reduce((acc, entry) => {
        return acc + `- *${entry.user}* #${entry.tag} ${note(entry.note)}\n`
      }, '');

      callback(`*Absent on ${date}:*\n${entriesText}`);
    })
  });
};

const note = (noteText) => {
  return (!noteText || !noteText.length) ? '' : `_note: ${noteText}_`;
};

module.exports = absenceResponse;