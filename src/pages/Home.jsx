import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PoundSterling, Clock, Truck, RotateCcw, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveJob } from "../lib/jobs";
import { toast } from "sonner";
import InputField from "../components/calculator/InputField";
import ResultCard from "../components/calculator/ResultCard";
import WorthIndicator from "../components/calculator/WorthIndicator";
import AppShell from "../components/AppShell";

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobPrice, setJobPrice] = useState("");
  const [materialsCost, setMaterialsCost] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [travelTime, setTravelTime] = useState("");

  const results = useMemo(() => {
    const price = parseFloat(jobPrice) || 0;
    const materials = parseFloat(materialsCost) || 0;
    const hours = parseFloat(hoursWorked) || 0;
    const travel = parseFloat(travelTime) || 0;

    if (price <= 0 || hours <= 0) return null;

    const profit = price - materials;
    const totalHours = hours + travel;
    const hourlyRate = totalHours > 0 ? profit / totalHours : 0;
    const profitMargin = price > 0 ? (profit / price) * 100 : 0;

    return {
      profit,
      hourlyRate,
      totalHours,
      profitMargin,
    };
  }, [jobPrice, materialsCost, hoursWorked, travelTime]);

  const getVerdict = (rate) => {
    if (rate >= 30) return "great";
    if (rate >= 15) return "good";
    return "poor";
  };

  const handleReset = () => {
    setJobTitle("");
    setJobPrice("");
    setMaterialsCost("");
    setHoursWorked("");
    setTravelTime("");
  };

  const hasInput = jobTitle || jobPrice || materialsCost || hoursWorked || travelTime;

  const handleSave = () => {
    if (!results) return;

    if (!jobTitle.trim()) {
      toast.error("Enter a project or quote name");
      return;
    }

    saveJob({
      title: jobTitle.trim(),
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      price: parseFloat(jobPrice),
      materials: parseFloat(materialsCost) || 0,
      hours: parseFloat(hoursWorked),
      travel: parseFloat(travelTime) || 0,
      profit: results.profit,
      hourlyRate: results.hourlyRate,
    });

    toast.success("Job saved to history!");
    handleReset();
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
          <div className="mx-auto max-w-2xl space-y-8">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                Tru<span className="text-amber-500">Rate</span>
              </h1>
              <p className="text-sm text-slate-600 md:text-base">
                Calculate your real hourly rate instantly
              </p>
            </div>

            <div className="space-y-4">
              <InputField
                label="Project / Quote Name"
                value={jobTitle}
                onChange={setJobTitle}
                placeholder="e.g. Boiler Service"
                icon={Briefcase}
                type="text"
              />

              <InputField
                label="Job Price"
                value={jobPrice}
                onChange={setJobPrice}
                placeholder="0.00"
                icon={PoundSterling}
                type="number"
                inputMode="decimal"
              />

              <InputField
                label="Materials Cost"
                value={materialsCost}
                onChange={setMaterialsCost}
                placeholder="0.00"
                icon={PoundSterling}
                type="number"
                inputMode="decimal"
              />

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Time Worked"
                  suffix="hrs"
                  value={hoursWorked}
                  onChange={setHoursWorked}
                  placeholder="0"
                  icon={Clock}
                  type="number"
                  inputMode="decimal"
                />

                <InputField
                  label="Travel Time"
                  suffix="hrs"
                  value={travelTime}
                  onChange={setTravelTime}
                  placeholder="0"
                  icon={Truck}
                  type="number"
                  inputMode="decimal"
                />
              </div>
            </div>

            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      Your Results
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <ResultCard
                    label="Your Real Hourly Rate"
                    value={`£${results.hourlyRate.toFixed(2)}/hr`}
                    sublabel={`Based on ${results.totalHours.toFixed(1)} total hours`}
                    large
                    verdict={getVerdict(results.hourlyRate)}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      label="Profit"
                      value={`£${results.profit.toFixed(2)}`}
                      verdict={results.profit > 0 ? "good" : "poor"}
                    />
                    <ResultCard
                      label="Profit Margin"
                      value={`${results.profitMargin.toFixed(0)}%`}
                      verdict={results.profitMargin > 30 ? "good" : "poor"}
                    />
                  </div>

                  <WorthIndicator hourlyRate={results.hourlyRate} />

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      className="h-14 w-full rounded-2xl border-0 !bg-amber-500 text-base font-bold !text-slate-900 shadow-sm hover:!bg-amber-400"
                    >
                      Save Job
                    </Button>

                    {hasInput && (
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        className="h-14 rounded-2xl px-5"
                      >
                        <RotateCcw className="mr-1.5 h-4 w-4" />
                        Reset
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!results && (
              <div className="py-10 text-center text-slate-500">
                Enter your job details to calculate your real hourly rate
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}