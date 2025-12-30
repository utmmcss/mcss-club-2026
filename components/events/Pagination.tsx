const Pagination = ({
  meta,
  onPageChange,
}: {
  meta: any;
  onPageChange: (p: number) => void;
}) => {
  if (!meta) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        className="px-3 py-1 rounded bg-muted/20"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        Previous
      </button>

      <div>
        Page {meta.page} of {meta.totalPages}
      </div>

      <button
        className="px-3 py-1 rounded bg-muted/20"
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPageChange(meta.page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
