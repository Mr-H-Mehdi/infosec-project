'use client';
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

export default function Home() {
  // State to manage login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true); // Set logged-in status to true
  };

  return (
    <main className=" bg-primary w-full overflow-hidden font-poppins">
      <header className="paddingX flexCenter">
        <nav className="boxWidth">
          <Navbar />
        </nav>
      </header>

      {/* Render Login component if not logged in */}
      {!isLoggedIn && (
        <section className=" bg-primary paddingX flexStart">
          <section className="boxWidth">
            <Login onLogin={handleLogin} />
          </section>
        </section>
      )}

      {/* Render the rest of the components if logged in */}
      {isLoggedIn && (
        <>
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
