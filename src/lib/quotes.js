const STORAGE_KEY = "trurate_quotes";

export function getQuotes() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveQuote(quote) {
  const quotes = getQuotes();

  const newQuote = {
    ...quote,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    status: quote.status || "draft",
  };

  const updated = [newQuote, ...quotes];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return newQuote;
}

export function deleteQuote(id) {
  const quotes = getQuotes();
  const updated = quotes.filter((q) => String(q.id) !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateQuote(updatedQuote) {
  const quotes = getQuotes();
  const updated = quotes.map((q) =>
    String(q.id) === String(updatedQuote.id) ? updatedQuote : q
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updatedQuote;
}

export function getQuoteById(id) {
  const quotes = getQuotes();
  return quotes.find((q) => String(q.id) === String(id)) || null;
}