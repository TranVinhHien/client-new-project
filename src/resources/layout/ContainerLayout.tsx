"use client"
import { useRouter } from "next/navigation";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import { Toaster } from "@/components/ui/toaster";

const Layout = ({ children }:
    {
        children: ReactNode
    }) => {
    const router = useRouter()
    //// check login 
    // useEffect(() => {
    //     if (!cookies.get(ACCESS_TOKEN) || !localStorage.getItem(ROLE_USER)) {
    //         if (!cookies.get(ACCESS_TOKEN)) {
    //             localStorage.clear();
    //             router.push(ROUTER.auth.login)
    //         }
    //     }
    // }, [])
    const [stateLayout, setStateLayout] = useState(false);
    const HandleStateLayout = (state: boolean) => {
        setStateLayout(state)
    }
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const sidebarStyle: CSSProperties = {
        // width: '250px',
        // height: '100vh',
        // backgroundColor: '#2c3e50',
        // color: 'white',
        // padding: '20px',


        position: 'fixed',
        left: isSidebarVisible ? '0' : '-325px',
        top: '40px',
        transition: 'left 0.3s ease',
        // marginRight: "2rem"
    };

    const mainContentStyle: CSSProperties = {
        marginLeft: isSidebarVisible ? '284px' : '0',
        padding: '20px',
        width: isSidebarVisible ? 'calc(100% - 284px)' : '100%',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        // backgroundColor: '#2c3e50',
        paddingLeft: isSidebarVisible ? "4rem" : "20px",
    };

    return (
        <div>
            <div >
                <div className="">
                    <Toaster />

                    <div className="">
                        <Header onClick={toggleSidebar} />
                    </div>
                    <div className="relative pt-0">
                        <div style={sidebarStyle}>
                            <Sidebar />
                        </div>
                        <div className="" style={{ flex: 1, ...mainContentStyle }}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
