import { HelpCommand } from './commands/HelpCommand';
import { StatusCommand } from './commands/StatusCommand';
import { RegisterCommand } from './commands/RegisterCommand';
import { UnknownCommand } from './commands/UnknownCommand';
import { MyAbsencesCommand } from './commands/MyAbsencesCommand';

export const commandsController = (req, res) => {
  const intent = req.body.text;
  const userId = req.body.user_id;
  getResponse(intent, userId)
      .subscribe(responseBody => res.status(200).json(responseBody));
};

const getResponse = (intent: string, userId: string) => {
  if (!intent.length) {
    const helpCommand = new HelpCommand();
    return helpCommand.handle(intent, userId);
  } else if (intent.includes('status')) {
    const statusCommand = new StatusCommand();
    return statusCommand.handle(intent, userId);
  } else if (intent.includes('my-absences')) {
    const myAbsencesCommand = new MyAbsencesCommand();
    return myAbsencesCommand.handle(intent, userId);
  } else if (intent.includes('#')) {
    const registerCommand = new RegisterCommand();
    return registerCommand.handle(intent, userId);
  } else {
    const unknownCommand = new UnknownCommand();
    return unknownCommand.handle(intent, userId);
  }
};
