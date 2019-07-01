[![Build Status](https://travis-ci.org/Pragmatists/absencebot.svg?branch=master)](https://travis-ci.org/Pragmatists/absencebot)
[![Coverage Status](https://coveralls.io/repos/github/Pragmatists/absencebot/badge.svg?branch=master)](https://coveralls.io/github/Pragmatists/absencebot?branch=master)

# absencebot

## Description
Slack app which helps to register absences in OpenTrapp with slack command.  
Everyday in the morning it sends to slack channel list of absences.

## Development

### Environment
To be able to start application following environment variables have to be defined:

- `OPEN_TRAPP_API_URL` - OpenTrapp API URL
- `OPEN_TRAPP_CLIENT_ID` - OpenTrapp API client ID (can be generated on OpenTrapp admin page)
- `OPEN_TRAPP_SECRET` - OpenTrapp API client secret (can be generated on OpenTrapp admin page)
- `SLACK_AUTH_TOKEN` - token which allows access to Slack API
- `SLACK_HOOK` - URL which is used to send notification about absences to Slack channel

### Tests
Unit tests (with coverage) can be started with following command:
```bash
$ yarn test
```

### Deployment

Application is deployed automatically to Elastic Beanstalk by [Travis job](https://travis-ci.org/Pragmatists/absencebot) after each push to master branch.  
Code coverage statistics (measured and reported during each build) are available [here](https://coveralls.io/github/Pragmatists/absencebot).

## Production

Application is deployed to Elastic Beanstalk and available [here](prod.f6megpcmpi.eu-central-1.elasticbeanstalk.com)
