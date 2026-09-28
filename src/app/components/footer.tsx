"use client"
import { useState } from "react";
import Link from 'next/link';
import { Facebook, Youtube, Mail, Phone } from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import SubscribeModal from "./SubscribeModal";

export default function Footer() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <footer className="bg-[#314ec4] text-white py-6 relative z-[50] w-full">
      <div className="max-w-7xl mx-auto px-4 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-48 text-center md:text-left">

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Quick Links</h2>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Menu", href: "/menu" },
               
                { name: "Gallery", href: "/gallery" },
                { name: "Contact Us", href: "/contact" },
              ].map((link, index) => (
                <li key={index} className="text-center md:text-left">
                  <Link href={link.href} className="relative inline-block pb-1 text-white hover:text-gray-200 transition-colors">
                    {link.name}
                  </Link>
                  <div className="w-28 h-[3px] bg-blue-700 mt-1 mx-auto md:mx-0 shadow-[0_2px_4px_#CFCFCF]"></div> 
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Info</h2>
            <p>Bluemoon Restaurant</p>
            <p>4 Station Street, Wentworthville</p>
            <p className="flex justify-center md:justify-start items-center gap-2">
              <Phone size={16} />
              <a href="tel:0422306777" className="hover:text-gray-200">0422 306 777</a>
            </p>
            <p className="flex justify-center md:justify-start items-center gap-2">
              <Mail size={16} />
              <a href="mailto:contact@bluemoonrestaurants.com" className="hover:text-gray-200">contact@bluemoonrestaurants.com              </a>
            </p>

            {/* Social Media Links */}
            <div className="flex justify-center md:justify-start gap-4">
              <Link href="https://www.facebook.com/bluemmoonrestaurant/" target="_blank"><Facebook size={24} className="cursor-pointer hover:text-gray-200" /></Link>
              <a href="https://www.instagram.com/bluemoonrestaurant1/" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
              </a>
              <Link href="https://www.youtube.com/channel/UCjDVQoe48ygvcF4a3lRiz7w" target="_blank"><Youtube size={24} className="cursor-pointer hover:text-gray-200" /></Link>
              <a href="/QRCode.jpg" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
              </a>
            </div>
          </div>

          {/* Buttons Centered */}
          <div className="flex flex-col items-center space-y-4">
            {/* ORDER ONLINE Button */}
            <Link 
              href="/order" 
              className="inline-block bg-white text-[#1e3799] text-center py-3 px-14 rounded-lg font-bold shadow-md hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              ORDER ONLINE 
            </Link>

            {/* RESERVE A TABLE Button */}
            <Link 
              href="/table" 
              className="inline-block border-2 border-white text-white text-center py-3 px-12 rounded-lg font-bold shadow-md hover:bg-white hover:text-[#1e3799] hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              RESERVE A TABLE
            </Link>

            {/* SUBSCRIBE FOR UPDATES Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="inline-block border-2 border-white text-white text-center py-3 px-4 rounded-lg font-bold shadow-md hover:bg-white hover:text-[#1e3799] hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              SUBSCRIBE FOR UPDATES
            </button>

            {/* WRITE A REVIEW Button */}
            <Link 
              href="/review" 
              className="inline-block border-2 border-white text-white text-center py-3 px-12 rounded-lg font-bold shadow-md hover:bg-white hover:text-[#1e3799] hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              WRITE A REVIEW
            </Link>
          </div>

        </div>
      </div>

      <div className="w-full text-center p-4">
        <p className="text-sm sm:text-base flex flex-col lg:flex-row lg:items-center relative">
          <span className="w-full lg:w-auto lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            © {new Date().getFullYear()} Bluemoon Restaurant. All rights reserved.
          </span>
          <span className="mt-2 lg:mt-0 lg:ml-auto lg:pr-4">Designed by Qodes Systems</span>
        </p>
      </div>



      {/* Popup Modal */}
      <SubscribeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </footer>
  );
}
