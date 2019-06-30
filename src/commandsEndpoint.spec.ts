import * as request from 'supertest';
import * as nock from 'nock';
import app from './api';
import { OpenTrappAPI } from './openTrapp/OpenTrappAPI';
import { AbsenceDTO } from './openTrapp/openTrappModel';
import * as moment from 'moment';
import { mockRegisterAbsence, mockSlackUserInfo, mockTokenEndpoint } from './testUtils';

describe('Commands endpoint test', () => {
  const userId = '123';
  const userEmail = 'john.doe@pragmatists.pl';

  it('returns help for empty command', done => {
    request(app)
        .post('/absence')
        .send({text: ''})
        .expect(200)
        .then(resp => resp.body)
        .then(responseBody => {
          expect(responseBody.text).toMatch(/^\*Absence bot help:.*/);
          expect(responseBody.response_type).toEqual('ephemeral');
          expect(responseBody.mrkdwn).toBeTruthy();
          done();
        });
  });

  it('returns status for date', done => {
    const scope = mockStatusForDate();
    const tokenScope = mockTokenEndpoint();

    request(app)
        .post('/absence')
        .send({text: 'status @2019/06/29'})
        .expect(200, {
          text: '*Absent on 2019/06/29:*\n- *john.doe* #remote _note: Some note_\n- *tom.hanks* #vacation ',
          response_type: 'ephemeral',
          mrkdwn: true
        })
        .then(() => {
          expect(tokenScope.isDone()).toBeTruthy();
          expect(scope.isDone()).toBeTruthy();
          done();
        });
  });

  it('returns my absences for next days', done => {
    const slackScope = mockSlackUserInfo(userId, userEmail);
    const tokenScope = mockTokenEndpoint();
    const scope = mockMyAbsences();

    request(app)
        .post('/absence')
        .send({text: 'my-absences', user_id: '123'})
        .expect(200, {
          text: '*Your absences:*\n- *2019/06/29* #remote _note: Some note_\n- *2019/06/30* #vacation ',
          response_type: 'ephemeral',
          mrkdwn: true
        })
        .then(() => {
          expect(slackScope.isDone()).toBeTruthy();
          expect(tokenScope.isDone()).toBeTruthy();
          expect(scope.isDone()).toBeTruthy();
          done();
        });
  });

  it( 'registers absence', done => {
    const slackScope = mockSlackUserInfo(userId, userEmail);
    const tokenScope = mockTokenEndpoint();
    const scope = mockRegisterAbsence({workload: '0m', projectNames: ['remote'], day: '2019/06/30', note: 'working from home'});

    request(app)
        .post('/absence')
        .send({text: '#remote @2019/06/30 "working from home"', user_id: '123'})
        .expect(200, {
          text: 'Alright, noted.',
          response_type: 'ephemeral',
          mrkdwn: true
        })
        .then(() => {
          expect(slackScope.isDone()).toBeTruthy();
          expect(tokenScope.isDone()).toBeTruthy();
          expect(scope.isDone()).toBeTruthy();
          done();
        });
  });

  it('returns info if unknown command', done => {
    request(app)
        .post('/absence')
        .send({text: 'unknown-command'})
        .expect(
            200,
            {
              text: 'Huh... I have no idea what you mean. Check help.',
              response_type: 'ephemeral',
              mrkdwn: true
            },
            done
        );
  });

  function mockStatusForDate() {
    const workLogResponse: AbsenceDTO[] = [
      {id: '1', workload: 480, employeeID: 'tom.hanks', projectNames: ['vacation'], day: '2019/06/29'},
      {id: '2', workload: 0, employeeID: 'john.doe', projectNames: ['remote', 'nvm'], day: '2019/06/29', note: 'Some note'}
    ];

    return nock(OpenTrappAPI.API_ROOT_URL)
        .get('/admin/work-log/entries')
        .matchHeader('Authorization', 'Bearer test-token')
        .query({
          date: '2019-06-29',
          tags: 'remote,sick,vacation,vacation-special,holiday,conference'
        })
        .reply(200, workLogResponse);
  }

  function mockMyAbsences() {
    const workLogResponse: AbsenceDTO[] = [
      {id: '1', workload: 0, employeeID: 'john.doe', projectNames: ['remote', 'nvm'], day: '2019/06/29', note: 'Some note'},
      {id: '2', workload: 480, employeeID: 'john.doe', projectNames: ['vacation'], day: '2019/06/30'}
    ];

    return nock(OpenTrappAPI.API_ROOT_URL)
        .get('/admin/work-log/entries')
        .matchHeader('Authorization', 'Bearer test-token')
        .query({
          dateFrom: moment().format('YYYY-MM-DD'),
          tags: 'remote,sick,vacation,vacation-special,holiday,conference',
          user: 'john.doe'
        })
        .reply(200, workLogResponse);
  }
});
