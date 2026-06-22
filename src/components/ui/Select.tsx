import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  loading = false,
  className = "",
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={className} ref={selectRef}>
      {label && (
        <label className="block text-xs text-zinc-500 mb-1.5">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`
            w-fit flex items-center justify-between gap-2 text-xs
            rounded-full border bg-white/[0.04] px-3 py-1 text-white outline-none transition
            ${
              disabled || loading
                ? "border-zinc-800 text-zinc-500 cursor-not-allowed"
                : "border-white/10 hover:border-sky-500/50 focus:border-sky-500"
            }
          `}
        >
          <span className="truncate">
            {selectedOption?.label || placeholder}
          </span>
          {loading ? (
            <Loader2 size={16} className="animate-spin text-sky-400" />
          ) : isOpen ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </button>

        {isOpen && !disabled && !loading && (
          <div className="absolute overflow-x-hidden overflow-y-auto bottom-6 mb-1 z-10 w-full max-h-60 rounded-xl border border-white/10 bg-[#020617] py-1 shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full text-xs whitespace-normal wrap-break-word px-3 py-1 text-left transition
                  ${value === option.value
                    ? "bg-sky-500/20 text-sky-300"
                    : "text-white hover:bg-white/5"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
            {options.length === 0 && (
              <div className="px-4 py-2 text-sm text-zinc-500">No options available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;