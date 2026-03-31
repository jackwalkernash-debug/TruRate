import { useEffect, useMemo, useState } from "react";
import { PoundSterling } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { getQuoteById, saveQuote, updateQuote } from "../lib/quotes";

function createEmptyItem() {
  return {
    description: "",
    quantity: 1,
    unitPrice: "",
  };
}

function isValidEmail(email) {
  if (!email.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  if (!phone.trim()) return true;
  return /^[\d\s+()-]{7,20}$/.test(phone.trim());
}

export default function Quotes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const existingQuote = useMemo(() => {
    if (!id) return null;
    return getQuoteById(id);
  }, [id]);

  const isEditMode = Boolean(existingQuote);

  const [quoteTitle, setQuoteTitle] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("001");
  const [agreedStartDate, setAgreedStartDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [scope, setScope] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("Payment due within 7 days of acceptance.");
  const [items, setItems] = useState([createEmptyItem()]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!existingQuote) return;

    setQuoteTitle(existingQuote.quoteTitle || "");
    setQuoteNumber(existingQuote.quoteNumber || "001");
    setAgreedStartDate(existingQuote.agreedStartDate || "");
    setCustomerName(existingQuote.customerName || "");
    setCustomerEmail(existingQuote.customerEmail || "");
    setCustomerPhone(existingQuote.customerPhone || "");
    setCustomerAddress(existingQuote.customerAddress || "");
    setScope(existingQuote.scope || "");
    setNotes(existingQuote.notes || "");
    setTerms(existingQuote.terms || "Payment due within 7 days of acceptance.");
    setItems(
      existingQuote.items && existingQuote.items.length
        ? existingQuote.items.map((item) => ({
            description: item.description || "",
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || "",
          }))
        : [createEmptyItem()]
    );
  }, [existingQuote]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const unit = Number(item.unitPrice) || 0;
      return sum + qty * unit;
    }, 0);

    return {
      subtotal,
      total: subtotal,
    };
  }, [items]);

  const updateItemField = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, createEmptyItem()]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    if (isEditMode && existingQuote) {
      setQuoteTitle(existingQuote.quoteTitle || "");
      setQuoteNumber(existingQuote.quoteNumber || "001");
      setAgreedStartDate(existingQuote.agreedStartDate || "");
      setCustomerName(existingQuote.customerName || "");
      setCustomerEmail(existingQuote.customerEmail || "");
      setCustomerPhone(existingQuote.customerPhone || "");
      setCustomerAddress(existingQuote.customerAddress || "");
      setScope(existingQuote.scope || "");
      setNotes(existingQuote.notes || "");
      setTerms(existingQuote.terms || "Payment due within 7 days of acceptance.");
      setItems(
        existingQuote.items && existingQuote.items.length
          ? existingQuote.items.map((item) => ({
              description: item.description || "",
              quantity: item.quantity || 1,
              unitPrice: item.unitPrice || "",
            }))
          : [createEmptyItem()]
      );
      setMessage("");
      return;
    }

    setQuoteTitle("");
    setQuoteNumber("001");
    setAgreedStartDate("");
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setCustomerAddress("");
    setScope("");
    setNotes("");
    setTerms("Payment due within 7 days of acceptance.");
    setItems([createEmptyItem()]);
    setMessage("");
  };

  const validateForm = () => {
    if (!customerName.trim()) {
      setMessage("Customer name is required.");
      return false;
    }

    if (!quoteTitle.trim()) {
      setMessage("Quote title is required.");
      return false;
    }

    if (!isValidEmail(customerEmail)) {
      setMessage("Please enter a valid customer email address.");
      return false;
    }

    if (!isValidPhone(customerPhone)) {
      setMessage("Please enter a valid customer phone number.");
      return false;
    }

    const validItems = items.filter(
      (item) => item.description.trim() && (Number(item.quantity) || 0) > 0
    );

    if (!validItems.length) {
      setMessage("Add at least one valid line item.");
      return false;
    }

    return true;
  };

  const buildQuotePayload = () => {
    const validItems = items.filter(
      (item) => item.description.trim() && (Number(item.quantity) || 0) > 0
    );

    return {
      ...(existingQuote || {}),
      quoteTitle,
      quoteNumber: quoteNumber.trim() || "001",
      agreedStartDate,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      scope,
      notes,
      terms,
      items: validItems,
      subtotal: totals.subtotal,
      total: totals.total,
      status: "draft",
    };
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const payload = buildQuotePayload();

    if (isEditMode) {
      updateQuote(payload);
      navigate(`/truquote/saved/${payload.id}`);
      return;
    }

    const saved = saveQuote(payload);
    navigate(`/truquote/saved/${saved.id}`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Tru<span className="text-amber-500">Quote</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {isEditMode
            ? "Edit your saved quote."
            : "Create professional quotes and send them to customers."}
        </p>

        {message && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
            {message}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Quote Details</h2>

            <div className="mt-4 grid gap-4">
              <input
                className="rounded-xl border border-slate-300 p-3"
                placeholder="Quote Title"
                value={quoteTitle}
                onChange={(e) => setQuoteTitle(e.target.value)}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-xl border border-slate-300 p-3"
                  placeholder="Quote Number"
                  value={quoteNumber}
                  onChange={(e) => setQuoteNumber(e.target.value)}
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Agreed Start Date
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-300 p-3"
                    type="date"
                    value={agreedStartDate}
                    onChange={(e) => setAgreedStartDate(e.target.value)}
                  />
                </div>
              </div>

              <textarea
                className="rounded-xl border border-slate-300 p-3"
                rows="4"
                placeholder="Scope of works"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Customer Details</h2>

            <div className="mt-4 grid gap-4">
              <input
                className="rounded-xl border border-slate-300 p-3"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <div>
                <input
                  className={`w-full rounded-xl border p-3 ${
                    customerEmail && !isValidEmail(customerEmail)
                      ? "border-red-400"
                      : "border-slate-300"
                  }`}
                  placeholder="Customer Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
                {customerEmail && !isValidEmail(customerEmail) && (
                  <p className="mt-1 text-xs text-red-600">
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              <div>
                <input
                  className={`w-full rounded-xl border p-3 ${
                    customerPhone && !isValidPhone(customerPhone)
                      ? "border-red-400"
                      : "border-slate-300"
                  }`}
                  placeholder="Customer Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
                {customerPhone && !isValidPhone(customerPhone) && (
                  <p className="mt-1 text-xs text-red-600">
                    Please enter a valid phone number.
                  </p>
                )}
              </div>

              <textarea
                className="rounded-xl border border-slate-300 p-3"
                rows="3"
                placeholder="Customer Address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Line Items</h2>
            <button
              onClick={addItem}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Add Item
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-12">
                <input
                  className="rounded-xl border border-slate-300 p-3 md:col-span-6"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItemField(index, "description", e.target.value)}
                />

                <input
                  className="rounded-xl border border-slate-300 p-3 md:col-span-2"
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItemField(index, "quantity", e.target.value)}
                />

                <div className="relative md:col-span-3">
                  <PoundSterling className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.unitPrice}
                    onChange={(e) => updateItemField(index, "unitPrice", e.target.value)}
                  />
                </div>

                <button
                  onClick={() => removeItem(index)}
                  className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 md:col-span-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Notes</h2>
            <textarea
              className="mt-4 w-full rounded-xl border border-slate-300 p-3"
              rows="4"
              placeholder="Additional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <h2 className="mt-6 text-lg font-semibold">Terms</h2>
            <textarea
              className="mt-4 w-full rounded-xl border border-slate-300 p-3"
              rows="4"
              placeholder="Terms and payment details"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Summary</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>£{totals.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleSave}
                className="rounded-xl bg-slate-900 px-4 py-3 font-medium text-white"
              >
                {isEditMode ? "Update Quote" : "Save Quote"}
              </button>

              <button
                onClick={resetForm}
                className="rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-900"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}