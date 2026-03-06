'use client'

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
    return path === pathname
  }, [path, pathname])

  return (
    <div
      onClick={onClick}
      title={isCollapsed ? name : ""}
      className={clsx(
        "flex items-center gap-2",
        isCollapsed ? "justify-center px-3" : "px-3",
        "py-2",
        "rounded-lg",
        "cursor-pointer",
        "text-white/80",
        "border border-transparent",
        "bg-transparent",
        "transition-all duration-300 ease-out",
        "hover:bg-white/10",
        "hover:backdrop-blur-md",
        "hover:border-white/20",
        "hover:text-white",
        "hover:shadow-[0_8px_32px_rgba(255,255,255,0.08)]",
        "active:scale-[0.98]",
        isActive && "bg-white/10 backdrop-blur-md border-white/20 text-white shadow-[0_8px_32px_rgba(255,255,255,0.08)]"
      )}
    >
      <Icon size={20} className="shrink-0" />

      {/* Smooth text animation (no glitch) */}
      <span
        className={clsx(
          "whitespace-nowrap text-sm font-semibold",
          "transition-all duration-300 ease-in-out",
          isCollapsed
            ? "opacity-0 -translate-x-2 w-0 overflow-hidden"
            : "opacity-100 translate-x-0 w-auto"
        )}
      >
        {name}
      </span>
    </div>
  )
}

export default SidebarContent
