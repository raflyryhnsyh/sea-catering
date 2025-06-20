import React from "react";
import Navbar from "@/components/navbar/navbar";

function PageWithNavbar({ children }: { children: React.ReactNode }) {
  return (
    <>
        <Navbar />
        <main>
            {children}
        </main>  
    </>
  );
}

export default PageWithNavbar;
