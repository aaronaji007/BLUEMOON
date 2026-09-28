'use client';
import Image from "next/image";
import { Facebook, Youtube } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 text-white bg-gradient-to-b from-black via-black to-transparent backdrop-blur-xl shadow-lg">
      {/* Top Bar */}
      <div className="hidden lg:flex justify-between items-center px-10 py-1.5 text-lg font-medium bg-black border-b border-gray-800">
        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center gap-2 hover:text-white transition">
            <FaPhoneAlt className="w-4 h-4" />
            <span>0422 306 777</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white transition">
            <FaEnvelope className="w-4 h-4" />
            <span>contact@bluemoonrestaurants.com</span>
          </div>
        </div>
        <div className="flex items-center gap-5 text-blue-400">
          <a href="/QRCode.jpg" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="w-5 h-5 hover: transition duration-200" />
          </a>
          <Link href="https://www.facebook.com/bluemmoonrestaurant/" target="_blank">
            <Facebook className="w-5 h-5 hover:text-blue-500 transition duration-200" />
          </Link>
          <Link href="https://www.youtube.com/channel/UCjDVQoe48ygvcF4a3lRiz7w" target="_blank">
            <Youtube className="w-5 h-5 hover:text-red-500 transition duration-200" />
          </Link>
          <a href="https://www.instagram.com/bluemoonrestaurant1/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="w-5 h-5 hover:text-pink-400 transition duration-200" />
          </a>
        </div>
      </div>

      {/* Centered Branding */}
      <nav className="px-10 py-3 flex justify-center items-center bg-black/60">
        <div className="flex items-center gap-5 text-center">
          <Image
            src="/LOGO.jpg"
            alt="Bluemoon Logo"
            width={78}
            height={78}
            className="rounded-full"
          />
          <div className="leading-tight">
            <h1 className="text-4xl font-black uppercase tracking-widest text-blue-500 glow-text animate-pulse-slow">
              BLUEMOON
            </h1>
            <p className="text-2xl font-semibold uppercase text-gray-300 tracking-wider">
              Restaurant
            </p>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.9), 0 0 20px rgba(59, 130, 246, 0.6);
        }
        @keyframes pulse-slow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.8), 0 0 25px rgba(59, 130, 246, 0.4);
            transform: scale(1);
          }
          50% {
            text-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 35px rgba(59, 130, 246, 0.7);
            transform: scale(1.03);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.0s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
}
