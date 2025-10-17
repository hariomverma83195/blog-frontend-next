"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { removeAuthToken, getAuthToken } from "@/lib/api"
import { useEffect, useState } from "react"

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [userRole, setUserRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUserRole(payload.role || "user")
      } catch (error) {
        console.error("Failed to decode token:", error)
        setUserRole("user")
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    removeAuthToken()
    router.push("/admin/login")
  }

  const isActive = (path) => pathname === path

  const allNavItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      adminOnly: false,
    },
    {
      href: "/admin/posts",
      label: "Posts",
      icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m-3 3l-4-4m0 0l-4 4m4-4v7",
      adminOnly: false,
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
      adminOnly: true,
    },
    {
      href: "/admin/comments",
      label: "Comments",
      icon: "M7 8h10M7 12h4m1-8h10M7 16h10m2-15H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z",
      adminOnly: false,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm-3-11a5.99 5.99 0 01-2-4h4a5.99 5.99 0 01-2 4z",
      adminOnly: true,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.942 3.333.942 2.759 2.457a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.574 1.515-.942 3.33-2.457 2.759a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.942-3.333-.942-2.759-2.457a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.574-1.515.942-3.33 2.457-2.759a1.724 1.724 0 002.573-1.066z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      adminOnly: true,
    },
  ]

  const navItems = allNavItems.filter((item) => {
    if (item.adminOnly && userRole !== "admin") {
      return false
    }
    return true
  })

  if (isLoading) {
    return null
  }

  return (
    <aside className="w-64 sidebar-bg flex flex-col pt-6 pb-4 fixed h-full z-10 shadow-2xl">
      <h1 className="text-xl font-extrabold text-white px-6 mb-8 border-b border-gray-700/50 pb-4">Blog Dashboard</h1>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-6 py-3 font-medium text-sm transition duration-150 ${
              isActive(item.href) ? "sidebar-active-item" : "text-gray-300 hover:bg-gray-700/30"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-6 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 py-3 font-medium text-sm text-red-400 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition duration-150"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
