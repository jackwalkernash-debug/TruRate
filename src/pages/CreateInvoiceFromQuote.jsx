import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { getQuotes } from "../lib/quotes";
import { createInvoiceFromQuote, saveInvoice } from "../lib/invoices";

export default function CreateInvoiceFromQuote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quote, setQuote] = useState(null);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const quotes = getQuotes();
    const foundQuote = quotes.find((item) => String(item.id) === String(id));

    if (!foundQuote) {
      setQuote(null);
      setInvoice(null);
      return;
    }

    setQuote(foundQuote);
    setInvoice(createInvoiceFromQuote(foundQuote));
  }, [id]);

  const handleChange = (field, value) => {
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (itemId, field, value) => {
    setInvoice((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (String(item.id) !== String(itemId)) return item;

        const updatedItem = {
          ...item,
          [field]: field === "description" ? value : Number(value || 0),
        };

        const quantity = Number(
          field === "quantity" ? value : updatedItem.quantity || 0
        );
        const unitPrice = Number(
          field === "unitPrice" ? value : updatedItem.unitPrice || 0
        );

        return {
          ...updatedItem,
          total: quantity * unitPrice,
        };
      });

      const subtotal = updatedItems.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0
      );

      return {
        ...prev,
        items: updatedItems,
        subtotal,
        total: subtotal,
      };
    });
  };

  const handleSave = () => {
    if (!invoice) return;
    saveInvoice(invoice);
    navigate(`/truinvoice/${invoice.id}`);
  };

  if (quote === null && invoice === null) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create <span className="text-amber-500">Invoice</span>
          </h1>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Quote not found.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!invoice) return null;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create <span className="text-amber-500">Invoice</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Prefilled from won quote.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Save Invoice
          </button>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Invoice Details
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Invoice Title
                </label>
                <input
                  value={invoice.invoiceTitle}
                  onChange={(e) => handleChange("invoiceTitle", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Invoice Number
                </label>
                <input
                  value={invoice.invoiceNumber}
                  onChange={(e) => handleChange("invoiceNumber", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Customer Name
                </label>
                <input
                  value={invoice.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={invoice.issueDate}
                  onChange={(e) => handleChange("issueDate", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Customer Address
                </label>
                <textarea
                  rows="3"
                  value={invoice.customerAddress}
                  onChange={(e) => handleChange("customerAddress", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  rows="4"
                  value={invoice.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
                  placeholder="Payment terms, thank you note, bank details, etc."
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Summary</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Quote Number</span>
                <span className="font-medium text-slate-900">
                  {invoice.quoteNumber || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Items</span>
                <span className="font-medium text-slate-900">
                  {invoice.items.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">
                  £{Number(invoice.subtotal || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-lg font-bold text-slate-900">
                  £{Number(invoice.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Invoice Items</h2>

          {invoice.items.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No items found on this quote.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {invoice.items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 rounded-xl border border-slate-200 p-4 md:grid-cols-12"
                >
                  <div className="md:col-span-6">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Description
                    </label>
                    <input
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, "description", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Qty
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(item.id, "quantity", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(item.id, "unitPrice", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Total
                    </label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900">
                      £{Number(item.total || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}