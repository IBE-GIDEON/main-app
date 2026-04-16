"use client";

import React, { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

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

const SidebarContent = ({ item, isCollapsed }: { item: Isidebaritem; isCollapsed: boolean }) => {
  const { name, icon: Icon, path } = item
  const router = useRouter()
  const pathname = usePathname()

  const onClick = () => {
    router.push(path)
  }

  const isActive = useMemo(() => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }, [path, pathname])

  return (
    <div
      onClick={onClick}
      title={isCollapsed ? name : ""}
      className={clsx(
        "flex items-center w-full p-2 rounded-lg cursor-pointer",
        "transition-all duration-300 ease-out active:scale-[0.98]",
        isActive 
          // THE FIX: Added light mode background (bg-zinc-100) and dark text (text-zinc-900)
          ? "bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white font-medium shadow-sm"
          // THE FIX: Added light mode hover states and inactive text colors
          : "text-zinc-500 bg-transparent hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200"
      )}
    >
      {/* Fixed-width icon container */}
      <div className="flex items-center justify-center w-8 h-8 shrink-0 transition-colors">
        <Icon size={18} />
      </div>

      {/* Zero-jitter text reveal via max-width */}
      <div
        className={clsx(
          "flex flex-col justify-center overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-2"
        )}
      >
        <span className="whitespace-nowrap text-[13px]">{name}</span>
      </div>
    </div>
  )
}

export default SidebarContent
