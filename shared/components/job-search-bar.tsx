import type { FormHTMLAttributes, ReactNode } from "react";

import type { JobCountry } from "../jobs/search-url";

type IconProps = { className?: string };

function IconBriefcase({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}

function IconMapPin({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconSearch({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

const FORM_CLASS = [
  "grid w-full grid-cols-1 gap-3 rounded-2xl border border-border/80 bg-card/95 p-4",
  "shadow-search-float backdrop-blur-sm",
  "md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_11.5rem_auto] md:items-center md:gap-2 md:p-3",
  "lg:gap-3 lg:p-4",
].join(" ");

const TEXT_INPUT_CLASS = [
  "block h-12 w-full min-w-0 rounded-xl border border-input/80 bg-background py-2 pl-11 pr-3",
  "text-sm text-foreground shadow-sm ring-offset-background",
  "placeholder:text-muted-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guava-pink/40",
].join(" ");

const SELECT_CLASS = [
  "block h-12 w-full min-w-0 appearance-none rounded-xl border border-input/80 bg-background px-3",
  "text-sm text-foreground shadow-sm",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guava-pink/40",
].join(" ");

const BUTTON_CLASS = [
  "inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl",
  "bg-guava-pink-gradient px-5 text-sm font-medium text-white shadow-md",
  "transition-opacity hover:opacity-90 disabled:opacity-60",
  "md:w-auto md:min-w-[9.5rem] md:justify-self-end md:px-6",
].join(" ");

const DEFAULT_Q_PLACEHOLDER =
  "Junior AI engineer, React developer, solutions engineer…";

export type JobSearchBarFormProps = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "children"
> & {
  idPrefix?: string;
  defaultQ?: string;
  defaultWhere?: string;
  defaultCountry?: JobCountry;
  qPlaceholder?: string;
  q?: string;
  onQChange?: (value: string) => void;
  submitLabel?: string;
  pending?: boolean;
  className?: string;
  children?: ReactNode;
};

export function JobSearchBarForm({
  idPrefix = "job-search",
  defaultQ = "",
  defaultWhere = "",
  defaultCountry = "gb",
  qPlaceholder = DEFAULT_Q_PLACEHOLDER,
  q,
  onQChange,
  submitLabel = "Find jobs",
  pending = false,
  className = "",
  children,
  ...formProps
}: JobSearchBarFormProps) {
  const qControlled = q !== undefined && onQChange !== undefined;
  const cityPlaceholder =
    defaultCountry === "de" ? "City, e.g. Berlin" : "City, e.g. London";

  return (
    <form {...formProps} className={`${FORM_CLASS} ${className}`.trim()}>
      {children}

      <div className="relative min-w-0">
        <label htmlFor={`${idPrefix}-q`} className="sr-only">
          Keywords
        </label>
        <IconBriefcase className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-guava-pink/70" />
        <input
          id={`${idPrefix}-q`}
          name="q"
          type="search"
          placeholder={qPlaceholder}
          value={qControlled ? q : undefined}
          defaultValue={qControlled ? undefined : defaultQ}
          onChange={qControlled ? (e) => onQChange(e.target.value) : undefined}
          className={TEXT_INPUT_CLASS}
        />
      </div>

      <div className="relative min-w-0">
        <label htmlFor={`${idPrefix}-where`} className="sr-only">
          Location
        </label>
        <IconMapPin className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-guava-green/80" />
        <input
          id={`${idPrefix}-where`}
          name="where"
          type="search"
          placeholder={cityPlaceholder}
          defaultValue={defaultWhere}
          className={TEXT_INPUT_CLASS}
        />
      </div>

      <div className="relative min-w-0">
        <label htmlFor={`${idPrefix}-country`} className="sr-only">
          Market
        </label>
        <select
          id={`${idPrefix}-country`}
          name="country"
          defaultValue={defaultCountry}
          className={SELECT_CLASS}
        >
          <option value="gb">United Kingdom</option>
          <option value="de">Germany</option>
        </select>
      </div>

      <button type="submit" disabled={pending} className={BUTTON_CLASS}>
        <IconSearch className="size-4 shrink-0" />
        <span className="whitespace-nowrap">{pending ? "Searching…" : submitLabel}</span>
      </button>
    </form>
  );
}
