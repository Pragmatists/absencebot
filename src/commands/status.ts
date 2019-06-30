import { parseDateIntent, parseIntentForSign } from '../parser';
import { absenceResponse } from '../absenceResponse';

export const statusCommand = (res, intent) => {
  if (intent.includes('@')) {
    const dateIntent = parseIntentForSign('@', intent);
    const date = parseDateIntent(dateIntent);

    if (!date) {
      respondWithText(res, "Sorry I did not understand the date format");
    } else {
      absenceResponse((text) => respondWithText(res, text), date);
    }
  } else {
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
