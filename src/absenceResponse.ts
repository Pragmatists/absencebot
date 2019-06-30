import * as moment from 'moment-timezone';
import { join, indexOf, chain } from 'lodash';
import { supportedTags } from './tag';
import { OpenTrappAPI } from './openTrapp/OpenTrappAPI';
import { AbsenceDTO } from './openTrapp/openTrappModel';
import { dateFormat } from './time';
import { map } from 'rxjs/operators';

export const absenceResponse = (date = moment().tz('Europe/Warsaw')) => {
  return OpenTrappAPI.instance.findAbsencesForDate(date, supportedTags).pipe(
      map(workLogsToAbsenceList),
      map(entriesText => `*Absent on ${date.format(dateFormat)}:*\n${entriesText}`)
  );
};

const note = (noteText: string) => {
  return (!noteText || !noteText.length) ? '' : `_note: ${noteText}_`;
};

const workLogsToAbsenceList = (workLogs: AbsenceDTO[]) => {
  return chain(workLogs)
      .sort(w => w.employeeID.substr(indexOf(w.employeeID, '.') + 1))
      .map(w => `- *${w.employeeID}* ${w.projectNames.map(projectNameWithHash).join(', ')} ${note(w.note)}`)
      .join('\n');
};

const projectNameWithHash = (name: string) => `#${name}`;
