import { helpCommand } from './commands/help';
import { statusCommand } from './commands/status';
import { registerCommand } from './commands/register';
import { unknownCommand } from './commands/unknown';
import { myAbsences } from './commands/myAbsences';

export const commandsController = (req, res) => {
  const intent = req.body.text;

  if (!intent.length) {
    helpCommand(res, intent);
  } else if (intent.includes('status')) {
    statusCommand(res, intent);
  } else if (intent.includes('my-absences')) {
    myAbsences(req, res);
  } else if (intent.includes('#')) {
    registerCommand(req, res, intent);
  } else {
    unknownCommand(res, intent);
  }
};
