"use client"

import { useEffect, useState } from "react"
import { fetchApi, getAuthToken } from "@/lib/api"
import { StatCard } from "@/components/stat-card"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const [recentComments, setRecentComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const token = getAuthToken()
      try {
        const [statsData, postsData, commentsData] = await Promise.all([
          fetchApi("/admin/overview", "GET", null, token),
          fetchApi("/admin/posts?limit=3", "GET", null, token),
          fetchApi("/admin/comments?limit=2&status=pending", "GET", null, token),
        ])

        setStats(statsData || { totalPosts: 124, totalComments: 856, totalViews: "23.4k", uploadCount: 543 })
        setRecentPosts(postsData || [])
        setRecentComments(commentsData || [])
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blog-purple-dark"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Dashboard</h2>

      <div className="grid grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Total Posts"
          value={stats?.totalPosts || 0}
          iconBg="bg-blog-purple-light/20"
          iconColor="text-blog-purple-dark"
          changeText="12% increase this month"
          changeColor="text-green-500"
          direction="up"
          iconPath="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatCard
          title="Comments"
          value={stats?.totalComments || 0}
          iconBg="bg-indigo-200/50"
          iconColor="text-indigo-600"
          changeText="8% increase this month"
          changeColor="text-green-500"
          direction="up"
          iconPath="M7 8h10M7 12h4m1-8h10M7 16h10m2-15H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"
        />
        <StatCard
          title="Visitors"
          value={stats?.totalViews || "0"}
          iconBg="bg-yellow-100/50"
          iconColor="text-yellow-600"
          changeText="18% increase this month"
          changeColor="text-green-500"
          direction="up"
          iconPath="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatCard
          title="Media Files"
          value={stats?.uploadCount || 0}
          iconBg="bg-red-100/50"
          iconColor="text-red-600"
          changeText="3% decrease this month"
          changeColor="text-red-500"
          direction="down"
          iconPath="M4 16l4.586-4.586a2 2 0 012.828 0L15 16m-2-4l4.586-4.586a2 2 0 012.828 0L20 12M12 20h9"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Recent Posts</h3>
            <a
              href="/admin/posts"
              className="text-blog-purple-dark text-sm font-medium hover:text-purple-700 transition"
            >
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="py-3 text-left">TITLE</th>
                  <th className="py-3 text-left">AUTHOR</th>
                  <th className="py-3 text-left">CATEGORY</th>
                  <th className="py-3 text-left">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <tr key={post._id}>
                      <td className="py-3 pr-2 text-sm font-medium text-gray-900">{post.title}</td>
                      <td className="py-3 pr-2 text-sm text-gray-700">{post.author?.name || "N/A"}</td>
                      <td className="py-3 pr-2 text-sm text-gray-700">{post.category?.name || "Uncategorized"}</td>
                      <td className="py-3 pr-2 text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-gray-500">
                      No recent posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/admin/posts/new"
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
              >
                <div className="initials-circle bg-blog-purple-dark mb-1 text-2xl font-light">+</div>
                <span className="text-sm font-semibold text-gray-700">New Post</span>
              </a>
              <a
                href="/admin/categories"
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
              >
                <div className="initials-circle bg-green-500 mb-1 text-xl font-light">C</div>
                <span className="text-sm font-semibold text-gray-700">New Category</span>
              </a>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Top Comments</h3>
              <a
                href="/admin/comments"
                className="text-blog-purple-dark text-sm font-medium hover:text-purple-700 transition"
              >
                View All
              </a>
            </div>
            <div className="space-y-4">
              {recentComments.length > 0 ? (
                recentComments.slice(0, 3).map((comment) => (
                  <div
                    key={comment._id}
                    className="flex space-x-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="initials-circle w-8 h-8 flex-shrink-0 bg-gray-300 text-gray-700 text-sm">
                      {comment.author?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "G"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{comment.author?.name || "Guest"}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 text-center">No comments.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
