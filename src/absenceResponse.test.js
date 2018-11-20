const MongoClient = require('mongodb').MongoClient;
const absenceResponse = require('./absenceResponse');

describe('absence response', () => {

  let db;

  beforeEach(async () => {
    const client = await MongoClient.connect(process.env.DB_URI + process.env.DB_NAME);
    db = client.db(process.env.DB_NAME);
    await db.collection(process.env.COLLECTION_NAME).remove({});
  });

  afterEach(async () => {
    await db.collection(process.env.COLLECTION_NAME).remove({});
  });

  it('should retrieve absences', (done) => {
    db.collection(process.env.COLLECTION_NAME).save({
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
        expect(text).toContain("Absent on 2018/11/14");
        expect(text).toContain("jakub.zmuda");
        expect(text).toContain("#vacation");
        expect(text).toContain("I am on vacation!");
        done();
      }, '2018/11/14')
    });
  })
});