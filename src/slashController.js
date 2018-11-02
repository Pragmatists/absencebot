const helpCommand = require('./commands/help');
const statusCommand = require('./commands/status');
const registerCommand = require('./commands/register');
const parseIntentForSign = require('./parser').parseIntentForSign;
const parseDateIntent = require('./parser').parseDateIntent;

const absenceController = (req, res) => {

  const intent = req.body.text;

  if (!intent.length) {
    helpCommand(res, intent);
  }
  else if (intent.includes('status')) {
    statusCommand(res, intent);
  }
  else if (intent.includes('#')) {
    registerCommand(req, res, intent);
  }
};


module.exports = absenceController;