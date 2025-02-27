"use client"
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.css' 
import Navabar from "@/components/Navabar";
import {SessionProvider} from "next-auth/react";  
import Providers from "./Providers";



export default function RootLayout({ children, session }) {
  return (
    <html lang="fr">
    <body>
    <SessionProvider session={session}> 
    <Providers>
        <Navabar/>
        {children}
        </Providers>
    </SessionProvider>  
    </body>
    </html>
  );
}
