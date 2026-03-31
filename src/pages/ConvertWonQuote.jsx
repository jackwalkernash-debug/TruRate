import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { getQuoteById, updateQuote } from "../lib/quotes";
import { saveWonQuoteAsJob, getJobByLinkedQuoteId } from "../lib/jobs";

export default function ConvertWonQuote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quote = useMemo(() => getQuoteById(id), [id]);

  const [materials, setMaterials] = useState("");
  const [hours, setHours] = useState("");
  const [travel, setTravel] = useState("");
  const [message, setMessage] = useState("");

  if (!quote) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Quote <span className="text-amber-500">Not Found</span>
          </h1>
          <button
            onClick={() => navigate("/truquote/saved")}
            className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Back to Saved Quotes
          </button>
        </div>
      </AppShell>
    );
  }

  const handleConvert = () => {
    const materialsValue = Number(materials) || 0;
    const hoursValue = Number(hours) || 0;
    const travelValue = Number(travel) || 0;

    if (hoursValue <= 0) {
      setMessage("Time on job must be greater than 0.");
      return;
    }

    const existingJob = getJobByLinkedQuoteId(quote.id);
    if (existingJob) {
      setMessage("This quote has already been converted into a job.");
      return;
    }

    updateQuote({
      ...quote,
      status: "won",
    });

    saveWonQuoteAsJob(quote, {
      materials: materialsValue,
      hours: hoursValue,
      travel: travelValue,
    });

    navigate("/trurate/history");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Convert <span className="text-amber-500">Won Quote</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter the actual job details so TruRate can calculate the real hourly rate.
        </p>

        {message && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
            {message}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            {quote.quoteTitle || "Untitled Quote"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {quote.customerName || "No customer name"}
          </p>
          <p className="mt-3 text-sm text-slate-700">
            <strong>Quote Total:</strong> £{Number(quote.total || 0).toFixed(2)}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Materials Cost (£)
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 p-3"
                type="number"
                min="0"
                step="0.01"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Time on Job (hours)
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 p-3"
                type="number"
                min="0"
                step="0.1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Travel Time (hours)
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 p-3"
                type="number"
                min="0"
                step="0.1"
                value={travel}
                onChange={(e) => setTravel(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleConvert}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
            >
              Save as Won Job
            </button>

            <button
              onClick={() => navigate("/truquote/saved")}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-900"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}