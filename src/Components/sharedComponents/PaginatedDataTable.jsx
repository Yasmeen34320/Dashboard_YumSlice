{/*
  1. columns
    A dynamic array where each item describes a column with:

    label: Header name to show in <th>

    key: Used to get the field from the data object, e.g., row[key]

    render: (optional) A custom render function that overrides default rendering

    thClassName / tdClassName: (optional) Custom styles for header/data cells

  2. data array

  3. rowsPerPage
    number of items per page
*/}

import React, { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PaginatedDataTable = ({ columns, data, rowsPerPage = 10 }) => {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const goToPage = (p) => {
    if (p >= 1 && p <= pageCount) setPage(p);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 font-semibold ${col.thClassName || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition">
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap ${col.tdClassName || ''}`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-5 text-center text-gray-500">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 px-6 py-4 bg-gray-50 border-t">
        <div className="text-sm text-gray-600">
          Showing{' '}
          <strong>
            {Math.min((page - 1) * rowsPerPage + 1, data.length)}–
            {Math.min(page * rowsPerPage, data.length)}
          </strong>{' '}
          of <strong>{data.length}</strong> results
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiChevronLeft />
          </button>

          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                page === i + 1
                  ? 'bg-orange-950 text-white border-orange-950'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-100'
              } transition`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === pageCount}
            className="px-2 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginatedDataTable;
