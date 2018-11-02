const helpCommand = require('./commands/help');
const statusCommand = require('./commands/status');
const registerCommand = require('./commands/register');
const unknownCommand = require('./commands/unknown');

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
  else {
    unknownCommand(res, intent);
  }
};


module.exports = absenceController;