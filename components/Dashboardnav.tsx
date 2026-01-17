"use client"
import React from 'react'
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi'; 
import Image from 'next/image';
 
const Dashboardnav = () => {
  return (
    <div className='flex items-center justify-between m-2.5 h-10 absolute w-full top-0 left-0 pl-2 pr-12 text-white'>
    <span className='text-white/90 mt-3 ml-64 flex items-center gap-1 bg-white/10 border border-white/20 hover:bg-black font-semibold px-3 py-2 rounded-lg duration-300'><span>ThinQ AI</span><FiChevronDown /> 
    </span>
    <Link href={"/create-account"}>signin</Link>
    </div>
  )
}

export default Dashboardnav