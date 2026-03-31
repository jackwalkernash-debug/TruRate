import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Trash2, Clock, PoundSterling } from "lucide-react";
import { getJobs, deleteJob as removeJob } from "../lib/jobs";
import JobDetailSheet from "../components/JobDetailSheet";
import AppShell from "../components/AppShell";

function getVerdict(rate) {
  if (rate >= 30) return { label: "Great", color: "text-emerald-600 bg-emerald-500/10" };
  if (rate >= 15) return { label: "Okay", color: "text-amber-600 bg-amber-500/10" };
  return { label: "Poor", color: "text-red-500 bg-red-500/10" };
}

export default function History() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    setJobs(getJobs());
  }, []);

  const deleteJob = (id) => {
    removeJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-4 py-4 md:px-8">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                Job <span className="text-amber-500">History</span>
              </h1>
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground">
                {jobs.length} RECENT JOBS
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
          <div className="mx-auto max-w-4xl space-y-3">
            <AnimatePresence>
              {jobs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <Briefcase className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No jobs saved yet</p>
                </motion.div>
              )}

              {jobs.map((job, i) => {
                const verdict = getVerdict(job.hourlyRate);
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedJob(job)}
                    className="flex cursor-pointer items-center gap-4 rounded-2xl bg-card p-4 shadow-sm transition-transform active:scale-[0.98]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <Briefcase className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold text-foreground">{job.title}</p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${verdict.color}`}
                        >
                          {verdict.label}
                        </span>
                      </div>

                      <div className="mt-0.5 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {job.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <PoundSterling className="h-3 w-3" /> £
                          {Number(job.hourlyRate || 0).toFixed(2)}/hr
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          £{Number(job.profit || 0).toFixed(2)} profit
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteJob(job.id);
                      }}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <JobDetailSheet job={selectedJob} onClose={() => setSelectedJob(null)} />
      </div>
    </AppShell>
  );
}