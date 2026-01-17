"use client"
import React from "react";
type MicbuttonProps = {
    onClick: () => void
}

import { Mic } from "lucide-react"
export default function Micbutton({ onClick }: MicbuttonProps) {
    return(
    <div>
        <button
         onClick={onClick}
           
            className="p-4 text-white/70 hover:text-white transition-all duration-300 hover:scale-110">
            
    
        
              <Mic size={22}  />
            </button>
    </div>
    )
 }
    