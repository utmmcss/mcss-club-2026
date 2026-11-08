const FilterBar = ({
  filter,
  onChange,
}: {
  filter: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <p className="font-sub text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Browse / Filter
      </p>

      <div
        role="group"
        aria-label="Filter events"
        className="inline-flex divide-x divide-mcss-ink/15 border border-mcss-ink/15"
      >
        {["all", "upcoming", "past"].map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => onChange(f)}
            className={`px-4 py-2.5 font-sub text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mcss-purple sm:px-6 ${
              filter === f
                ? "bg-mcss-ink text-mcss-paper"
                : "bg-transparent text-mcss-ink hover:bg-mcss-ink/5"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
