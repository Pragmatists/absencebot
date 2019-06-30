export interface WorkLogDTO {
  id: string;
  employeeID: string;
  day: string;
  workload: number;
  projectNames: string[];
  note?: string;
}

export interface RegisterAbsenceDTO {
  day: string;
  workload: number;
  projectNames: string[];
  note?: string;
}
