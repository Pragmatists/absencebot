const parseIntentForSign = require('../parser').parseIntentForSign;
const parseDateIntent = require('../parser').parseDateIntent;
const absenceResponse = require('../absenceResponse');

const statusCommand = (res, intent) => {
  if (intent.includes('@')) {
    const dateIntent = parseIntentForSign('@', intent);
    const date = parseDateIntent(dateIntent);

    if (!date) {
      respondWithText("Sorry I did not understand the date format");
    }
    else {
      console.log('with date ', date);
      absenceResponse((text) => respondWithText(res, text), date);
    }
  }
  else {
    absenceResponse((text) => respondWithText(res, text));
  }
};

const respondWithText = (res, text) => {
  res.status(200).json({
    text: text,
    response_type: 'ephemeral',
    mrkdwn: true
  });
};

module.exports = statusCommand;