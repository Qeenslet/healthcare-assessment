export interface Patient {
  patient_id: string;
  name?: string;
  age?: number | string;
  gender?: string;
  blood_pressure?: string;
  temperature?: number | string;
  visit_date?: string;
  diagnosis?: string;
  medications?: string;
}

export interface PatientsResponse {
  data: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}