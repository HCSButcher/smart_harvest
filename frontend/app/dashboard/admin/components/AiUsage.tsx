"use client";
import { useEffect, useState } from "react";
import { fetchAiUsage } from "@/lib/admin";

export default function AiUsage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchAiUsage().then((res) => setLogs(res.logs));
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="font-bold text-lg mb-4">AI Usage</h2>

      {logs.map((log: any) => (
        <div key={log._id} className="border-b py-3">
          <p className="font-semibold">{log.userEmail}</p>
          <p className="text-gray-700">{log.prompt}</p>
        </div>
      ))}
    </div>
  );
}
