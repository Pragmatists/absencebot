import * as nock from 'nock';
import { SlackAPI } from './slack/SlackAPI';
import { OpenTrappAPI } from './openTrapp/OpenTrappAPI';

export function mockSlackUserInfo(userId: string, email: string) {
  return nock(SlackAPI.API_ROOT_URL)
      .get('/users.info')
      .matchHeader('Authorization', 'Bearer slack-token')
      .query({
        user: userId
      })
      .reply(200, {
        data: {
          user: {
            profile: {
              email: email
            }
          }
        }
      });
}

export function mockTokenEndpoint() {
  return nock(OpenTrappAPI.API_ROOT_URL)
      .post('/authentication/service-token', {clientID: 'test-client', secret: 'test-secret'})
      .reply(200, {token: 'test-token'});
}

export function mockRegisterAbsence(requestBody) {
  return nock(OpenTrappAPI.API_ROOT_URL)
      .post(
          '/admin/work-log/john.doe/entries',
          requestBody
      )
      .matchHeader('Authorization', 'Bearer test-token')
      .reply(200, {id: 'entry-id'});
}
