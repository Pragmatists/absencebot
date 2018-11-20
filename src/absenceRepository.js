const MongoClient = require('mongodb').MongoClient;

const save = (absence, callback) => {
  MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, async (err, client) => {
    const db = client.db(process.env.DB_NAME);
    db.collection(process.env.COLLECTION_NAME).save(absence, callback);
  });
};

const loadByUser = (user, callback) => {
  MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
    const db = client.db(process.env.DB_NAME);
    db.collection(process.env.COLLECTION_NAME).find({ 'employeeID._id': user }).toArray(callback);
  });
};

const loadByDate = (date, callback) => {
  MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
    const db = client.db(process.env.DB_NAME);
    db.collection(process.env.COLLECTION_NAME).find({ 'day.date': date}).toArray(callback);
  });
};

module.exports = {
  save,
  loadByUser,
  loadByDate
};
