const time = require('../time.js');

const helpCommand = (res, intent) => {
  res.status(200).json({
    text: helpMessage(),
    response_type: 'ephemeral',
    mrkdwn: true
  });
};

const helpMessage = () => {
  return `*Absence bot help:*\n
  *Want to check who's out today?* \`/absence status\`\n
  *Want to check out who's out on given day?* \`/absence status ${time.dateFormat}\`\n
  *Want to check your planned absences?* \`/absence my-absences\`\n
  *Registering absence:*
  *Supported tags:* #vacation #sick
  *Supported date formats:* @today @tomorrow ${time.dateFormat}
  *You can attach a note wrapping it in double quotes.*
  *Example1*: \`/absence #vacation @tomorrow\`
  *Example2*: \`/absence #sick @today\`
  *Example3*: \`/absence #vacation @2018/11/02 "I'll be there after lunch."\``;
};

module.exports = helpCommand;