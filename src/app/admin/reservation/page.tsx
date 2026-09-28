// app/admin/reservation/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

interface Reservation {
  reservation_id: number;
  name: string;
  phone: string;
  email: string;
  reservation_date: string;
  reservation_start_time: string;
  reservation_end_time: string;
  no_of_guest: number;
  status: string;
  table_number: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reservation/get");
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      if (data.success) {
        setReservations(data.reservations);
      } else {
        throw new Error(data.error || "Failed to fetch reservations.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDeleteReservation = async (reservationId: number) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    try {
      toast.loading("Deleting...", { id: "deleteToast" });
      const response = await fetch("/api/reservation/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reservationId }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Deleted successfully!", { id: "deleteToast" });
        fetchReservations();
      } else {
        throw new Error(data.error || "Deletion failed.");
      }
    } catch (err) {
      toast.error(`Error: ${err instanceof Error ? err.message : "Unknown error"}`, {
        id: "deleteToast",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-xl text-gray-700">Loading reservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 px-6 py-12 mt-[100px]">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-center">
          <Link
            href="/adminDashboard"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full shadow-xl hover:scale-105 transform transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
        <h1 className="text-center text-4xl font-bold text-slate-800 mb-10 tracking-tight">
          🗓️ Manage Reservations
        </h1>

        {reservations.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No reservations found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-2xl rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-blue-700 text-white">
                <tr>
                  {[
                    "ID",
                    "Name",
                    "Contact",
                    "Date",
                    "Time",
                    "Guests",
                    "Table",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {reservations.map((r) => (
                  <tr key={r.reservation_id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{r.reservation_id}</td>
                    <td className="px-6 py-4">{r.name}</td>
                    <td className="px-6 py-4">
                      <p>{r.email}</p>
                      <p className="text-sm text-gray-500">{r.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(r.reservation_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {r.reservation_start_time} - {r.reservation_end_time}
                    </td>
                    <td className="px-6 py-4 text-center">{r.no_of_guest}</td>
                    <td className="px-6 py-4 text-center">{r.table_number}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          r.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteReservation(r.reservation_id)}
                        className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
