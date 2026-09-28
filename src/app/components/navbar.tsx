"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Facebook, Youtube, MoreHorizontal } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram, FaUser } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  const [, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [extraLinks, setExtraLinks] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY === 0);
      setLastScrollY(currentScrollY);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
      handleResize(); // Initial check
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [lastScrollY]);

  return (
    <header className="fixed top-0 left-0 w-full text-white z-50 backdrop-blur-lg bg-black/75">
      {/* Top Bar: Contact & Socials - visible only on lg and above */}
      <div className="hidden lg:flex justify-between items-center px-6 py-2 text-base font-medium">
        <div className="flex items-center space-x-5">
          <span>📞 0422 306 777</span>
          <span>✉ contact@bluemoonrestaurants.com</span>
        </div>
        <div className="flex items-center flex-row-reverse">
          {/* Admin icon (on right side) */}
          <div className="ml-10">
            <Link href="/admin">
              <FaUser className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
            </Link>
          </div>
          <div className="flex space-x-3">
            <a href="/QRCode.jpg" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
            </a>
            <Link href="https://www.facebook.com/bluemmoonrestaurant/" target="_blank">
              <Facebook className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
            </Link>
            <Link href="https://www.youtube.com/channel/UCjDVQoe48ygvcF4a3lRiz7w" target="_blank">
              <Youtube className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
            </Link>
            <a href="https://www.instagram.com/bluemoonrestaurant1/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Top Social Icons (above nav) */}
      {isMobile && (
        <div className="flex justify-end px-6 pt-2 space-x-4 xl:hidden lg:hidden">
          <a href="/QRCode.jpg" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="w-5 h-5" />
          </a>
          <Link href="https://www.facebook.com/bluemmoonrestaurant/" target="_blank">
            <Facebook className="w-5 h-5" />
          </Link>
          <Link href="https://www.youtube.com/channel/UCjDVQoe48ygvcF4a3lRiz7w" target="_blank">
            <Youtube className="w-5 h-5" />
          </Link>
          <a href="https://www.instagram.com/bluemoonrestaurant1/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>
      )}

      {/* Navbar Main Section */}
      <nav className="py-4 shadow-md px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Image
            src="/LOGO.jpg"
            alt="Bluemoon Logo"
            width={65}
            height={65}
            className="rounded-full"
          />
          <div className="leading-tight text-left">
            <h1 className="text-[1.65rem] font-medium uppercase tracking-wide text-blue-600 drop-shadow-md animate-slide-in">
              BLUEMOON
            </h1>
            <p className="text-[1.6rem] font-medium uppercase tracking-wide text-gray-300 drop-shadow-md animate-slide-in">
              RESTAURANT
            </p>
          </div>
        </div>

        {/* Desktop Navbar */}
        {!isMobile && (
          <ul className="flex space-x-6 text-lg font-medium items-center">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/menu">Menu</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/delivery">Delivery</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/cooking">Cooking Videos</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/table">Reservation</Link></li>

            {extraLinks && (
              <>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/order">Online Order</Link></li>
              </>
            )}

            {/* More Button */}
            <button
              onClick={() => setExtraLinks(!extraLinks)}
              className="cursor-pointer ml-4"
            >
              <MoreHorizontal
                className={`w-6 h-6 transition-transform duration-200 ${
                  extraLinks ? "text-gray-400" : "hover:scale-110"
                }`}
              />
            </button>
          </ul>
        )}

       {/* Always-visible Admin Icon on Small Screens */}
        {isMobile && (
          <Link href="/admin" className="mr-[-25px] xl:hidden lg:hidden md:mr-[-400px]">
            <FaUser className="w-6 h-5 cursor-pointer hover:scale-105 transition-transform duration-200" />
          </Link>
        )}

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} className="block">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </nav>

      {/* Mobile Menu Content */}
      {menuOpen && isMobile && (
        <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black/90 to-black/90 backdrop-blur-lg p-6 z-50 overflow-y-auto">
          {/* Logo & Close */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Image
                src="/LOGO.jpg"
                alt="Bluemoon Logo"
                width={55}
                height={55}
                className="rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold tracking-wide">BLUEMOON</h1>
                <p className="text-sm tracking-wider">RESTAURANT</p>
              </div>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Links */}
          <ul className="flex flex-col items-center space-y-4 text-lg font-medium">
            {[
              { href: "/", label: "Home" },
              { href: "/menu", label: "Menu" },
              { href: "/about", label: "About Us" },
              { href: "/delivery", label: "Delivery" },
              { href: "/cooking", label: "Cooking Videos" },
              { href: "/blog", label: "Blog" },
              { href: "/gallery", label: "Gallery" },
              { href: "/table", label: "Table Reservation" },
              { href: "/contact", label: "Contact Us" },
              { href: "/order", label: "Online Order" },
              { href: "/admin", label: "Admin" },
            ].map((item) => (
              <li
                key={item.href}
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer border-b border-white/20 w-full text-center py-4"
              >
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
