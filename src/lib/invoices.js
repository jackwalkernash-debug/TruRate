const STORAGE_KEY = "truinvoice_invoices";

export function getInvoices() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function getInvoiceById(id) {
  return getInvoices().find((invoice) => String(invoice.id) === String(id));
}

export function saveInvoice(invoice) {
  const invoices = getInvoices();

  const existingIndex = invoices.findIndex(
    (item) => String(item.id) === String(invoice.id)
  );

  if (existingIndex >= 0) {
    invoices[existingIndex] = invoice;
  } else {
    invoices.unshift(invoice);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

export function deleteInvoice(id) {
  const invoices = getInvoices().filter(
    (invoice) => String(invoice.id) !== String(id)
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

export function createInvoiceFromQuote(quote) {
  const now = new Date();

  return {
    id: `inv_${Date.now()}`,
    quoteId: quote.id,
    invoiceNumber: `INV-${Date.now()}`,
    invoiceTitle: quote.quoteTitle || "Untitled Invoice",
    customerName: quote.customerName || "",
    customerEmail: quote.customerEmail || "",
    customerAddress: quote.customerAddress || "",
    quoteNumber: quote.quoteNumber || "",
    status: "draft",
    issueDate: now.toISOString().slice(0, 10),
    notes: "",
    items: Array.isArray(quote.items)
      ? quote.items.map((item, index) => ({
          id: item.id || `item_${index}_${Date.now()}`,
          description: item.description || item.name || "",
          quantity: Number(item.quantity || 1),
          unitPrice: Number(item.unitPrice || item.price || 0),
          total:
            Number(item.total || 0) ||
            Number(item.quantity || 1) * Number(item.unitPrice || item.price || 0),
        }))
      : [],
    subtotal: Number(quote.subtotal || quote.total || 0),
    total: Number(quote.total || 0),
    createdAt: now.toISOString(),
  };
}