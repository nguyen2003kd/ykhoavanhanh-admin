"use client";

import { useState, useMemo, useEffect } from "react";
import { TablePagination } from "./TablePagination";

const DEFAULT_PAGE_SIZE = 10;

interface ListPageLayoutProps<T> {
  items: T[];
  renderFilters?: React.ReactNode;
  renderSearch?: React.ReactNode;
  renderTable: (pagedItems: T[]) => React.ReactNode;
  resetPageKey?: string | number;
  isLoading?: boolean;
  loadingText?: string;
  errorNode?: React.ReactNode;
}

export function ListPageLayout<T>({
  items,
  renderFilters,
  renderSearch,
  renderTable,
  resetPageKey,
  isLoading,
  loadingText = "Đang tải dữ liệu...",
  errorNode,
}: ListPageLayoutProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => { setCurrentPage(1); }, [resetPageKey]);

  const pagedItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize],
  );

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-sm text-gray-600 text-center">
        {loadingText}
      </div>
    );
  }

  if (errorNode) return <>{errorNode}</>;

  return (
    <div className="space-y-4">
      {renderFilters && <div>{renderFilters}</div>}
      {renderSearch && <div>{renderSearch}</div>}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {items.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-gray-400">
            Không có dữ liệu để hiển thị.
          </div>
        ) : (
          renderTable(pagedItems)
        )}
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={items.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
        />
      </div>
    </div>
  );
}
