import * as nock from 'nock';
import { StatusCommand } from './StatusCommand';
import { mockTokenEndpoint } from '../testUtils';
import { AbsenceDTO } from '../openTrapp/openTrappModel';
import { OpenTrappAPI } from '../openTrapp/OpenTrappAPI';

describe('StatusCommand', () => {
  const userId = '123';
  const command = new StatusCommand();

  it('returns status for date', done => {
    const intent = 'status @2019/06/29';
    const tokenScope = mockTokenEndpoint();
    const scope = mockStatusForDate();

    command.handle(intent, userId)
        .subscribe(response => {
          expect(tokenScope.isDone()).toBeTruthy();
          expect(scope.isDone()).toBeTruthy();
          expect(response).toEqual(expectedResponse(
              `*Absent on 2019/06/29:*
- *john.doe* #remote _note: Some note_
- *tom.hanks* #vacation`
          ));
          done();
        });
  });

  it('returns error for invalid date', done => {
    const intent = 'status @201811abc';

    command.handle(intent, userId)
        .subscribe(response => {
          expect(response).toEqual(expectedResponse('I did not understand the date format. Check `/absence` for help.'));
          done();
        });
  });

  function expectedResponse(text: string) {
    return {
      mrkdwn: true,
      response_type: 'ephemeral',
      text
    };
  }

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
});
