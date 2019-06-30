import { dateFormat } from '../time';
import { Command } from './Command';
import { Observable, of } from 'rxjs';

export class HelpCommand extends Command {
  protected handleRequest(intent: string, userId: string): Observable<string> {
    return of(
        `*Absence bot help:*\n
  *Absence bot is integrated with Open Trapp. Registering absence here will fill the Open Trapp and vice versa.* \n
  *Want to check who's out today?* \`/absence status\`\n
  *Want to check out who's out on given day?* \`/absence status ${dateFormat}\` or \`/absence status @tomorrow\`\n
  *Want to check your planned absences?* \`/absence my-absences\`\n
  *Registering absence:*
  *Supported tags:* #vacation (registers 8h) #sick (registers 8h) #holiday (registers 8h) #conference (registers 8h) #remote (registers 0h)
  *Supported date formats:* @today @tomorrow ${dateFormat}
  *You can attach a note wrapping it in double quotes.*
  *Example1*: \`/absence #vacation @tomorrow\`
  *Example2*: \`/absence #sick @today\`
  *Example3*: \`/absence #vacation @2018/11/02 "I'll be there after lunch."\``
    );
  }
}
