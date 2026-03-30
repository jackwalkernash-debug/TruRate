import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";

export default function WorthIndicator({ hourlyRate }) {
  let verdict, message, Icon, bgClass, textClass, iconClass;

  if (hourlyRate >= 30) {
    verdict = "Worth it";
    message = "Great rate — keep taking these jobs";
    Icon = ThumbsUp;
    bgClass = "bg-emerald-500/10 border-emerald-500/30";
    textClass = "text-emerald-600";
    iconClass = "text-emerald-500";
  } else if (hourlyRate >= 15) {
    verdict = "Okay";
    message = "Decent, but could price higher";
    Icon = Minus;
    bgClass = "bg-amber-500/10 border-amber-500/30";
    textClass = "text-amber-600";
    iconClass = "text-amber-500";
  } else {
    verdict = "Not worth it";
    message = "You're undercharging — rethink this one";
    Icon = ThumbsDown;
    bgClass = "bg-red-500/10 border-red-500/30";
    textClass = "text-red-500";
    iconClass = "text-red-500";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex items-center gap-4 rounded-2xl border-2 p-5 ${bgClass}`}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bgClass}`}>
        <Icon className={`h-6 w-6 ${iconClass}`} strokeWidth={2.5} />
      </div>
      <div>
        <p className={`text-lg font-bold ${textClass}`}>{verdict}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </motion.div>
  );
}