import { Link, useLocation } from "react-router-dom";
import { Calculator, Clock, BarChart2 } from "lucide-react";

const tabs = [
  { path: "/", label: "Calculator", icon: Calculator },
  { path: "/history", label: "History", icon: Clock },
  { path: "/insights", label: "Insights", icon: BarChart2 },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 inset-x-0 z-20 bg-card/90 backdrop-blur-xl border-t border-border/60">
      <div className="mx-auto max-w-lg flex">
        {tabs.map(({ path, label, icon: Icon }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
                active ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[11px] font-semibold tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}