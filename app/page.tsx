"use client";
import { useState, useEffect } from "react"; // Import useState and useEffect
import {
  Navbar,
  Hero,
  Stats,
  Billing,
  Business,
  CardDeal,
  Testimonials,
  Clients,
  CTA,
  Footer,
} from "./components";
import Login from "./components/Login";
import { motion } from "framer-motion";
import { navVariants } from "./styles/animations";
import { logo } from "@/public";
import Image from "next/image";

export default function Home() {
  // State to manage login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if there's a token in localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      setIsLoggedIn(true); // If a token exists, mark the user as logged in
    }
  }, []); // Run only once when the component mounts

  // Handle successful login
  const handleLogin = (token: string) => {
    localStorage.setItem("token", token); // Save the token to localStorage
    setIsLoggedIn(true); // Set logged-in status to true
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setIsLoggedIn(false); // Set logged-in status to false
  };

  return (
    <main className=" bg-primary w-full overflow-hidden font-poppins">
      {/* Render Login component if not logged in */}
      {!isLoggedIn && (
        <>
          <motion.nav
            className="w-full flex justify-center items-center mt-16" // Center the logo
            variants={navVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Image
              src={logo}
              alt="hoobank"
              width={160}
              height={124}
              loading="eager"
            />
          </motion.nav>

          <section className="bg-primary flex flex-col items-center justify-start min-h-screen overflow-auto">
            {/* Make the section take at least full screen height and be scrollable */}
            <section className="boxWidth">
              {" "}
              {/* Add margin to separate logo from the login */}
              <Login onLogin={handleLogin} />
            </section>
          </section>
        </>
      )}

      {/* Render the rest of the components if logged in */}
      {isLoggedIn && (
        <>
          <header className="paddingX flexCenter">
            <nav className="boxWidth">
              <Navbar />
            </nav>
          </header>

          <section className="bg-primary flexStart">
            <section className="boxWidth">
              <Hero />
            </section>
          </section>

          <section className=" bg-primary paddingX flexStart">
            <section className="boxWidth">
              <Stats />
              <Business />
              <Billing />
              <CardDeal />
              <Testimonials />
              <Clients />
              <CTA />
              <Footer />
            </section>
          </section>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="absolute top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </>
      )}
    </main>
  );
}
