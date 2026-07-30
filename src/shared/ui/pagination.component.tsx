interface PaginationProps {
  page: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, lastPage, total, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  const pages = Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
    if (lastPage <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= lastPage - 2) return lastPage - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-500">Всего: {total}</p>
      <div className="flex gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1 text-sm rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
        >
          ←
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 text-sm rounded border ${
              p === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page === lastPage}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1 text-sm rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
        >
          →
        </button>
      </div>
    </div>
  );
}
