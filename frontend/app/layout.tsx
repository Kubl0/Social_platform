import './globals.css'
import React, {ReactNode} from "react";
import Navbar from "@/app/components/Navbar";
import {getServerSession} from "next-auth";
import {Metadata} from "next";
import SessionProvider from "@/app/components/SessionProvider";



export const metadata: Metadata = {
    title: 'SocialHub',
    description: '',
}

export default async function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    const session = await getServerSession();

    return (
        <html lang="en">
        <body>
        <SessionProvider session={session}>
            <Navbar/>
            {children}
        </SessionProvider>
        </body>
        </html>
    )
}
