"use client";

import React from "react";

export default function SimpleTable<T extends { [k: string]: any }>({
  columns,
  data,
}: {
  columns: { key: keyof T | string; label: string }[];
  data: T[];
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="p-3">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, i) => (
            <tr key={i} className="border-b even:bg-gray-50">
              {columns.map((c) => (
                <td key={String(c.key)} className="p-3 align-top">
                  {String(row[c.key as string] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
