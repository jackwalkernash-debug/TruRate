import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePDF } from "react-to-pdf";
import AppShell from "../components/AppShell";
import { getQuotes } from "../lib/quotes";

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const quote = useMemo(() => {
    const quotes = getQuotes();
    return quotes.find((item) => String(item.id) === String(id));
  }, [id]);

  const safeFileName = quote?.quoteNumber
    ? `${quote.quoteNumber}.pdf`
    : "quote.pdf";

  const { toPDF, targetRef } = usePDF({
    filename: safeFileName,
    page: {
      margin: 12,
      format: "a4",
      orientation: "portrait",
    },
  });

  if (!quote) {
    return (
      <AppShell>
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Quote <span className="text-amber-500">Preview</span>
          </h1>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Quote not found.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const items = Array.isArray(quote.items) ? quote.items : [];

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Quote <span className="text-amber-500">Preview</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Review saved quote details.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/truquote/saved")}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Back to Quotes
            </button>

            <button
              onClick={() => navigate(`/truquote/edit/${quote.id}`)}
              className="rounded-xl border border-amber-200 px-4 py-2 text-sm font-medium text-amber-600"
            >
              Edit Quote
            </button>

            <button
              onClick={() => toPDF()}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div
          ref={targetRef}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Quote Title</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {quote.quoteTitle || "Untitled Quote"}
              </h2>
            </div>

            <div className="md:text-right">
              <p className="text-sm text-slate-500">Quote Number</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {quote.quoteNumber || "001"}
              </h2>
            </div>

            <div>
              <p className="text-sm text-slate-500">Customer</p>
              <p className="mt-1 font-medium text-slate-900">
                {quote.customerName || "-"}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                {quote.customerAddress || "-"}
              </p>
              {quote.customerEmail ? (
                <p className="mt-1 text-sm text-slate-600">{quote.customerEmail}</p>
              ) : null}
            </div>

            <div className="md:text-right">
              {quote.createdAt ? (
                <>
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </p>
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-slate-500">
                      No quote items.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-t border-slate-200"
                    >
                      <td className="px-4 py-3 text-slate-900">
                        {item.description || item.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-900">
                        {Number(item.quantity || 0)}
                      </td>
                      <td className="px-4 py-3 text-slate-900">
                        £{Number(item.unitPrice || item.price || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        £
                        {Number(
                          item.total ||
                            Number(item.quantity || 0) *
                              Number(item.unitPrice || item.price || 0)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 ml-auto max-w-sm space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-900">
                £{Number(quote.subtotal || quote.total || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-base font-semibold text-slate-900">Total</span>
              <span className="text-xl font-bold text-slate-900">
                £{Number(quote.total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {quote.notes ? (
            <div className="mt-8 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Notes</p>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                {quote.notes}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}