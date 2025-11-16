"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AiUsagePage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/admin/ai-usage")
      .then((res) => {
        // Ensure we always set an array
        if (Array.isArray(res.data)) {
          setLogs(res.data);
        } else if (res.data && Array.isArray(res.data.logs)) {
          setLogs(res.data.logs);
        } else {
          setLogs([]); // fallback for unexpected response
        }
      })
      .catch((err) => {
        console.error("Failed to fetch AI logs:", err);
        setLogs([]);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">🤖 AI Usage Logs</h1>

      <table className="w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">User</th>
            <th>Role</th>
            <th>Question</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l: any) => (
            <tr key={l._id} className="border-t">
              <td className="p-3">{l.email}</td>
              <td>{l.role}</td>
              <td>{l.question}</td>
              <td>{new Date(l.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
