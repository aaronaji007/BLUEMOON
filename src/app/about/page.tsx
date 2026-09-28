"use client";

import Image from 'next/image';
import Link from "next/link";
import { motion } from "framer-motion";

export default function About() { 
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#eef1f6] relative text-[#3345A7]">
            
            {/* Background Image*/}
            <div className="absolute inset-0 bg-black bg-opacity-30">
                <Image 
                    src="/base.jpg" // Replace with your uploaded image
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    quality={80}
                    className="opacity-10" // Adjust opacity for effect
                />
            </div>

            {/* Hero Section */}
            <div className="relative flex flex-col items-center justify-center h-80 bg-cover bg-center" 
                style={{ backgroundImage: "url('/base.jpg')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div> 
                <h2 className="text-5xl font-bold text-white z-10 drop-shadow-2xl tracking-wide animate-fadeIn mt-10">
                    About Us
                </h2>     
                <div className="w-24 h-1 bg-white mt-4 rounded-full z-10 animate-scaleIn"></div>
            </div>

            {/* Breadcrumbs */}
            <div className="relative z-10 flex justify-center items-center gap-2 text-gray-800 py-6 text-lg">
                <Link href="/" className="hover:text-gray-900 transition-all duration-200">
                    <span className="flex items-center gap-1">🏠 Home</span>
                </Link>
                <span className="text-gray-800">›</span>
                <span className="text-black font-medium">About</span>
            </div>

            {/* Content Section */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative z-10 max-w-6xl mx-auto py-12 px-6 flex flex-col md:flex-row items-center gap-12"
            >
                {/* Text Section */}
                <div className="md:w-1/2 space-y-6">
                    <h3 className="text-3xl font-bold text-[#192a89]">
                        Bringing Authentic Kerala Cuisine to Sydney 🍽️
                    </h3>
                    <p className="text-lg font-bold text-gray-900 leading-relaxed text-justify">
                        As the pioneers of authentic Kerala cuisine in Sydney, we take pride in preserving 
                        traditional flavors with excellence. Renowned for our rich culinary heritage, we offer 
                        an exceptional dining experience while also specializing in bulk catering services. 
                        Whether for intimate gatherings or large-scale events, our expertly crafted dishes 
                        bring the true taste of Kerala to every occasion.
                    </p>
                    <Link href="/menu">
                        <button className="mt-4 px-6 py-3 text-lg font-semibold text-white bg-[#3345A7] rounded-lg shadow-md 
                        hover:bg-[#1d2e6b] transition-all duration-300">
                            Explore Our Menu 🍛
                        </button>
                    </Link>
                </div>

                {/* Image Section */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="md:w-1/2"
                >
                    <Image 
                        src="/sec3.jpg" 
                        alt="Restaurant Interior" 
                        width={700} 
                        height={475} 
                        priority  
                        loading="eager"
                        placeholder="blur" 
                        blurDataURL="/sec3.jpg"
                        className="rounded-lg shadow-xl transform hover:scale-105 transition-all duration-500" 
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}
