import * as moment from 'moment-timezone';
import { join, indexOf, chain } from 'lodash';
import { supportedTags } from './tag';
import { OpenTrappAPI } from './openTrapp/OpenTrappAPI';
import { AbsenceDTO } from './openTrapp/openTrappModel';
import { dateFormat } from './time';
import { map } from 'rxjs/operators';

class AbsenceRow {
  private readonly employeeId: string;
  private readonly tags: string[];
  private readonly note: string;

  constructor(absence: AbsenceDTO) {
    this.employeeId = absence.employeeID;
    this.tags = absence.projectNames;
    this.note = absence.note;
  }

  toString(): string {
    return `- *${this.employeeId}* ${this.matchingTags}${this.formattedNote}`
  }

  get employeeSurname(): string {
    return this.employeeId.substr(indexOf(this.employeeId, '.') + 1)
  }

  private get matchingTags(): string {
    return this.tags
        .filter(t => supportedTags.includes(t))
        .map(t => `#${t}`)
        .join(' ')
  }

  private get formattedNote() {
    return (!this.note || !this.note.length) ? '' : ` _note: ${this.note}_`;
  };
}

const workLogsToAbsenceList = (absences: AbsenceDTO[]) => {
  return chain(absences)
      .map(a => new AbsenceRow(a))
      .sortBy(a => a.employeeSurname)
      .map(a => a.toString())
      .join('\n');
};

export const absenceResponse = (date = moment().tz('Europe/Warsaw')) => {
  return OpenTrappAPI.instance.findAbsencesForDate(date, supportedTags).pipe(
      map(workLogsToAbsenceList),
      map(entriesText => `*Absent on ${date.format(dateFormat)}:*\n${entriesText}`)
  );
};
