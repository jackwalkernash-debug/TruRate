import { Link } from "react-router-dom";

export default function AppShell({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "220px",
          borderRight: "1px solid #ddd",
          padding: "20px",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <img
            src="/favicon.svg"
            alt="TruRate logo"
            style={{ width: "32px", height: "32px", objectFit: "contain" }}
          />
          <h2 style={{ margin: 0 }}>TruRate</h2>
        </div>

        <div>
          <p><strong>TruQuote</strong></p>
          <p><Link to="/truquote">Create Quote</Link></p>
          <p><Link to="/truquote/saved">Saved Quotes</Link></p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <p><strong>TruInvoice</strong></p>
          <p><Link to="/truinvoice">Saved Invoices</Link></p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <p><strong>TruRate</strong></p>
          <p><Link to="/trurate/calculator">Calculator</Link></p>
          <p><Link to="/trurate/history">History</Link></p>
          <p><Link to="/trurate/insights">Insights</Link></p>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "20px", background: "#f8fafc" }}>
        {children}
      </main>
    </div>
  );
}