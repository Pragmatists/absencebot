const MongoClient = require('mongodb').MongoClient;

const axios = require('axios');

describe('registering absences', () => {

  beforeEach(() => {
    MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
      const db = client.db(process.env.DB_NAME);
      db.collection('absences').remove({})
    })
  });

  it('should register vacation', (done) => {
    axios.post('http://localhost:8081/absence', {
      text: '#vacation @2018/11/09 "I am on vacation!"',
      user_id: 'U41VCH96D',
      user_name: 'kubaue'
    })
      .then(res => {
        MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
          const db = client.db(process.env.DB_NAME);
          db.collection('absences').findOne((err, result) => {

            expect(result._id._id).toMatch(/^WL\.[a-zA-Z0-9]*$/);
            expect(result.employeeID._id).toEqual('jakub.zmuda');
            expect(result.day.date).toEqual('2018/11/09');
            expect(result.projectNames).toEqual([{name: 'vacation'}]);
            expect(result.workload.minutes).toEqual(480);
            expect(result.note.text).toEqual('I am on vacation!');
            done();
          })
        });
      })
  });

  it('should register sick', (done) => {
    axios.post('http://localhost:8081/absence', {
      text: '#sick @2018/11/09 "I am sick today!"',
      user_id: 'U41VCH96D',
      user_name: 'kubaue'
    })
      .then(res => {
        MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
          const db = client.db(process.env.DB_NAME);
          db.collection('absences').findOne((err, result) => {

            expect(result._id._id).toMatch(/^WL\.[a-zA-Z0-9]*$/);
            expect(result.employeeID._id).toEqual('jakub.zmuda');
            expect(result.day.date).toEqual('2018/11/09');
            expect(result.projectNames).toEqual([{name: 'sick'}]);
            expect(result.workload.minutes).toEqual(480);
            expect(result.note.text).toEqual('I am sick today!');
            done();
          })
        });
      })
  });

  it('should register remote', (done) => {
    axios.post('http://localhost:8081/absence', {
      text: '#remote @2018/11/09 "I am working from home today!"',
      user_id: 'U41VCH96D',
      user_name: 'kubaue'
    })
      .then(res => {
        MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
          const db = client.db(process.env.DB_NAME);
          db.collection('absences').findOne((err, result) => {

            expect(result._id._id).toMatch(/^WL\.[a-zA-Z0-9]*$/);
            expect(result.employeeID._id).toEqual('jakub.zmuda');
            expect(result.day.date).toEqual('2018/11/09');
            expect(result.projectNames).toEqual([{name: 'remote'}]);
            expect(result.workload.minutes).toEqual(0);
            expect(result.note.text).toEqual('I am working from home today!');
            done();
          })
        });
      })
  });

  it('should register holiday', (done) => {
    axios.post('http://localhost:8081/absence', {
      text: '#holiday @2018/11/09 "I am sick today!"',
      user_id: 'U41VCH96D',
      user_name: 'kubaue'
    })
      .then(res => {
        MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
          const db = client.db(process.env.DB_NAME);
          db.collection('absences').findOne((err, result) => {

            expect(result._id._id).toMatch(/^WL\.[a-zA-Z0-9]*$/);
            expect(result.employeeID._id).toEqual('jakub.zmuda');
            expect(result.day.date).toEqual('2018/11/09');
            expect(result.projectNames).toEqual([{name: 'holiday'}]);
            expect(result.workload.minutes).toEqual(480);
            expect(result.note.text).toEqual('I am sick today!');
            done();
          })
        });
      })
  });

  it('should not register unknown tag', (done) => {
    axios.post('http://localhost:8081/absence', {
      text: '#unknown @2018/11/09',
      user_id: 'U41VCH96D',
      user_name: 'kubaue'
    })
      .then(res => {
        MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
          const db = client.db(process.env.DB_NAME);
          db.collection('absences').findOne((err, result) => {
            expect(result).toBeNull();
            expect(res.data.text).toEqual('Tag is not supported. Check /absence for help.');
            done();
          })
        });
      })
  });

  it('should not be able to register two tags', (done) => {
    axios.post('http://localhost:8081/absence', {
      text: '#vacation #sick @2018/11/09',
      user_id: 'U41VCH96D',
      user_name: 'kubaue'
    })
      .then(res => {
        MongoClient.connect(process.env.DB_URI + process.env.DB_NAME, (err, client) => {
          const db = client.db(process.env.DB_NAME);
          db.collection('absences').findOne((err, result) => {
            expect(result).toBeNull();
            expect(res.data.text).toEqual('Multi tags are not supported. Check /absence for help.');
            done();
          })
        });
      })
  });

});