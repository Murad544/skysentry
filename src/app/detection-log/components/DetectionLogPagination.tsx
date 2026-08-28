'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DetectionLogPaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  total: number;
  pageSizeOptions: number[];
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

export default function DetectionLogPagination({
  page,
  totalPages,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: DetectionLogPaginationProps) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <div className="flex items-center gap-3">
        <span className="text-[12px] text-muted-foreground font-tabular">
          {start}–{end} of {total} events
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-muted-foreground">Show</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-muted border border-border rounded px-2 py-1 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((s) => (
              <option key={`page-size-${s}`} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-[12px] text-muted-foreground">per page</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p) => (
          <button
            key={`page-${p}`}
            onClick={() => onPageChange(p)}
            className={`w-7 h-7 flex items-center justify-center rounded text-[12px] font-medium transition-all duration-150 ${
              p === page
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            aria-label={`Go to page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}