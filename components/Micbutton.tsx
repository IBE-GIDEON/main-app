"use client"
type MicbuttonProps = {
    onClick: () => void
    disabled?: boolean;
}

import { Mic } from "lucide-react"
export default function Micbutton({ onClick, disabled = false }: MicbuttonProps) {
    return(
    <div>
        <button
         type="button"
         onClick={onClick}
         disabled={disabled}
            className="p-2.5 text-white/70 transition-all duration-300 hover:scale-110 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:p-4">
             
     
        
              <Mic size={22}  />
            </button>
    </div>
    )
 }
    
