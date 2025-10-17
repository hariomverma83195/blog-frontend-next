"use client"

import { useEffect, useState } from "react"
import { fetchApi, getAuthToken } from "@/lib/api"
import { StatCard } from "@/components/stat-card"

export default function CommentsPage() {
  const [comments, setComments] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const token = getAuthToken()
    try {
      const [commentsData, statsData] = await Promise.all([
        fetchApi("/admin/comments", "GET", null, token),
        fetchApi("/admin/overview", "GET", null, token),
      ])

      setComments(commentsData || [])
      setStats(statsData || { totalComments: 0, pendingComments: 0, approvedComments: 0 })
    } catch (error) {
      console.error("Failed to load comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id) => {
    const token = getAuthToken()
    try {
      await fetchApi(`/admin/comments/${id}/approve`, "PUT", null, token)
      alert("Comment approved!")
      loadData()
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    const token = getAuthToken()
    try {
      await fetchApi(`/admin/comments/${id}`, "DELETE", null, token)
      alert("Comment deleted successfully!")
      loadData()
    } catch (error) {
      alert(`Error: ${error.message}`)
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
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Comments</h2>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Comments"
          value={stats?.totalComments || 0}
          iconBg="bg-indigo-200/50"
          iconColor="text-indigo-600"
          changeText="8% comments this week"
          changeColor="text-green-500"
          direction="up"
          iconPath="M7 8h10M7 12h4m1-8h10M7 16h10m2-15H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"
        />
        <StatCard
          title="Pending Comments"
          value={stats?.pendingComments || 0}
          iconBg="bg-yellow-100/50"
          iconColor="text-yellow-600"
          changeText="Check before approving"
          changeColor="text-yellow-600"
          direction="up"
          iconPath="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
        <StatCard
          title="Approved Comments"
          value={stats?.approvedComments || 0}
          iconBg="bg-blue-100/50"
          iconColor="text-blue-600"
          changeText="Approved this week"
          changeColor="text-blue-500"
          direction="up"
          iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </div>

      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3 text-left">AUTHOR</th>
                <th className="py-3 text-left">COMMENT</th>
                <th className="py-3 text-left">IN RESPONSE TO</th>
                <th className="py-3 text-left">STATUS</th>
                <th className="py-3 text-left">TIME</th>
                <th className="py-3 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <tr key={comment._id}>
                    <td className="py-3 pr-2 text-sm font-medium text-gray-900">{comment.author?.name || "Guest"}</td>
                    <td className="py-3 pr-2 text-sm text-gray-600 truncate max-w-xs">{comment.content}</td>
                    <td className="py-3 pr-2 text-sm text-indigo-600 truncate">
                      {comment.post?.title || "Deleted Post"}
                    </td>
                    <td className="py-3 pr-2">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          comment.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {comment.status}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(comment.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 text-center whitespace-nowrap text-sm font-medium">
                      {comment.status !== "approved" && (
                        <button
                          onClick={() => handleApprove(comment._id)}
                          className="text-gray-400 hover:text-green-600 transition mx-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-gray-400 hover:text-red-600 transition mx-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    No comments found.
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
