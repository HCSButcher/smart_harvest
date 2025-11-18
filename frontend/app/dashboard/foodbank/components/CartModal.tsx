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
  cartQuantity?: number;
};

type Props = {
  items: Item[];
  onClose: () => void;
  onCheckout: () => void;
  onRemove: (_id: string) => void;
};

const CartModal: FC<Props> = ({ items, onClose, onCheckout, onRemove }) => {
  const total = items.reduce(
    (acc, it) => acc + (it.cartQuantity || 0) * it.price,
    0
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-96 relative max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">🛒 Cart</h2>
        {items.length === 0 ? (
          <p className="text-gray-600">No items in cart</p>
        ) : (
          <>
            {items.map((it) => (
              <div
                key={it._id}
                className="flex justify-between items-center mb-2"
              >
                <div>
                  {it.name} ({it.cartQuantity} {it.unit || "kg"})
                </div>
                <div className="flex gap-2">
                  <span>
                    KES {(it.price * (it.cartQuantity || 0)).toFixed(0)}
                  </span>
                  <button
                    className="text-red-600"
                    onClick={() => onRemove(it._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 font-semibold">Total: KES {total}</div>
            <button
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
              onClick={onCheckout}
            >
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
