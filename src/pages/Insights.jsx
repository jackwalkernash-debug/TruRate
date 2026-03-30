import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, AlertTriangle, PoundSterling, Briefcase } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import BottomNav from "../components/BottomNav";
import { getJobs } from "../lib/jobStorage";

const StatCard = ({ label, value, sublabel, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4"
  >
    <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${color}/10`}>
      <Icon className={`h-5 w-5 ${color}`} strokeWidth={2} />
    </div>
    <p className="font-mono text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-xs font-semibold text-slate-900 mt-0.5">{label}</p>
    {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
  </motion.div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl bg-white border border-slate-200 shadow-lg px-3 py-2">
        <p className="text-sm font-bold text-slate-900">£{payload[0].value}/hr</p>
      </div>
    );
  }
  return null;
};

function getDayName(dateStr) {
  const currentYear = new Date().getFullYear();
  const parsed = new Date(`${dateStr} ${currentYear}`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-GB", { weekday: "short" });
}

export default function Insights() {
  const jobs = getJobs();

  const stats = useMemo(() => {
    if (!jobs.length) {
      return {
        avgRate: 0,
        totalProfit: 0,
        bestJob: null,
        worstJob: null,
        weeklyData: [
          { day: "Mon", rate: 0 },
          { day: "Tue", rate: 0 },
          { day: "Wed", rate: 0 },
          { day: "Thu", rate: 0 },
          { day: "Fri", rate: 0 },
          { day: "Sat", rate: 0 },
          { day: "Sun", rate: 0 }
        ],
        jobTypes: []
      };
    }

    const avgRate =
      jobs.reduce((sum, job) => sum + (job.hourlyRate || 0), 0) / jobs.length;

    const totalProfit = jobs.reduce((sum, job) => sum + (job.profit || 0), 0);

    const bestJob = [...jobs].sort((a, b) => b.hourlyRate - a.hourlyRate)[0];
    const worstJob = [...jobs].sort((a, b) => a.hourlyRate - b.hourlyRate)[0];

    const dayTemplate = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const groupedByDay = Object.fromEntries(dayTemplate.map((d) => [d, []]));

    jobs.forEach((job) => {
      const day = getDayName(job.date);
      if (day && groupedByDay[day]) {
        groupedByDay[day].push(job.hourlyRate || 0);
      }
    });

    const weeklyData = dayTemplate.map((day) => {
      const rates = groupedByDay[day];
      const avg = rates.length
        ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length
        : 0;
      return { day, rate: Number(avg.toFixed(0)) };
    });

    const groupedByTitle = {};
    jobs.forEach((job) => {
      const key = job.title || "Job";
      if (!groupedByTitle[key]) {
        groupedByTitle[key] = { type: key, totalRate: 0, jobs: 0 };
      }
      groupedByTitle[key].totalRate += job.hourlyRate || 0;
      groupedByTitle[key].jobs += 1;
    });

    const jobTypes = Object.values(groupedByTitle)
      .map((item) => ({
        type: item.type,
        avg: Number((item.totalRate / item.jobs).toFixed(0)),
        jobs: item.jobs,
        color:
          item.totalRate / item.jobs >= 30
            ? "bg-emerald-500"
            : item.totalRate / item.jobs >= 15
            ? "bg-amber-500"
            : "bg-red-500"
      }))
      .sort((a, b) => b.avg - a.avg);

    return {
      avgRate,
      totalProfit,
      bestJob,
      worstJob,
      weeklyData,
      jobTypes
    };
  }, [jobs]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200">
        <div className="mx-auto max-w-lg px-5 py-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Earnings <span className="text-amber-500">Insights</span>
          </h1>
          <p className="text-[11px] font-medium text-slate-500 tracking-wide">
            BASED ON SAVED JOB HISTORY
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-6">
        {!jobs.length && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Briefcase className="h-6 w-6 text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-700">No saved jobs yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Save some jobs from the calculator to unlock insights
            </p>
          </div>
        )}

        {!!jobs.length && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Avg Hourly Rate"
                value={`£${stats.avgRate.toFixed(0)}/hr`}
                sublabel={`${jobs.length} saved jobs`}
                icon={TrendingUp}
                color="text-emerald-600"
              />
              <StatCard
                label="Total Profit"
                value={`£${stats.totalProfit.toFixed(0)}`}
                sublabel="Across saved jobs"
                icon={PoundSterling}
                color="text-amber-500"
              />
              <StatCard
                label="Best Job"
                value={`£${stats.bestJob?.hourlyRate?.toFixed(0) || 0}/hr`}
                sublabel={stats.bestJob?.title || "—"}
                icon={Award}
                color="text-emerald-600"
              />
              <StatCard
                label="Worst Job"
                value={`£${stats.worstJob?.hourlyRate?.toFixed(0) || 0}/hr`}
                sublabel={stats.worstJob?.title || "—"}
                icon={AlertTriangle}
                color="text-red-500"
              />
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
                Hourly Rate by Day
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={stats.weeklyData} barSize={28}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                    {stats.weeklyData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={
                          entry.rate >= 30
                            ? "#10b981"
                            : entry.rate >= 15
                            ? "#f59e0b"
                            : entry.rate > 0
                            ? "#ef4444"
                            : "#e5e7eb"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Best Job Types
              </p>

              {stats.jobTypes.map((job, i) => (
                <motion.div
                  key={job.type}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{job.type}</span>
                    <span className="text-sm font-bold font-mono text-slate-900">
                      £{job.avg}/hr
                    </span>
                  </div>
                  <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((job.avg / 60) * 100, 100)}%` }}
                      transition={{ delay: i * 0.07 + 0.2, duration: 0.5, ease: "easeOut" }}
                      className={`absolute inset-y-0 left-0 rounded-full ${job.color}`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{job.jobs} jobs</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}