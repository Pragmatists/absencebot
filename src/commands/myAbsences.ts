import * as moment from 'moment';
import { supportedTags } from '../tag';
import { join, chain } from 'lodash';
import { OpenTrappAPI } from '../openTrapp/OpenTrappAPI';
import { WorkLogDTO } from '../openTrapp/openTrappModel';
import { SlackAPI } from '../slack/SlackAPI';


export const myAbsences = (req, res) => {
  SlackAPI.userInfo(req.body.user_id)
      .then(userInfo => userInfo.data.user.profile.email)
      .then(email => email.substring(0, email.indexOf('@')))
      .then(username => OpenTrappAPI.findAbsencesAfterDate(moment(), supportedTags, username))
      .then(workLogsToAbsenceList)
      .then(entriesText => respondWithText(res, `*Your absences:*\n${entriesText}`))
      .catch(error => {
        console.log(error);
        respondWithText(res, 'Unexpected error occurred!')
      });
};

const note = (noteText) => {
  return (!noteText || !noteText.length) ? '' : `_note: ${noteText}_`;
};

const respondWithText = (res, text) => {
  res.status(200).json({
    text: text,
    response_type: 'ephemeral',
    mrkdwn: true
  });
};

const workLogsToAbsenceList = (workLogs: WorkLogDTO[]) => {
  return chain(workLogs)
      .map(w => `- *${w.day}* ${w.projectNames.map(projectNameWithHash).join(', ')} ${note(w.note)}`)
      .join('\n');
};

const projectNameWithHash = (name: string) => `#${name}`;
