import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePDF } from "react-to-pdf";
import AppShell from "../components/AppShell";
import { getInvoiceById } from "../lib/invoices";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const invoice = useMemo(() => getInvoiceById(id), [id]);

  const safeFileName = invoice?.invoiceNumber
    ? `${invoice.invoiceNumber}.pdf`
    : "invoice.pdf";

  const { toPDF, targetRef } = usePDF({
    filename: safeFileName,
    page: {
      margin: 12,
      format: "a4",
      orientation: "portrait",
    },
  });

  if (!invoice) {
    return (
      <AppShell>
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Invoice <span className="text-amber-500">Preview</span>
          </h1>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Invoice not found.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Invoice <span className="text-amber-500">Preview</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Review saved invoice details.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/truinvoice")}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Back to Invoices
            </button>

            <button
              onClick={() => toPDF()}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div ref={targetRef} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Invoice Title</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {invoice.invoiceTitle}
              </h2>
            </div>

            <div className="md:text-right">
              <p className="text-sm text-slate-500">Invoice Number</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {invoice.invoiceNumber}
              </h2>
            </div>

            <div>
              <p className="text-sm text-slate-500">Customer</p>
              <p className="mt-1 font-medium text-slate-900">
                {invoice.customerName || "-"}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                {invoice.customerAddress || "-"}
              </p>
            </div>

            <div className="md:text-right">
              <p className="text-sm text-slate-500">Issue Date</p>
              <p className="mt-1 font-medium text-slate-900">
                {invoice.issueDate || "-"}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Quote Ref: {invoice.quoteNumber || "-"}
              </p>
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
                {invoice.items.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-slate-500">
                      No invoice items.
                    </td>
                  </tr>
                ) : (
                  invoice.items.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 text-slate-900">{item.description}</td>
                      <td className="px-4 py-3 text-slate-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-slate-900">
                        £{Number(item.unitPrice || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        £{Number(item.total || 0).toFixed(2)}
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
                £{Number(invoice.subtotal || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-base font-semibold text-slate-900">Total</span>
              <span className="text-xl font-bold text-slate-900">
                £{Number(invoice.total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {invoice.notes ? (
            <div className="mt-8 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Notes</p>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                {invoice.notes}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}