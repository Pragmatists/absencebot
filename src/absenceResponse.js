const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');

const dateFormat = 'YYYY/MM/DD';

const absenceResponse = (callback, date = moment().format(dateFormat)) => {
  MongoClient.connect(process.env.DB_URI, (err, client) => {
    const db = client.db('absencebot');
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