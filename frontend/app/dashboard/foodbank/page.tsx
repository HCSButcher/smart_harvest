"use client";

import { useEffect, useState } from "react";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import api from "@/lib/api"; // axios/fetch wrapper

export default function FoodbankDashboard() {
  const [produceList, setProduceList] = useState<any[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/produce") // backend endpoint
      .then((res) => {
        setProduceList(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch produce:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const openModal = (farmer: any) => setSelectedFarmer(farmer);
  const closeModal = () => setSelectedFarmer(null);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">🏛️ Foodbank Dashboard</h1>
      <SubscriptionStatus />

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="font-bold text-lg mb-2">AI Food Demand Insights</h2>
          <p className="text-gray-600 text-sm">
            Analyze donation trends and forecast food needs with AI.
          </p>
        </div>

        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="font-bold text-lg mb-2">Browse Produce</h2>
          <p className="text-gray-600 text-sm mb-2">
            Find nearby produce and contact the farmer.
          </p>

          {loading ? (
            <p>Loading produce...</p>
          ) : produceList.length === 0 ? (
            <p>No produce available.</p>
          ) : (
            produceList.map((item) => (
              <div key={item._id} className="mb-2">
                <p className="font-medium">
                  {item.name} — {item.quantity} {item.unit} — KES {item.price}
                </p>
                <button
                  onClick={() => openModal(item)}
                  className="mt-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Contact Farmer
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedFarmer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal} // click outside closes modal
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-80 relative"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-2">
              {selectedFarmer.farmerName || "Unknown Farmer"}
            </h2>
            <p>
              <strong>Email:</strong> {selectedFarmer.farmerEmail || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {selectedFarmer.contact || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
