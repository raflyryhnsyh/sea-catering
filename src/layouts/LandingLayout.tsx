import React from "react";
import Navbar from "@/components/navbar/navbar";

function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <Navbar />
        <main>
            {children}
        </main>  
    </>
  );
}

export default LandingLayout;
