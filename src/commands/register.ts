import { parseIntentForSign, parseDateIntent } from '../parser';
import { tag } from '../tag';
import { SlackAPI } from '../slack/SlackAPI';
import { OpenTrappAPI } from '../openTrapp/OpenTrappAPI';
import { dateFormat } from '../time';

export const registerCommand = (req, res, intent) => {
  const tagIntent = parseIntentForSign('#', intent);
  const dateIntent = parseIntentForSign('@', intent);
  const date = parseDateIntent(dateIntent);
  const note = parseIntentForSign('"', intent, '"');

  if (!date) {
    respondWithText(res, 'I did not understand the date format. Check `/absence` for help');
  } else if (!tagIntent) {
    respondWithText(res, 'Tag required. Check `/absence` for help');
  }
  if (intent.split("#").length - 1 > 1) {
    respondWithText(res, 'Multi tags are not supported. Check /absence for help.');
  } else if (!tag[tagIntent]) {
    respondWithText(res, 'Tag is not supported. Check /absence for help.');
  } else {
    SlackAPI.userInfo(req.body.user_id)
        .then(userInfo => userInfo.data.user.profile.email)
        .then(email => email.substring(0, email.indexOf('@')))
        .then(username => OpenTrappAPI.registerAbsence(username, {
              day: date.format(dateFormat),
              projectNames: [tagIntent],
              workload: tag[tagIntent].workload,
              note: note
            })
        )
        .then(() => {
          if (tagIntent === 'sick') {
            respondWithText(res, 'I got it. Feel better soon!')
          } else {
            respondWithText(res, 'Alright, noted.');
          }
        })
        .catch(error => {
          console.log(error);
          respondWithText(res, 'Unexpected error occurred!')
        });
  }

};

const respondWithText = (res, text) => {
  res.status(200).json({
    text: text,
    response_type: 'ephemeral',
    mrkdwn: true
  });
};
