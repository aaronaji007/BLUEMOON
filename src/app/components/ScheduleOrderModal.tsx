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
  spicy_level: string;
  quantity: number;
}

interface ScheduleOrderModalProps {
  item: FoodItem;
  onClose: () => void;
  onAddToCart: (item: FoodItem, quantity: number, specialNote: string) => void;
  scheduledDate: string;
  scheduledTime: string;
  serviceType: string;
}

const ScheduleOrderModal: React.FC<ScheduleOrderModalProps> = ({
  item,
  onClose,
  onAddToCart,
  scheduledDate,
  scheduledTime,
  serviceType,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 md:px-6">
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 w-full max-w-4xl md:max-w-5xl h-[90%] md:h-[80%] rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden relative transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full transition duration-200 ease-in-out"
        >
          <IoMdClose size={24} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 max-h-[50vh] md:max-h-full overflow-hidden rounded-lg shadow-md">
          <div className="w-full h-full">
            <img
              src={item.image_url || "/placeholder.jpg"}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-auto max-h-[50vh] md:max-h-[90vh]">
          <div className="text-gray-900">
            <h2 className="text-2xl sm:text-3xl font-extrabold">{item.name}</h2>
            <p className="text-gray-700 mt-2 text-sm sm:text-lg">{item.description}</p>

            <div className="mt-4">
              <span className="text-lg font-medium">Service Type:</span>
              <span className="text-blue-600 font-bold ml-2">{serviceType}</span>
            </div>

            <div className="mt-4">
              <label className="text-lg font-medium">Special Instructions</label>
              <textarea
                placeholder="Leave a note"
                className="w-full mt-2 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 ease-in-out"
                rows={4}
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
              ></textarea>
            </div>

            {/* Updated Scheduled Date and Time Structure */}
            <div className="mt-6 rounded-lg shadow-lg overflow-hidden bg-blue-50">
              <div className="px-2 py-1 bg-blue-100 flex items-center text-sm text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-3 text-blue-500">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 8.25a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold text-lg text-blue-700">Date:</span>
                  <span className="ml-2 text-md font-medium text-blue-800">{scheduledDate}</span>
                </div>
              </div>
              <div className="px-2 py-1 bg-white flex items-center text-sm text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-3 text-indigo-500">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 9a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0V9.75A.75.75 0 0012 9zM12 15a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H12z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold text-lg text-indigo-700">Time:</span>
                  <span className="ml-2 text-md font-medium text-indigo-800">{scheduledTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="bg-gray-200 text-gray-900 px-4 py-2 rounded-full transition duration-200 hover:bg-gray-300 text-xl font-semibold"
                >
                  -
                </button>
                <span className="text-xl font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="bg-green-500 text-white px-4 py-2 rounded-full transition duration-200 hover:bg-green-400 text-xl font-semibold"
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
              className="w-full mt-4 py-3 bg-blue-700 text-white font-semibold rounded-lg text-lg hover:bg-blue-600 transition-all duration-200 ease-in-out"
            >
              Add to Scheduled Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleOrderModal;
