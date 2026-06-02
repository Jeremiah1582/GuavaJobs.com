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

const FORM_SHELL_CLASS = [
  "rounded-xl border border-border/80 bg-card/95 p-2 shadow-search-float backdrop-blur-sm",
  "sm:rounded-2xl sm:p-2.5",
].join(" ");

/** Shared chrome for inputs, select, and submit — one visual row. */
const CONTROL_CLASS = [
  "h-10 w-full min-w-0 rounded-xl border border-input/80 bg-background text-sm text-foreground shadow-sm",
  "ring-offset-background",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guava-pink/40",
].join(" ");

const FORM_LAYOUT_CLASS = [
  "grid w-full min-w-[min(100%,28rem)] grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(5.75rem,0.72fr)_auto] items-stretch gap-2",
  "overflow-x-auto",
].join(" ");

const FIELD_WRAP_CLASS = "relative min-w-0";

const FIELD_ICON_CLASS =
  "pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2";

const TEXT_INPUT_CLASS = [
  CONTROL_CLASS,
  "block py-2 pl-11 pr-3",
  "placeholder:text-muted-foreground",
].join(" ");

const SELECT_CLASS = [
  CONTROL_CLASS,
  "block appearance-none truncate px-3",
].join(" ");

const BUTTON_CLASS = [
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl",
  "bg-guava-pink-gradient px-4 text-sm font-medium text-white shadow-md",
  "transition-opacity hover:opacity-90 disabled:opacity-60",
  "min-w-[9.5rem]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guava-pink/40",
].join(" ");

const DEFAULT_Q_PLACEHOLDER = "Role or keywords…";

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
  where?: string;
  onWhereChange?: (value: string) => void;
  country?: JobCountry;
  onCountryChange?: (value: JobCountry) => void;
  submitLabel?: string;
  pending?: boolean;
  /** When true, omits outer card chrome (parent supplies the shell). */
  embedded?: boolean;
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
  where,
  onWhereChange,
  country,
  onCountryChange,
  submitLabel = "Find jobs",
  pending = false,
  embedded = false,
  className = "",
  children,
  ...formProps
}: JobSearchBarFormProps) {
  const qControlled = q !== undefined && onQChange !== undefined;
  const whereControlled = where !== undefined && onWhereChange !== undefined;
  const countryControlled = country !== undefined && onCountryChange !== undefined;
  const cityPlaceholder = "City";
  const formClass = [
    embedded ? "" : FORM_SHELL_CLASS,
    FORM_LAYOUT_CLASS,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <form {...formProps} className={formClass}>
      {children}

      <div className={FIELD_WRAP_CLASS}>
        <label htmlFor={`${idPrefix}-q`} className="sr-only">
          Keywords
        </label>
        <IconBriefcase
          className={`${FIELD_ICON_CLASS} text-guava-pink/70`}
        />
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

      <div className={FIELD_WRAP_CLASS}>
        <label htmlFor={`${idPrefix}-where`} className="sr-only">
          Location
        </label>
        <IconMapPin className={`${FIELD_ICON_CLASS} text-guava-green/80`} />
        <input
          id={`${idPrefix}-where`}
          name="where"
          type="search"
          placeholder={cityPlaceholder}
          value={whereControlled ? where : undefined}
          defaultValue={whereControlled ? undefined : defaultWhere}
          onChange={
            whereControlled ? (e) => onWhereChange(e.target.value) : undefined
          }
          className={TEXT_INPUT_CLASS}
        />
      </div>

      <div className={FIELD_WRAP_CLASS}>
        <label htmlFor={`${idPrefix}-country`} className="sr-only">
          Market
        </label>
        <select
          id={`${idPrefix}-country`}
          name="country"
          value={countryControlled ? country : undefined}
          defaultValue={countryControlled ? undefined : defaultCountry}
          onChange={
            countryControlled
              ? (e) =>
                  onCountryChange(e.target.value === "de" ? "de" : "gb")
              : undefined
          }
          className={SELECT_CLASS}
        >
          <option value="gb">UK</option>
          <option value="de">Germany</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        className={BUTTON_CLASS}
        aria-label={pending ? "Searching" : submitLabel}
      >
        <IconSearch className="size-4 shrink-0" />
        <span className="whitespace-nowrap">
          {pending ? "Searching…" : submitLabel}
        </span>
      </button>
    </form>
  );
}
