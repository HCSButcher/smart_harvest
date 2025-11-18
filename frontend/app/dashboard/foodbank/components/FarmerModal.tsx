"use client";

type FarmerModalProps = {
  farmer: any;
  closeModal: () => void;
};

export default function FarmerModal({ farmer, closeModal }: FarmerModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-80 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-2">
          {farmer.farmerName || "Unknown Farmer"}
        </h2>
        <p>
          <strong>Email:</strong> {farmer.farmerEmail || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {farmer.contact || "N/A"}
        </p>
      </div>
    </div>
  );
}
