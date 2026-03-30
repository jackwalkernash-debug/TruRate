import { useState } from "react";

export default function InputField({
  label,
  prefix,
  suffix,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
  inputMode,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <div
        className={`
          relative flex items-center rounded-xl border bg-white px-4 py-3.5 transition-all duration-200
          ${focused ? "border-amber-500 shadow-lg shadow-amber-500/10" : "border-slate-200 shadow-sm"}
        `}
      >
        {Icon && (
          <Icon className="mr-3 h-5 w-5 text-slate-400" strokeWidth={2} />
        )}

        {prefix && (
          <span className="mr-1 text-lg font-semibold text-slate-400">{prefix}</span>
        )}

        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent text-lg font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />

        {suffix && (
          <span className="ml-2 text-sm font-medium text-slate-400">{suffix}</span>
        )}
      </div>
    </div>
  );
}