const box =
  "flex h-11 min-w-11 items-center justify-center border px-2 font-sub text-xs font-bold tracking-[0.2em] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcss-purple disabled:cursor-not-allowed disabled:opacity-40";

const Pagination = ({
  meta,
  onPageChange,
}: {
  meta: any;
  onPageChange: (p: number) => void;
}) => {
  if (!meta) return null;

  const pages = Array.from({ length: meta.totalPages ?? 0 }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        className={`${box} border-mcss-ink/15 hover:bg-mcss-ink/5`}
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        ←
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          aria-label={`Page ${p}`}
          aria-current={p === meta.page ? "page" : undefined}
          className={`${box} ${
            p === meta.page
              ? "border-mcss-ink bg-mcss-ink text-mcss-paper"
              : "border-mcss-ink/15 hover:bg-mcss-ink/5"
          }`}
          onClick={() => onPageChange(p)}
        >
          {String(p).padStart(2, "0")}
        </button>
      ))}

      <button
        type="button"
        aria-label="Next page"
        className={`${box} border-mcss-ink/15 hover:bg-mcss-ink/5`}
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPageChange(meta.page + 1)}
      >
        →
      </button>
    </nav>
  );
};

export default Pagination;
