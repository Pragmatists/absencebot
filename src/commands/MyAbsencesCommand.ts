import * as moment from 'moment';
import { supportedTags } from '../tag';
import { join, chain } from 'lodash';
import { OpenTrappAPI } from '../openTrapp/OpenTrappAPI';
import { AbsenceDTO } from '../openTrapp/openTrappModel';
import { SlackAPI } from '../slack/SlackAPI';
import { Command } from './Command';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';


class AbsenceRow {
  private readonly day: string;
  private readonly tags: string[];
  private readonly note: string;

  constructor(absence: AbsenceDTO) {
    this.day = absence.day;
    this.tags = absence.projectNames;
    this.note = absence.note;
  }

  toString() {
    return `- *${this.day}* ${this.matchingTags} ${this.formattedNote}`;
  }

  private get matchingTags(): string {
    return this.tags
        .filter(t => supportedTags.includes(t))
        .map(t => `#${t}`)
        .join(' ')
  }

  private get formattedNote() {
    return (!this.note || !this.note.length) ? '' : `_note: ${this.note}_`;
  };
}

export class MyAbsencesCommand extends Command {
  protected handleRequest(intent: string, userId: string): Observable<string> {
    return SlackAPI.instance.userInfo(userId).pipe(
        map(userInfo => userInfo.data.user.profile.email),
        map(email => email.substring(0, email.indexOf('@'))),
        flatMap(username => OpenTrappAPI.instance.findAbsencesAfterDate(moment(), supportedTags, username)),
        map(this.workLogsToAbsenceList),
        map(entriesText => `*Your absences:*\n${entriesText}`),
        catchError(e => {
          console.log(e);
          return of('Unexpected error occurred!');
        })
    );
  }

  private workLogsToAbsenceList(absences: AbsenceDTO[]) {
    return chain(absences)
        .map(a => new AbsenceRow(a))
        .map(a => a.toString())
        .join('\n');
  };
}
