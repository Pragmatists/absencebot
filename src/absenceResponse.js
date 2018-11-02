const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');

const dateFormat = 'YYYY/MM/DD';

const absenceResponse = (callback) => {
  const today = moment().format(dateFormat);

  MongoClient.connect(process.env.DB_URI, (err, client) => {
    const db = client.db('absencebot');
    db.collection('absences').find({ date: today }).toArray((err, result) => {

      console.log('result ', result);

      const entriesText = result.reduce((acc, entry) => {
        return acc + `- *${entry.user}* #${entry.tag} _${entry.note}_\n`
      }, '');

      callback(`
      *Absent today:*\n${entriesText}`);
    })
  });
};

module.exports = absenceResponse;