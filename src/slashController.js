const absenceResponse = require('./absenceResponse');

const absenceController = (req, res) => {

  let responseText;

  const intent = req.body.text;

  if (!intent.length) {
    responseText = helpMessage();
  }

  if (intent === 'status') {
    responseText = absenceResponse()
  }

    res.status(200).json({
      text: responseText,
      response_type: 'ephemeral',
      mrkdwn: true
    });
};

const helpMessage = () => {
  return `*Absence bot help:*\n
  *Want to check who's out today?* \`/absence status\`\n
  *Supported tags:* #vacation #sick\n
  *Supported date formats:* @today @tomorrow\n
  *Example1*: \`/absence #vacations @tomorow\`\n
  *Example2*: \`/absence #sick @today\``;
};

module.exports = absenceController;