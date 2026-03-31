import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { getQuotes, deleteQuote as removeQuote, updateQuote } from "../lib/quotes";
import { saveWonQuoteAsJob } from "../lib/jobs";

export default function SavedQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setQuotes(getQuotes());
  }, []);

  const refreshQuotes = () => {
    setQuotes(getQuotes());
  };

  const handleDelete = (id) => {
    removeQuote(id);
    refreshQuotes();
  };

  const handleOpen = (id) => {
    navigate(`/truquote/saved/${id}`);
  };

  const handleMarkWon = (quote) => {
    const updatedQuote = {
      ...quote,
      status: "won",
    };

    updateQuote(updatedQuote);
    saveWonQuoteAsJob(updatedQuote);
    refreshQuotes();
  };

  const handleMarkLost = (quote) => {
    const updatedQuote = {
      ...quote,
      status: "lost",
    };

    updateQuote(updatedQuote);
    refreshQuotes();
  };

  const handleCreateInvoice = (quote) => {
    navigate(`/truinvoice/create/${quote.id}`);
  };

  const filteredQuotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return quotes;

    return quotes.filter((quote) => {
      const quoteNumber = String(quote.quoteNumber || "").toLowerCase();
      const quoteTitle = String(quote.quoteTitle || "").toLowerCase();
      const customerName = String(quote.customerName || "").toLowerCase();
      const status = String(quote.status || "draft").toLowerCase();

      return (
        quoteNumber.includes(term) ||
        quoteTitle.includes(term) ||
        customerName.includes(term) ||
        status.includes(term)
      );
    });
  }, [quotes, searchTerm]);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Saved <span className="text-amber-500">Quotes</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              View, open and manage saved quotes.
            </p>
          </div>

          <div className="w-full md:max-w-sm">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Search quotes
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search quote no, title, customer..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {quotes.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">No quotes yet.</p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">No quotes match your search.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {quote.quoteTitle || "Untitled Quote"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {quote.customerName || "No customer name"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                      <span>
                        <strong>Quote No:</strong> {quote.quoteNumber || "001"}
                      </span>
                      <span>
                        <strong>Total:</strong> £{Number(quote.total || 0).toFixed(2)}
                      </span>
                      <span>
                        <strong>Status:</strong>{" "}
                        <span
                          className={
                            quote.status === "won"
                              ? "font-medium text-emerald-600"
                              : quote.status === "lost"
                              ? "font-medium text-red-600"
                              : "font-medium text-slate-700"
                          }
                        >
                          {quote.status || "draft"}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleOpen(quote.id)}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    >
                      Open
                    </button>

                    <button
                      onClick={() => handleMarkWon(quote)}
                      className="rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-600"
                    >
                      Won
                    </button>

                    <button
                      onClick={() => handleMarkLost(quote)}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                    >
                      Lost
                    </button>

                    {quote.status === "won" && (
                      <button
                        onClick={() => handleCreateInvoice(quote)}
                        className="rounded-xl border border-amber-200 px-4 py-2 text-sm font-medium text-amber-600"
                      >
                        Create Invoice
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(quote.id)}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}