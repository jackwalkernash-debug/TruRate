import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";

export default function Insights() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("trurate_jobs")) || [];
    setJobs(storedJobs);
  }, []);

  const totalProfit = jobs.reduce((sum, job) => sum + Number(job.profit || 0), 0);

  const avgHourly =
    jobs.length > 0
      ? jobs.reduce((sum, job) => sum + Number(job.hourlyRate || 0), 0) / jobs.length
      : 0;

  const bestJob =
    jobs.length > 0
      ? jobs.reduce((best, job) =>
          Number(job.hourlyRate || 0) > Number(best.hourlyRate || 0) ? job : best
        )
      : null;

  const worstJob =
    jobs.length > 0
      ? jobs.reduce((worst, job) =>
          Number(job.hourlyRate || 0) < Number(worst.hourlyRate || 0) ? job : worst
        )
      : null;

  const hourlyByDay = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const buckets = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    };

    jobs.forEach((job) => {
      const rawDate = job.date || job.createdAt || job.completedAt;
      if (!rawDate) return;

      const date = new Date(rawDate);
      if (Number.isNaN(date.getTime())) return;

      const jsDay = date.getDay();
      const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = map[jsDay];

      if (buckets[dayName]) {
        buckets[dayName].push(Number(job.hourlyRate || 0));
      }
    });

    const result = days.map((day) => {
      const values = buckets[day];
      const avg =
        values.length > 0
          ? values.reduce((sum, value) => sum + value, 0) / values.length
          : 0;

      return {
        day,
        value: avg,
      };
    });

    const max = Math.max(...result.map((item) => item.value), 1);

    return result.map((item) => ({
      ...item,
      height: item.value > 0 ? Math.max((item.value / max) * 140, 10) : 0,
    }));
  }, [jobs]);

  const jobTypes = useMemo(() => {
    const groups = {};

    jobs.forEach((job) => {
      const name = job.customer || job.name || "Unknown";
      if (!groups[name]) {
        groups[name] = {
          name,
          count: 0,
          totalHourly: 0,
        };
      }

      groups[name].count += 1;
      groups[name].totalHourly += Number(job.hourlyRate || 0);
    });

    const arr = Object.values(groups).map((group) => ({
      ...group,
      avgHourly: group.count > 0 ? group.totalHourly / group.count : 0,
    }));

    arr.sort((a, b) => b.count - a.count || b.avgHourly - a.avgHourly);

    const top = arr.slice(0, 3);
    const maxCount = Math.max(...top.map((item) => item.count), 1);

    return top.map((item) => ({
      ...item,
      width: `${Math.max((item.count / maxCount) * 100, 12)}%`,
    }));
  }, [jobs]);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Earnings <span className="text-amber-500">Insights</span>
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Based on saved job history
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InsightCard
            icon="↗"
            iconColor="text-emerald-600"
            value={`£${avgHourly.toFixed(0)}/hr`}
            label="Avg Hourly Rate"
            subtext={`${jobs.length} saved job${jobs.length === 1 ? "" : "s"}`}
          />

          <InsightCard
            icon="£"
            iconColor="text-amber-500"
            value={`£${totalProfit.toFixed(0)}`}
            label="Total Profit"
            subtext="Across saved jobs"
          />

          <InsightCard
            icon="⌂"
            iconColor="text-emerald-600"
            value={bestJob ? `£${Number(bestJob.hourlyRate || 0).toFixed(0)}/hr` : "£0/hr"}
            label="Best Job"
            subtext={bestJob ? bestJob.customer || bestJob.name || "Top job" : "No data"}
          />

          <InsightCard
            icon="⚠"
            iconColor="text-red-500"
            value={worstJob ? `£${Number(worstJob.hourlyRate || 0).toFixed(0)}/hr` : "£0/hr"}
            label="Worst Job"
            subtext={worstJob ? worstJob.customer || worstJob.name || "Lowest job" : "No data"}
          />
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Hourly Rate by Day
          </h2>

          <div className="mt-6">
            <div className="flex h-44 items-end justify-between gap-3">
              {hourlyByDay.map((item) => (
                <div key={item.day} className="flex flex-1 flex-col items-center">
                  <div className="mb-2 flex h-36 items-end">
                    {item.height > 0 ? (
                      <div
                        className="w-7 rounded-t-md bg-amber-500"
                        style={{ height: `${item.height}px` }}
                        title={`${item.day}: £${item.value.toFixed(2)}/hr`}
                      />
                    ) : (
                      <div className="w-7" />
                    )}
                  </div>

                  <span className="text-sm font-semibold text-slate-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Best Job Types
          </h2>

          {jobTypes.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No jobs saved yet.</p>
          ) : (
            <div className="mt-5 space-y-5">
              {jobTypes.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-900">{item.name}</span>
                    <span className="font-bold text-slate-900">
                      £{item.avgHourly.toFixed(0)}/hr
                    </span>
                  </div>

                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div
                      className="h-2.5 rounded-full bg-amber-500"
                      style={{ width: item.width }}
                    />
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {item.count} job{item.count === 1 ? "" : "s"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function InsightCard({ icon, iconColor, value, label, subtext }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`text-2xl font-semibold ${iconColor}`}>{icon}</div>
      <div className="mt-5">
        <p className="text-4xl font-bold tracking-tight text-slate-900">{value}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{label}</p>
        <p className="mt-1 text-lg text-slate-500">{subtext}</p>
      </div>
    </div>
  );
}