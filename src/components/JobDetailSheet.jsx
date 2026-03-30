import { motion, AnimatePresence } from "framer-motion";
import { X, PoundSterling, Clock, Truck, TrendingUp, Briefcase } from "lucide-react";

function getVerdict(rate) {
  if (rate >= 30) {
    return {
      label: "Great rate",
      boxClass: "border-emerald-200 bg-emerald-50 text-emerald-700"
    };
  }
  if (rate >= 15) {
    return {
      label: "Okay",
      boxClass: "border-amber-200 bg-amber-50 text-amber-700"
    };
  }
  return {
    label: "Not worth it",
    boxClass: "border-red-200 bg-red-50 text-red-700"
  };
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

export default function JobDetailSheet({ job, onClose }) {
  if (!job) return null;

  const verdict = getVerdict(job.hourlyRate);
  const totalHours = (job.hours || 0) + (job.travel || 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
        />

        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-t-3xl bg-white shadow-2xl"
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-slate-300" />
          </div>

          <div className="px-5 pb-10 pt-3 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <Briefcase className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{job.title}</h2>
                  <p className="text-xs text-slate-500">{job.date}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className={`rounded-2xl border-2 p-5 ${verdict.boxClass}`}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">
                Real Hourly Rate
              </p>
              <p className="font-mono text-4xl font-bold">
                £{job.hourlyRate.toFixed(2)}/hr
              </p>
              <p className="text-sm mt-1 opacity-80">
                {verdict.label} · {totalHours.toFixed(1)} total hours
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-4">
              <Row icon={PoundSterling} label="Job Price" value={`£${job.price?.toFixed(2) ?? "0.00"}`} />
              <Row icon={PoundSterling} label="Materials Cost" value={`£${job.materials?.toFixed(2) ?? "0.00"}`} />
              <Row icon={PoundSterling} label="Profit" value={`£${job.profit?.toFixed(2) ?? "0.00"}`} />
              <Row icon={Clock} label="Time Worked" value={`${job.hours ?? 0} hrs`} />
              <Row icon={Truck} label="Travel Time" value={`${job.travel ?? 0} hrs`} />
              <Row
                icon={TrendingUp}
                label="Profit Margin"
                value={`${job.price ? ((job.profit / job.price) * 100).toFixed(0) : 0}%`}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}