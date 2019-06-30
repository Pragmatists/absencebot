export interface AbsenceDTO {
  id: string;
  employeeID: string;
  day: string;
  workload: number;
  projectNames: string[];
  note?: string;
}

export interface RegisterAbsenceDTO {
  day: string;
  workload: string;
  projectNames: string[];
  note?: string;
}
