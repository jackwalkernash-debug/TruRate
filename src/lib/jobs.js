const STORAGE_KEY = "trurate_jobs";

export function getJobs() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveJob(job) {
  const jobs = getJobs();

  const newJob = {
    ...job,
    id: job.id || Date.now(),
    date: job.date || new Date().toLocaleDateString(),
  };

  const updated = [newJob, ...jobs];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return newJob;
}

export function deleteJob(id) {
  const jobs = getJobs();
  const updated = jobs.filter((j) => String(j.id) !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getJobByLinkedQuoteId(quoteId) {
  const jobs = getJobs();
  return jobs.find((job) => String(job.linkedQuoteId) === String(quoteId)) || null;
}

export function saveWonQuoteAsJob(quote, details) {
  const existing = getJobByLinkedQuoteId(quote.id);
  if (existing) return existing;

  const price = Number(quote.total) || 0;
  const materials = Number(details.materials) || 0;
  const hours = Number(details.hours) || 0;
  const travel = Number(details.travel) || 0;
  const totalHours = hours + travel;
  const profit = price - materials;
  const hourlyRate = totalHours > 0 ? profit / totalHours : 0;

  const job = {
    id: Date.now(),
    linkedQuoteId: quote.id,
    source: "quote",
    title: quote.quoteTitle || "Won Quote",
    customerName: quote.customerName || "",
    date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    price,
    materials,
    hours,
    travel,
    profit,
    hourlyRate,
    status: "won",
  };

  return saveJob(job);
}