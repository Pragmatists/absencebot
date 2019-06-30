import { StatusCommand } from './StatusCommand';

describe('StatusCommand', () => {
  const userId = '123';
  const userEmail = 'john.doe@pragmatists.pl';
  const command = new StatusCommand();

  it('returns error for invalid date', done => {
    const intent = '@201811abc';

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
});
