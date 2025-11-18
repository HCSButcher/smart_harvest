"use client";

import { FC } from "react";

type Item = {
  _id: string;
  name: string;
  quantity: number;
  unit?: string;
  price: number;
  farmerName: string;
  farmerEmail: string;
};

type Props = {
  produceList: Item[];
  loading: boolean;
  addToCart: (item: Item) => void;
  openModal: (farmer: Item) => void;
};

const ProduceList: FC<Props> = ({
  produceList,
  loading,
  addToCart,
  openModal,
}) => {
  if (loading) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <p className="text-gray-600">Loading available produce...</p>
      </div>
    );
  }

  if (!produceList.length) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <p className="text-gray-600">No produce available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {produceList.map((it) => (
        <div key={it._id} className="bg-white p-4 rounded shadow">
          <div className="font-semibold">{it.name}</div>
          <div className="text-sm text-gray-600 mt-1">
            {it.quantity} {it.unit || "kg"} —{" "}
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => openModal(it)}
            >
              {it.farmerName}
            </button>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-blue-600 font-semibold">KES {it.price}</span>
            <button
              className="px-3 py-1 bg-green-600 text-white rounded"
              onClick={() => addToCart(it)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProduceList;
