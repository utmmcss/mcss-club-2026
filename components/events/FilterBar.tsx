const FilterBar = ({
  filter,
  onChange,
}: {
  filter: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="mb-2">Events</h2>
        <p className="text-lg text-muted-foreground">
          Browse events — filter and paginate as needed.
        </p>
      </div>

      <div className="flex gap-2">
        {["all", "upcoming", "past"].map((f) => (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`px-3 py-1 rounded ${
              filter === f ? "bg-primary text-white" : "bg-muted/20"
            }`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
