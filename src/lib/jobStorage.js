const KEY = "truerate_jobs";

export function getJobs() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveJob(job) {
  const jobs = getJobs();
  jobs.unshift({ ...job, id: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(jobs));
}

export function deleteJob(id) {
  const jobs = getJobs().filter((j) => j.id !== id);
  localStorage.setItem(KEY, JSON.stringify(jobs));
}