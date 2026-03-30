import { motion } from "framer-motion";

export default function ResultCard({ label, value, sublabel, large, verdict }) {
  const verdictStyles = {
    great: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
    good: "from-amber-500/10 to-amber-600/5 border-amber-500/20",
    poor: "from-red-500/10 to-red-600/5 border-red-500/20",
    neutral: "from-card to-card border-transparent",
  };

  const verdictTextStyles = {
    great: "text-emerald-600",
    good: "text-amber-600",
    poor: "text-red-500",
    neutral: "text-foreground",
  };

  const style = verdict ? verdictStyles[verdict] : verdictStyles.neutral;
  const textStyle = verdict ? verdictTextStyles[verdict] : verdictTextStyles.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`
        rounded-2xl border-2 bg-gradient-to-br p-5 shadow-sm
        ${style}
        ${large ? "col-span-full" : ""}
      `}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </p>
      <p className={`font-mono font-bold ${large ? "text-4xl" : "text-2xl"} ${textStyle}`}>
        {value}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
      )}
    </motion.div>
  );
}