const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');
const time = require('../time');

const statusCommand = (req, res, intent) => {
  MongoClient.connect(process.env.DB_URI, (err, client) => {
    const db = client.db('absencebot');
    db.collection('absences').find({ user: req.body.user_name }).toArray((err, result) => {

      const entriesText = result
        .filter(entry => moment(entry.date, time.dateFormat).diff(moment().format(time.dateFormat), 'days') >= 0)
        .reduce((acc, entry) => {
        return acc + `- *${entry.date}* #${entry.tag} _${entry.note}_\n`
      }, '');

      respondWithText(res, `*Your absences:*\n${entriesText}`);
    });
  })
};

const respondWithText = (res, text) => {
  res.status(200).json({
    text: text,
    response_type: 'ephemeral',
    mrkdwn: true
  });
};

module.exports = statusCommand;
