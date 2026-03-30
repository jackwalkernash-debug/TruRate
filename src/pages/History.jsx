import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Trash2, Clock, PoundSterling } from "lucide-react";
import { getJobs, deleteJob as removeJob } from "../lib/jobStorage";
import BottomNav from "../components/BottomNav";
import JobDetailSheet from "../components/JobDetailSheet";



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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="mx-auto max-w-lg px-5 py-4">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Job <span className="text-amber-500">History</span>
          </h1>
          <p className="text-[11px] font-medium text-muted-foreground tracking-wide">
            {jobs.length} RECENT JOBS
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-3">
        <AnimatePresence>
          {jobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
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
                className="rounded-2xl bg-card shadow-sm p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Briefcase className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground truncate">{job.title}</p>
                    <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full ${verdict.color}`}>
                      {verdict.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {job.date}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <PoundSterling className="h-3 w-3" /> £{job.hourlyRate.toFixed(2)}/hr
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      £{job.profit} profit
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteJob(job.id); }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <JobDetailSheet job={selectedJob} onClose={() => setSelectedJob(null)} />
      <BottomNav />
    </div>
  );
}