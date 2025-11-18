"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import api from "@/lib/api";
import SubscriptionStatus from "../../../components/SubscriptionStatus";
import AIModule from "./components/AIMODULE";
import ProduceList from "./components/ProduceList";
import CartModal from "./components/CartModal";
import FarmerModal from "./components/FarmerModal";

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

export default function FoodbankDashboard() {
  const { user } = useUser();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Item[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Item | null>(null);

  useEffect(() => {
    const fetchProduce = async () => {
      try {
        const res = await api.get("/produce");
        setItems(res.data || []);
      } catch (err) {
        console.error("Failed to fetch produce:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduce();
  }, []);

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        return prev.map((i) =>
          i._id === item._id
            ? { ...i, cartQuantity: (i.cartQuantity || 1) + 1 }
            : i
        );
      }
      return [...prev, { ...item, cartQuantity: 1 }];
    });
  };

  const removeFromCart = (_id: string) => {
    setCart((prev) => prev.filter((i) => i._id !== _id));
  };

  const checkout = async () => {
    if (!user) return alert("Please log in first");

    const buyerId = user.id;
    const buyerEmail = user.emailAddresses[0].emailAddress;
    const redirectUrl = "http://localhost:3000/foodbank/checkout-success";

    try {
      const res = await api.post("/purchase/create", {
        cartItems: cart,
        buyerId,
        buyerEmail,
        redirectUrl,
      });
      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Checkout failed. Please try again.");
    }
  };

  const openModal = (farmer: Item) => setSelectedFarmer(farmer);
  const closeModal = () => setSelectedFarmer(null);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">🏛️ Foodbank Dashboard</h1>

      <SubscriptionStatus />

      <button
        className="mb-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        onClick={() => setShowCart(true)}
      >
        🛒 Cart ({cart.reduce((sum, i) => sum + (i.cartQuantity || 0), 0)})
      </button>

      <div className="grid grid-cols-2 gap-4">
        <AIModule />
        <ProduceList
          produceList={items}
          loading={loading}
          addToCart={addToCart}
          openModal={openModal}
        />
      </div>

      {showCart && (
        <CartModal
          items={cart}
          onClose={() => setShowCart(false)}
          onCheckout={checkout}
          onRemove={removeFromCart}
        />
      )}

      {selectedFarmer && (
        <FarmerModal farmer={selectedFarmer} closeModal={closeModal} />
      )}
    </div>
  );
}
