/**
 * Computes a mock AI matching score between a job seeker's skills and a job's tags.
 * Returns an object containing a percentage score and visual metadata (color, label).
 */
export const calculateMatchScore = (userSkills = [], jobTags = []) => {
  if (!userSkills || userSkills.length === 0) {
    return { score: 15, color: 'text-rose-500 border-rose-200 bg-rose-50 dark:bg-rose-950/20', label: 'Low Match' };
  }
  if (!jobTags || jobTags.length === 0) {
    return { score: 70, color: 'text-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-950/20', label: 'Good Match' };
  }

  const uSkills = userSkills.map((s) => s.toLowerCase().trim());
  const jTags = jobTags.map((t) => t.toLowerCase().trim());

  let matches = 0;
  jTags.forEach((tag) => {
    // Check for direct match or partial match (e.g. "React Native" matches "React")
    const isDirectMatch = uSkills.includes(tag);
    const isPartialMatch = uSkills.some((skill) => skill.includes(tag) || tag.includes(skill));
    
    if (isDirectMatch) {
      matches += 1;
    } else if (isPartialMatch) {
      matches += 0.5;
    }
  });

  // Calculate percentage
  const rawScore = (matches / jTags.length) * 100;
  
  // Guarantee a reasonable score scaling (baseline 20% to account for soft skills)
  const score = Math.min(100, Math.round(Math.max(15, rawScore + 10)));

  let color = 'text-rose-500 border-rose-200 bg-rose-50 dark:bg-rose-950/20';
  let label = 'Basic Fit';

  if (score >= 80) {
    color = 'text-emerald-500 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20';
    label = 'Excellent Match';
  } else if (score >= 50) {
    color = 'text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/20';
    label = 'Good Match';
  }

  return { score, color, label };
};
