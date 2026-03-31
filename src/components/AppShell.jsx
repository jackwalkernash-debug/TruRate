import { Link, useLocation } from "react-router-dom";
import {
  Calculator,
  History,
  BarChart3,
  FileText,
  Receipt,
  PoundSterling,
} from "lucide-react";

export default function AppShell({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/truquote") {
      return location.pathname.startsWith("/truquote");
    }

    if (path === "/truinvoice") {
      return location.pathname.startsWith("/truinvoice");
    }

    return location.pathname.startsWith(path);
  };

  const getDesktopLinkStyle = (path) => ({
    display: "block",
    padding: "12px 14px",
    borderRadius: "14px",
    fontSize: "18px",
    fontWeight: 600,
    color: isActive(path) ? "#b45309" : "#334155",
    backgroundColor: isActive(path) ? "#fef3c7" : "transparent",
    textDecoration: "none",
    transition: "all 0.2s ease",
  });

  const sectionLabelStyle = {
    margin: "0 0 10px 0",
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#94a3b8",
  };

  const mobileNavItem = (path, label, Icon) => {
    const active = isActive(path);

    return (
      <Link
        to={path}
        className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-center no-underline"
        style={{ textDecoration: "none" }}
      >
        <Icon
          className="h-5 w-5"
          style={{ color: active ? "#f59e0b" : "#475569" }}
          strokeWidth={2.2}
        />
        <span
          className="text-[11px] font-medium leading-none"
          style={{ color: active ? "#b45309" : "#475569" }}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:block"
        style={{
          width: "270px",
          borderRight: "1px solid #e5e7eb",
          padding: "24px 18px",
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ marginBottom: "36px" }}>
          <Link
            to="/trurate/calculator"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                src="/favicon.svg"
                alt="TruRate logo"
                style={{
                  width: "42px",
                  height: "42px",
                  objectFit: "contain",
                  flexShrink: 0,
                  display: "block",
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#0f172a",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Tru<span style={{ color: "#f59e0b" }}>Rate</span>
              </h2>
            </div>
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div>
            <p style={sectionLabelStyle}>TruRate</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link to="/trurate/calculator" style={getDesktopLinkStyle("/trurate/calculator")}>
                Home
              </Link>
              <Link to="/trurate/history" style={getDesktopLinkStyle("/trurate/history")}>
                History
              </Link>
              <Link to="/trurate/insights" style={getDesktopLinkStyle("/trurate/insights")}>
                Insights
              </Link>
            </div>
          </div>

          <div>
            <p style={sectionLabelStyle}>TruQuote</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link to="/truquote" style={getDesktopLinkStyle("/truquote")}>
                Quotes
              </Link>
            </div>
          </div>

          <div>
            <p style={sectionLabelStyle}>TruInvoice</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link to="/truinvoice" style={getDesktopLinkStyle("/truinvoice")}>
                Invoices
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 bg-slate-50 pb-24 md:pb-0">
        {children}
      </main>

      {/* Mobile top brand bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Link
          to="/trurate/calculator"
          className="flex items-center gap-2 no-underline"
          style={{ textDecoration: "none" }}
        >
          <img
            src="/favicon.svg"
            alt="TruRate logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Tru<span className="text-amber-500">Rate</span>
          </span>
        </Link>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white md:hidden">
        <div className="mx-auto flex max-w-xl items-stretch">
          {mobileNavItem("/trurate/calculator", "Home", Calculator)}
          {mobileNavItem("/trurate/history", "History", History)}
          {mobileNavItem("/trurate/insights", "Insights", BarChart3)}
          {mobileNavItem("/truquote", "Quotes", FileText)}
          {mobileNavItem("/truinvoice", "Invoices", PoundSterling)}
        </div>
      </nav>
    </div>
  );
}