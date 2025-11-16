"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => {
        // Ensure we always set an array
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else if (res.data && Array.isArray(res.data.users)) {
          setUsers(res.data.users);
        } else {
          setUsers([]); // fallback if API returns unexpected shape
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">🧑‍🤝‍🧑 User Management</h1>

      <table className="w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Email</th>
            <th>Role</th>
            <th>Subscription</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u._id} className="border-t">
              <td className="p-3">{u.email}</td>
              <td>{u.role}</td>
              <td>{u.subscribed ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
