import { Command } from './Command';
import { Observable, of } from 'rxjs';

export class UnknownCommand extends Command {
  protected handleRequest(intent: string, userId: string): Observable<string> {
    return of('Huh... I have no idea what you mean. Check help.');
  }
}
