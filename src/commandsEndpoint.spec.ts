import * as request from 'supertest';
import * as nock from 'nock';
import app from './api';
import { OPEN_TRAPP_API_URL } from './openTrapp/OpenTrappAPI';
import { WorkLogDTO } from './openTrapp/openTrappModel';
import { SLACK_API_URL } from './slack/SlackAPI';
import * as moment from 'moment';

describe('Commands endpoint test', () => {
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
    const slackScope = mockSlackUserInfo();
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

  it('registers absence', done => {
    const slackScope = mockSlackUserInfo();
    const tokenScope = mockTokenEndpoint();
    const scope = mockRegisterAbsence();

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
    const workLogResponse: WorkLogDTO[] = [
      {id: '1', workload: 0, employeeID: 'john.doe', projectNames: ['remote'], day: '2019/06/29', note: 'Some note'},
      {id: '2', workload: 480, employeeID: 'tom.hanks', projectNames: ['vacation'], day: '2019/06/29'}
    ];

    return nock(OPEN_TRAPP_API_URL)
        .get('/admin/work-log/entries')
        .matchHeader('Authorization', 'Bearer test-token')
        .query({
          date: '2019-06-29',
          tags: 'remote,sick,vacation,vacation-special,holiday,conference'
        })
        .reply(200, workLogResponse);
  }

  function mockMyAbsences() {
    const workLogResponse: WorkLogDTO[] = [
      {id: '1', workload: 0, employeeID: 'john.doe', projectNames: ['remote'], day: '2019/06/29', note: 'Some note'},
      {id: '2', workload: 480, employeeID: 'john.doe', projectNames: ['vacation'], day: '2019/06/30'}
    ];

    return nock(OPEN_TRAPP_API_URL)
        .get('/admin/work-log/entries')
        .matchHeader('Authorization', 'Bearer test-token')
        .query({
          dateFrom: moment().format('YYYY-MM-DD'),
          tags: 'remote,sick,vacation,vacation-special,holiday,conference',
          user: 'john.doe'
        })
        .reply(200, workLogResponse);
  }

  function mockRegisterAbsence() {
    return nock(OPEN_TRAPP_API_URL)
        .post(
            '/admin/work-log/john.doe/entries',
            {workload: 0, projectNames: ['remote'], day: '2019/06/30', note: 'working from home'}
        )
        .matchHeader('Authorization', 'Bearer test-token')
        .reply(200, {id: 'entry-id'});
  }

  function mockTokenEndpoint() {
    return nock(OPEN_TRAPP_API_URL)
        .post('/authentication/service-token', {clientID: 'test-client', secret: 'test-secret'})
        .reply(200, {token: 'test-token'});
  }

  function mockSlackUserInfo() {
    return nock(SLACK_API_URL)
        .get('/users.info')
        .matchHeader('Authorization', 'Bearer slack-token')
        .query({
          user: '123'
        })
        .reply(200, {
          data: {
            user: {
              profile: {
                email: 'john.doe@pragmatists.pl'
              }
            }
          }
        });
  }
});
