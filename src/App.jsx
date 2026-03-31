import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Insights from "./pages/Insights";
import Quotes from "./pages/Quotes";
import SavedQuotes from "./pages/SavedQuotes";
import QuoteDetail from "./pages/QuoteDetail";
import ConvertWonQuote from "./pages/ConvertWonQuote";
import SavedInvoices from "./pages/SavedInvoices";
import CreateInvoiceFromQuote from "./pages/CreateInvoiceFromQuote";
import InvoiceDetail from "./pages/InvoiceDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/trurate/calculator" replace />} />

        <Route path="/truquote" element={<Quotes />} />
        <Route path="/truquote/edit/:id" element={<Quotes />} />
        <Route path="/truquote/saved" element={<SavedQuotes />} />
        <Route path="/truquote/saved/:id" element={<QuoteDetail />} />
        <Route path="/truquote/convert-won/:id" element={<ConvertWonQuote />} />

        <Route path="/truinvoice" element={<SavedInvoices />} />
        <Route path="/truinvoice/create/:id" element={<CreateInvoiceFromQuote />} />
        <Route path="/truinvoice/:id" element={<InvoiceDetail />} />

        <Route path="/trurate/calculator" element={<Home />} />
        <Route path="/trurate/history" element={<History />} />
        <Route path="/trurate/insights" element={<Insights />} />
      </Routes>
    </Router>
  );
}

export default App;