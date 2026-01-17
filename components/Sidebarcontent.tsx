
'use client'

import React, { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

interface Isidebaritem {
  name: string
  icon: LucideIcon
  path: string
  items?: Isubitem[]
}

interface Isubitem {
  name: string
  path: string
}

const SidebarContent = ({ item }: { item: Isidebaritem }) => {
  const { name, icon: Icon, path } = item
  const router = useRouter()
  const pathname = usePathname();

  const onClick = () => {
    router.push(path)
  };

  const isActive = useMemo(() =>{
    return path === pathname;
  }, [path,pathname]) 

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-2
        px-3 py-2
        rounded-lg
        cursor-pointer

        text-white/80
        border border-transparent

        bg-transparent
        transition-all duration-300 ease-out

        hover:bg-white/10
        hover:backdrop-blur-md
        hover:border-white/20
        hover:text-white
        hover:shadow-[0_8px_32px_rgba(255,255,255,0.08)]
        active:scale-[0.98]
     ${isActive && "bg-white/10 backdrop-blur-md border-white/20 text-white shadow-[0_8px_32px_rgba(255,255,255,0.08)] active:scale-[0.98]"} `}
    >
      <Icon size={20} className="shrink-0" />
      <p className="text-sm font-semibold">{name}</p>
    </div>
  )
}

export default SidebarContent
                               
