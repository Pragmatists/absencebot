const MongoClient = require('mongodb').MongoClient;
const absenceResponse = require('./absenceResponse');

describe('absence response', () => {

  let db;

  beforeEach(async () => {
    const client = await MongoClient.connect(process.env.DB_URI + process.env.DB_NAME);
    db = client.db(process.env.DB_NAME);
    await db.collection('absences').remove({});
  });

  it('should retrieve absences', (done) => {
    db.collection('absences').save({
      _id: {
        _id: 'WL.7a40939d464a4dfaa70b70b10b1546a9'
      },
      employeeID: {
        _id: 'jakub.zmuda'
      },
      day: {
        date: '2018/11/14'
      },
      workload: {
        minutes: 480
      },
      projectNames: [
        {
          name: 'vacation'
        }
      ],
      note: {
        text: 'I am on vacation!'
      }
    }, (err, result) => {
      absenceResponse((text) => {
        expect(text).toEqual("*Absent on 2018/11/14:*\n- *jakub.zmuda* #vacation _note: I am on vacation!_");
        done();
      }, '2018/11/14')
    });
  })
});