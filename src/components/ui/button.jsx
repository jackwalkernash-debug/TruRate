export function Button({ className = "", variant = "default", size = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-black text-white hover:opacity-90",
    ghost: "bg-transparent hover:bg-black/5"
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm"
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      {...props}
    />
  );
}