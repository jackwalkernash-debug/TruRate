import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { deleteInvoice, getInvoices } from "../lib/invoices";

export default function SavedInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  const refreshInvoices = () => {
    setInvoices(getInvoices());
  };

  const handleOpen = (id) => {
    navigate(`/truinvoice/${id}`);
  };

  const handleDelete = (id) => {
    deleteInvoice(id);
    refreshInvoices();
  };

  const filteredInvoices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return invoices;

    return invoices.filter((invoice) => {
      const invoiceNumber = String(invoice.invoiceNumber || "").toLowerCase();
      const invoiceTitle = String(invoice.invoiceTitle || "").toLowerCase();
      const customerName = String(invoice.customerName || "").toLowerCase();
      const quoteNumber = String(invoice.quoteNumber || "").toLowerCase();

      return (
        invoiceNumber.includes(term) ||
        invoiceTitle.includes(term) ||
        customerName.includes(term) ||
        quoteNumber.includes(term)
      );
    });
  }, [invoices, searchTerm]);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Saved <span className="text-amber-500">Invoices</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              View, open and manage saved invoices.
            </p>
          </div>

          <div className="w-full md:max-w-sm">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Search invoices
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search invoice no, customer, quote..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">No invoices yet.</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">No invoices match your search.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {invoice.invoiceTitle || "Untitled Invoice"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {invoice.customerName || "No customer name"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                      <span>
                        <strong>Invoice No:</strong> {invoice.invoiceNumber}
                      </span>
                      <span>
                        <strong>Total:</strong> £{Number(invoice.total || 0).toFixed(2)}
                      </span>
                      <span>
                        <strong>Date:</strong> {invoice.issueDate || "-"}
                      </span>
                      <span>
                        <strong>Quote Ref:</strong> {invoice.quoteNumber || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleOpen(invoice.id)}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    >
                      Open
                    </button>

                    <button
                      onClick={() => handleDelete(invoice.id)}
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