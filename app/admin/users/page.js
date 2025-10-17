"use client"

import { useEffect, useState } from "react"
import { fetchApi, getAuthToken } from "@/lib/api"
import { StatCard } from "@/components/stat-card"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const token = getAuthToken()
    try {
      const [usersData, statsData] = await Promise.all([
        fetchApi("/admin/users", "GET", null, token),
        fetchApi("/admin/overview", "GET", null, token),
      ])

      setUsers(usersData || [])
      setStats(statsData || { totalUsers: 0 })
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "user":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blog-purple-dark"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Users</h2>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || users.length}
          iconBg="bg-purple-200/50"
          iconColor="text-blog-purple-dark"
          changeText={`${users.length} registered users`}
          changeColor="text-purple-600"
          direction="up"
          iconPath="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H3v10a6 6 0 006 6h6a6 6 0 006-6V9h-6a4 4 0 00-4-4z"
        />
      </div>

      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3 text-left">USERNAME</th>
                <th className="py-3 text-left">EMAIL</th>
                <th className="py-3 text-left">ROLE</th>
                <th className="py-3 text-left">JOINED DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="py-3 pr-2 text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="py-3 pr-2 text-sm text-gray-700">{user.email}</td>
                    <td className="py-3 pr-2">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                          user.role,
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
