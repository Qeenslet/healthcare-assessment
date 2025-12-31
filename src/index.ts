import { runAssessment } from './services/assessment.ts';
import { submitAssessment } from './api/client.ts';

(async () => {
  try {
    const results = await runAssessment();
    console.log('Computed Results:', results);

    const response = await submitAssessment(results);
    console.log('Submission Response:', response);
  } catch (err) {
    console.error('Assessment failed:', err);
  }
})();