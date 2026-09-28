"use client";

import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

interface FoodItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  quantity: number;
  spicy_level: string;
}

interface OrderModalProps {
  item: FoodItem;
  onClose: () => void;
  onAddToCart: (item: FoodItem, quantity: number, specialNote: string) => void;
  serviceType: string;
}

const OrderModal: React.FC<OrderModalProps> = ({
  item,
  onClose,
  onAddToCart,
  serviceType,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4 md:px-6">
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 w-full max-w-4xl md:max-w-5xl h-[90%] md:h-[80%] rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden relative transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <IoMdClose size={24} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 max-h-[40vh] md:max-h-full overflow-hidden rounded-lg shadow-md">
          <div className="w-full h-full relative">
            <img
              src={item.image_url || "/placeholder.jpg"}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-auto">
          <div className="text-gray-900">
            <h2 className="text-3xl font-extrabold text-blue-700">{item.name}</h2>
            <p className="text-gray-700 mt-2 text-lg leading-relaxed">{item.description}</p>

            <div className="mt-4">
              <span className="text-lg font-medium text-gray-800">Service:</span>
              <span className="ml-1 font-semibold text-blue-600 uppercase text-sm">{serviceType}</span>
            </div>

            <div className="mt-4">
              <label htmlFor="specialNote" className="block text-lg font-medium text-gray-800">
                Special Instructions
              </label>
              <textarea
                id="specialNote"
                placeholder="Leave a note for your order"
                className="w-full mt-2 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 ease-in-out"
                rows={4}
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="bg-gray-200 text-gray-900 px-4 py-2 rounded-full transition duration-200 hover:bg-gray-300 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  -
                </button>
                <span className="text-xl font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-xl font-semibold"
                >
                  +
                </button>
              </div>
              <span className="text-xl font-bold text-gray-900">${(item.price * quantity).toFixed(2)}</span>
            </div>

            <button
              onClick={() => {
                onAddToCart(item, quantity, specialNote);
                onClose();
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
