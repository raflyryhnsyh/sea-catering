import React from "react";


function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
        <main>
            {children}
        </main>  
    </>
  );
}

export default PageWrapper;
