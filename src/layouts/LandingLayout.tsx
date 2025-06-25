import React from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/home/footer";

function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default LandingLayout;
