"use client"
import { useRouter } from "next/navigation";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./footer";

const Layout = ({ children }:
    {
        children: ReactNode
    }) => {

    return (
        <div>
            <div>
                    <Toaster />
                        <Header onClick={()=>{}} />
                    <div className="mt-4"></div>
                    <div className="relative px-14" style={{ flex: 1 }}>
                            {children}
                    </div>
                    
                    <Footer />
            </div>
        </div>
    );
};

export default Layout;
