export function isValidNumber(value: unknown): value is number {
  return Number.isFinite(Number(value));
}

export function parseBloodPressure(
  bp?: string
): { systolic: number; diastolic: number } | null {
  if (!bp) return null;

  const [sys, dia] = bp.split('/');
  const systolic = Number(sys);
  const diastolic = Number(dia);

  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) {
    return null;
  }

  return { systolic, diastolic };
}

export function scoreBloodPressure(bp?: string): number {
  const parsed = parseBloodPressure(bp);
  if (!parsed) return 0;

  const { systolic, diastolic } = parsed;
  const scores: number[] = [0];
  if (systolic >= 140) {
    scores.push(3);
  } else if (systolic >= 130) {
    scores.push(2);
  } else if (systolic >= 120) {
    scores.push(1);
  }
  if (diastolic >= 90) {
    scores.push(3);
  } else if( diastolic >= 80) {
    scores.push(2);
  }

  return Math.max(...scores);
}

export function scoreTemperature(temp?: number | string): number {
  if (!isValidNumber(temp)) return 0;

  const t = Number(temp);
  if (t >= 101) return 2;
  if (t >= 99.6) return 1;
  return 0;
}

export function scoreAge(age?: number | string): number {
  if (!isValidNumber(age)) return 0;

  const a = Number(age);
  if (a > 65) return 2;
  if (a >= 40) return 1;
  return 0;
}
