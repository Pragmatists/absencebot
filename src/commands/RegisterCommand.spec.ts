import { RegisterCommand } from './RegisterCommand';
import { mockRegisterAbsence, mockSlackFailure, mockSlackUserInfo, mockTokenEndpoint } from '../testUtils';

describe('RegisterCommand', () => {
  const userId = '123';
  const userEmail = 'john.doe@pragmatists.pl';
  const command = new RegisterCommand();
  let tokenScope;

  beforeEach(() => {
    tokenScope = mockTokenEndpoint();
  });

  it('registers #vacation', (done) => {
    const intent = '#vacation @2019/06/25 "I am on vacation!"';
    const slackScope = mockSlackUserInfo(userId, userEmail);
    const scope = mockRegisterAbsence({workload: '1d', projectNames: ['vacation'], day: '2019/06/25', note: 'I am on vacation!'});

    command.handle(intent, userId)
        .subscribe(response => {
          expect(response).toEqual(expectedResponse('Alright, noted.'));
          expect(slackScope.isDone()).toBeTruthy();
          expect(tokenScope.isDone()).toBeTruthy();
          expect(scope.isDone()).toBeTruthy();
          done();
        });
  });

  it('registers #sick', done => {
    const intent = '#sick @2019/06/26 "I am sick today!"';
    const slackScope = mockSlackUserInfo(userId, userEmail);
    const scope = mockRegisterAbsence({workload: '1d', projectNames: ['sick'], day: '2019/06/26', note: 'I am sick today!'});

    command.handle(intent, userId)
        .subscribe(response => {
          expect(response).toEqual(expectedResponse('I got it. Feel better soon!'));
          expect(slackScope.isDone()).toBeTruthy();
          expect(tokenScope.isDone()).toBeTruthy();
          expect(scope.isDone()).toBeTruthy();
          done();
        });
  });

  it('registers #remote', done => {
    const intent = '#remote @2019/06/27 "I am working from home today!"';
    const slackScope = mockSlackUserInfo(userId, userEmail);
    const scope = mockRegisterAbsence({workload: '0m', projectNames: ['remote'], day: '2019/06/27', note: 'I am working from home today!'});

    command.handle(intent, userId)
        .subscribe(response => {
          expect(response).toEqual(expectedResponse('Alright, noted.'));
          expect(slackScope.isDone()).toBeTruthy();
          expect(tokenScope.isDone()).toBeTruthy();
          expect(scope.isDone()).toBeTruthy();
          done();
        });
  });

  it('registers #holiday', done => {
    const intent = '#holiday @2019/06/28 "It is a holiday!"';
    const slackScope = mockSlackUserInfo(userId, userEmail);
    const scope = mockRegisterAbsence({workload: '1d', projectNames: ['holiday'], day: '2019/06/28', note: 'It is a holiday!'});

    command.handle(intent, userId)
        .subscribe(response => {
          expect(response).toEqual(expectedResponse('Alright, noted.'));
          expect(slackScope.isDone()).toBeTruthy();
          expect(tokenScope.isDone()).toBeTruthy();
          expect(scope.isDone()).toBeTruthy();
          done();
        });
  });

  it(`can't register unknown tag`, done => {
    const intent = '#unknown @2018/11/09';

    command.handle(intent, userId)
        .subscribe(response => {
          expect(response).toEqual(expectedResponse('Tag is not supported. Check /absence for help.'));
          done();
        });
  });

  it(`can't register two tags`, done => {
    const intent = '#vacation #sick @2018/11/09';

    command.handle(intent, userId)
        .subscribe(response => {
          expect(response).toEqual(expectedResponse('Multi tags are not supported. Check /absence for help.'));
          done();
        });
  });

  it(`can't register if invalid date`, done => {
    const intent = '#vacation @201811abc';

    command.handle(intent, userId)
        .subscribe(response => {
          expect(response).toEqual(expectedResponse('I did not understand the date format. Check `/absence` for help.'));
          done();
        });
  });

  it(`can't register if tag is not present`, done => {
    const intent = '@2018/11/10';

    command.handle(intent, userId)
        .subscribe(response => {
          expect(response).toEqual(expectedResponse('Tag required. Check `/absence` for help.'));
          done();
        });
  });

  it('returns unexpected error on slack API failure', done => {
    const intent = '#vacation @2019/06/25 "I am on vacation!"';
    const slackScope = mockSlackFailure(userId);

    command.handle(intent, userId)
        .subscribe(response => {
          expect(slackScope.isDone()).toBeTruthy();
          expect(response).toEqual(expectedResponse('Unexpected error occurred!'));
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
