"use client";

import Image from 'next/image';
import React, { useEffect, useState } from "react";
import { motion} from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { UtensilsCrossed, ChefHat } from "lucide-react";
import { FaUtensils, FaLeaf, FaStar } from "react-icons/fa";
import Link from 'next/link';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import OfferItem from './components/offerCard';
import Reviews from './components/reviews';
import { BadgeDollarSign } from "lucide-react";

//import AddUserForm from "./components/AddUserForm";

export default function Home() {
  {/*Base Images */}
  const { ref: gapRef1, inView: gapInView1 } = useInView({ threshold: 0.0 });
  const { ref: gapRef2, inView: gapInView2 } = useInView({ threshold: 0.05 });
  const [currentIndex, setCurrentIndex] = useState(0);


  // Hero Section Transition
  const slides = [
    
    {
      image: "/1.jpg",
      title: "Experience the Essence of",
      highlight: "Flavors",
      subtitle: "Authentic Spices, Modern Taste",
      description: "Delicately curated dishes infused with tradition & creativity.",
      position: "bottom-10 left-7 text-center",
    },
    {
      image: "/sec11.jpg",
      title: "Kerala's Spice",
      highlight: "Reimagined",
      subtitle: "Fresh catches, bold flavors, a modern twist.",
      description: "A new chapter in coastal culinary artistry.",
      position: "bottom-20 right-5 transform -translate-x-1/2 text-center text-white",
    },
    {
      image: "/chef.png",
      title: "A New Chapter in Indian",
      highlight: "Cuisine",
      subtitle: "Fresh, Bold, Indian",
      description:
        "A new chapter in Kerala cuisine, blending tradition with modern culinary innovation.",
      position: "bottom-10 left-1/2 transform -translate-x-1/2 text-center",
    },
  ];  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white/95">

      {/* Hero Section Image */}
      <section className="relative h-[100vh] flex items-center justify-center text-white z-30  " id="hero-section" >
      <div className="absolute inset-0" >
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentIndex === index ? 1 : 0 }}
            transition={{ duration: 1.1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
          </motion.div>
        ))}
      </div>
      {/* Animated Text Content */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 2 }}
        className={`absolute ${slides[currentIndex].position} px-4 z-10`}
      >
        <h3 className="text-lg font-semibold tracking-wider">
          {slides[currentIndex].subtitle}
        </h3>
        <h1 className="text-5xl font-bold mt-2">
          {slides[currentIndex].title} <span className="block">{slides[currentIndex].highlight}</span>
        </h1>
        {slides[currentIndex].description && (
          <p className="text-lg mt-4 max-w-2xl">{slides[currentIndex].description}</p>
        )}
      </motion.div>
    </section>

     {/* Buttons */}
      <div className="relative z-30 w-full mt-10 px-4">
        <div className="bg-white py-5 flex flex-col md:flex-row justify-center gap-4 md:gap-6">
          <Link href="/table">
            <button className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 border border-[#3345A7] text-[#3345A7] text-base md:text-lg font-semibold rounded-lg hover:bg-[#3345A7] hover:text-white transition duration-300">
              RESERVE A TABLE
            </button>
          </Link>
          <Link href="/order">
            <button className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 border border-[#3345A7] text-[#3345A7] text-base md:text-lg font-semibold rounded-lg hover:bg-[#3345A7] hover:text-white transition duration-300">
              ONLINE PICKUP ORDERS
            </button>
          </Link>
          <Link href="/delivery">
            <button className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 border border-[#3345A7] text-[#3345A7] text-base md:text-lg font-semibold rounded-lg hover:bg-[#3345A7] hover:text-white transition duration-300">
              DELIVERY AVAILABLE
            </button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-6">
      {/* Glowing Icon Badge */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-full shadow-xl animate-pulse">
        <BadgeDollarSign className="w-6 h-6 text-white" />
      </div>

      {/* Enhanced Heading with Glow & Layered Effect */}
      <div className="relative">
        {/* White Background with Shadow */}
        <span className="absolute inset-0 -z-10 bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] px-6 py-2"></span>

        {/* Main Heading */}
        <h2 className="text-3xl lg:text-4xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 uppercase drop-shadow-md">
          Feast-Worthy Deal!
        </h2>

      </div>
    </div>

      <OfferItem/>


      <div className="relative z-10 w-full lg:mt-12">
        {/** First Section */}
        <div className="w-full relative py-12 md:py-16 overflow-hidden bg-cover bg-center bg-[url('/sec11.jpg')]">
          {/* Overlay for opacity effect */}
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative flex flex-col lg:flex-row w-[95%] md:w-11/12 mx-auto gap-8 md:gap-12">
            {/* Left Images Section */}
            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <div className="flex gap-4 flex-nowrap justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                  className="w-1/2"
                >
                  <Image
                    src="/1.jpg"
                    alt="Image Left 1"
                    width={250}
                    height={250}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="w-1/2"
                >
                  <Image
                    src="/2.jpg"
                    alt="Image Left 2"
                    width={250}
                    height={250}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </motion.div>
              </div>
            </div>

            {/* Right Text Section */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1.6 }}
              className="w-full lg:w-1/2 bg-white/90 p-6 md:p-10 text-[#3345A7] flex items-center justify-center rounded-2xl shadow-xl"
            >
              <div>
                <h3 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-[#3345A7]">
                  BLUEMOON RESTAURANT
                </h3>
                <h3 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-[#3345A7]">
                  KERALA CUISINE
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-[#3345A7]">
                  Embark on a culinary journey at Bluemoon Restaurant, where every dish is a celebration of
                  flavor and artistry. Our chefs meticulously select the finest ingredients, transforming
                  them into culinary masterpieces that tantalize the senses. From the first bite to the
                  lingering aftertaste, your dining experience with us will be nothing short of extraordinary.
                </p>
                <div className="mt-4 md:mt-6 flex justify-center md:justify-start">
                  <Link href="/menu">
                    <button className="px-5 py-3 md:px-6 md:py-3 border border-[#3345A7] text-[#3345A7] text-sm md:text-lg font-semibold rounded-lg hover:bg-[#3345A7] hover:text-white transition duration-300">
                      Discover More
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>



        {/* First Gap Section */}
        <div ref={gapRef1} className="h-[250px] relative">
          {gapInView1 && (
            <div className="fixed inset-0 w-full h-screen z-[-1]">
              <Image
                src="/sec3.jpg"
                alt="Fixed Background"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                quality={100}
                priority
                className="!opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
            </div>
          )}
        </div>


        {/** Second Section */}
        <div
          className="relative w-full bg-white/80 backdrop-blur-xl py-20 md:py-32 px-4 md:px-6 lg:px-0 text-gray-900 shadow-md border border-[#3345A7]/40"
          style={{
            backgroundImage: "url('/sec22.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative z-10 w-[90%] md:w-11/12 mx-auto flex justify-center lg:justify-end items-center">
            {/* Right Cards Section */}
            <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-6 md:ml-8 lg:ml-16 md:pl-6 lg:pl-12">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-[#3345A7]/60"
              >
                <UtensilsCrossed size={50} className="text-[#3345A7] mx-auto" />
                <h3 className="text-xl md:text-2xl font-semibold mt-4 text-center text-[#3345A7]">
                  Quality Food
                </h3>
                <p className="text-base md:text-lg mt-2 text-center text-gray-700">
                  &quot;Deliciously crafted dishes blending fresh, seasonal ingredients with authentic Indian spices and innovation.&quot;
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex-1 bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-[#3345A7]/60"
              >
                <ChefHat size={50} className="text-[#3345A7] mx-auto" />
                <h3 className="text-xl md:text-2xl font-semibold mt-4 text-center text-[#3345A7]">
                  Perfect Taste
                </h3>
                <p className="text-base md:text-lg mt-2 text-center text-gray-700">
                  &quot;Exceptional dishes blending fresh, seasonal ingredients with authentic Indian spices and innovative flair.&quot;
                </p>
              </motion.div>
            </div>
          </div>
        </div>


        {/* Second Gap Section */}
        <div ref={gapRef2} className="h-[250px] relative">
          {gapInView2 && (
            <div className="fixed inset-0 w-full h-screen z-[-1]">
              <Image
                src="/sec1.jpg"
                alt="Fixed Background"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                quality={100}
                priority
                className="!opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
            </div>
          )}
        </div>


        {/**Third Section */}
        <div>
          <section
            className="bg-white/60 py-16 px-4 md:px-6 text-center"
            style={{
              backgroundImage: "url('/sec11.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Animated Heading */}
            <motion.h2
              className="text-[#ffffff] text-2xl md:text-3xl font-bold uppercase tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              WHY PEOPLE LOVE US
            </motion.h2>

            <motion.p
              className="text-white text-base md:text-lg max-w-2xl mx-auto mt-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              viewport={{ once: true }}
            >
              At Bluemoon, we are passionate about delivering an exceptional dining experience that
              combines the best of traditional Indian cuisine with modern innovation.
            </motion.p>

            {/* Cards Section with Animation */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {[
                {
                  icon: <FaUtensils className="text-[#3345A7] text-4xl mx-auto mb-4" />,
                  title: "Authentic Flavors with a Modern Twist",
                  text: "Our menu reimagines classic Indian dishes with contemporary flair, creating a unique culinary experience that honors tradition while embracing innovation.",
                },
                {
                  icon: <FaLeaf className="text-[#3345A7] text-4xl mx-auto mb-4" />,
                  title: "Fresh, Seasonal Ingredients",
                  text: "We take pride in using only the freshest, seasonal ingredients to craft our dishes. This commitment ensures every meal is vibrant and nourishing.",
                },
                {
                  icon: <FaStar className="text-[#3345A7] text-4xl mx-auto mb-4" />,
                  title: "Memorable Dining Experience",
                  text: "Guests love Bluemoon for unforgettable dining experiences. Whether casual or special, we make every visit memorable with great food and hospitality.",
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  className="bg-white text-[#3345A7] border-2 border-[#3345A7] rounded-xl shadow-lg p-6 md:p-8 max-w-sm mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, delay: 0.6 * index }}
                  viewport={{ once: true }}
                >
                  {card.icon}
                  <h3 className="text-lg md:text-xl font-semibold text-center">{card.title}</h3>
                  <p className="text-[#3345A7] mt-3 text-center">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </section>         
    </div>
    
   
  <Reviews/>

  </div>
  </div>
  );
}

