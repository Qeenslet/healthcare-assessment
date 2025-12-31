import { getPatients } from '../api/client.ts';
import {
  isValidNumber,
  parseBloodPressure,
  scoreAge,
  scoreBloodPressure,
  scoreTemperature
} from '../scoring/riskScoring.ts';

export interface AssessmentResult {
  high_risk_patients: string[];
  fever_patients: string[];
  data_quality_issues: string[];
}

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

export async function runAssessment(): Promise<AssessmentResult> {

    const patients: Patient[] = await fetchAllPatients();
    console.log(patients);
    const highRisk = new Set<string>();
    const fever = new Set<string>();
    const dataIssues = new Set<string>();

  for (const p of patients) {
    const bpValid = parseBloodPressure(p.blood_pressure);
    const tempValid = isValidNumber(p.temperature);
    const ageValid = isValidNumber(p.age);

    if (!bpValid || !tempValid || !ageValid) {
      dataIssues.add(p.patient_id);
    }
    let bpRisk = scoreBloodPressure(p.blood_pressure);
    let tempRisk = scoreTemperature(p.temperature);
    let ageRisk = scoreAge(p.age);

    const totalRisk = bpRisk + tempRisk + ageRisk;

    if (totalRisk >= 4) {
      highRisk.add(p.patient_id);
    }
    console.log(`Patient ID: ${p.patient_id} : Risk Score = ${totalRisk} (BP: ${bpRisk}, Temp: ${tempRisk}, Age: ${ageRisk})`);

    if (tempValid && Number(p.temperature) >= 99.6) {
      fever.add(p.patient_id);
    }
  }

  return {
    high_risk_patients: [...highRisk],
    fever_patients: [...fever],
    data_quality_issues: [...dataIssues]
  };
}

async function fetchAllPatients(): Promise<Patient[]> {
    let page = 1;
    const limit = 5;
    let totalPatients = 0;
    const patients: Patient[] = [];
    while (true) {
    const response = await getPatients(page, limit) as PatientsResponse;
    try {
        if (!totalPatients) {
            totalPatients = response.pagination.total;
        }
        patients.push(...response.data);
        if (!response.pagination.hasNext) {
            break;
        }
        page++;
    } catch (err) {
        console.error('Error processing patient data:', err);
    }
  }
  if (patients.length !== totalPatients) {
    console.warn(`Warning: Expected ${totalPatients} patients, but fetched ${patients.length}.`);
    return fetchAllPatients();
  }
  return patients
}
