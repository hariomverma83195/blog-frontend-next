"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getAuthToken } from "@/lib/api"
import { UserCircle } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [pendingCommentsCount, setPendingCommentsCount] = useState(0)

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/register"
  const hasPendingComments = pendingCommentsCount > 0 // Determine if a dot should show

  // Auth check and data fetching
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = getAuthToken()
      if (!isAuthPage) {
        if (!token) {
          router.push("/admin/login")
          return
        }
        
        // Fetch pending comments count
        try {
          const res = await fetch("https://blog-backend-next.onrender.com/api/admin/overview", {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
          if (res.ok) {
            const data = await res.json()
            // Set state using the count from the API response
            setPendingCommentsCount(data.pendingComments || 0) 
          } else {
            console.error("Failed to fetch admin overview data")
          }
        } catch (error) {
          console.error("Error during overview fetch:", error)
        }
      }
      setIsLoading(false)
    }
    
    checkAuthAndFetchData()
  }, [router, isAuthPage]) 

  // MODIFICATION: Handle notification click conditionally
  const handleNotificationClick = () => {
    if (hasPendingComments) {
      router.push("/admin/comments")
    } else {
      // Optional: You could show a small toast/message that says "No new notifications"
      // or simply do nothing, as required. We'll do nothing.
      console.log("No pending comments to review.")
    }
  }

  if (isLoading) {
    return null
  }

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <header className="h-10 flex justify-end items-center mb-6">
          <div className="flex items-center space-x-4">
            
            <button 
              className="relative text-gray-400 hover:text-gray-600 transition"
              onClick={handleNotificationClick} // Conditional click handler
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {hasPendingComments && (
                <span 
                  className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"
                  aria-label={`${pendingCommentsCount} pending comments`}
                  title={`${pendingCommentsCount} pending comments`}
                />
              )}
            </button>
            
            <div className="initials-circle bg-purple-100 border border-gray-200 shadow-md"><UserCircle className="w-8 h-8 text-black" /></div>
          </div>
        </header>
        <main id="content-area">{children}</main>
      </div>
    </div>
  )
}