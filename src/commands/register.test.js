const MongoClient = require('mongodb').MongoClient;

const axios = require('axios');

describe('registering absences', () => {

  beforeEach(() => {
    MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
      const db = client.db(process.env.DB_NAME);
      db.collection('absences').remove({})
    })
  });

  it('should register absence', (done) => {
    axios.post('http://localhost:8081/absence', {
      text: '#vacation @2018/11/09',
      user_name: 'bot'
    })
      .then(res => {
        MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
          const db = client.db(process.env.DB_NAME);
          db.collection('absences').findOne((err, result) => {

            expect(result._id._id).toMatch(/^WL\.[a-zA-Z0-9]*$/);
            expect(result.employeeID._id).toEqual('bot');
            done();
          })
        });
      })
  });
});