const MongoClient = require('mongodb').MongoClient;

const save = (absence, callback) => {
  MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, async (err, client) => {
    const db = client.db(process.env.DB_NAME);
    db.collection('absences').save(absence, callback);
  });
};

const loadByUser = (user, callback) => {
  MongoClient.connect(process.env.DB_URI, (err, client) => {
    const db = client.db('absencebot');
    db.collection('absences').find({ user: user }).toArray(callback);
  });
};

const loadByDate = (date, callback) => {
  MongoClient.connect(process.env.DB_URI, (err, client) => {
    const db = client.db('absencebot');
    db.collection('absences').find({ date: date}).toArray(callback);
  });
};

module.exports = {
  save,
  loadByUser,
  loadByDate
};
