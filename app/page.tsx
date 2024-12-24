"use client";
import { useState } from "react"; // Import useState hook
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

  // Handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true); // Set logged-in status to true
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
        </>
      )}
    </main>
  );
}
