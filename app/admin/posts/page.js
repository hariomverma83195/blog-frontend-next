"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { fetchApi, getAuthToken } from "@/lib/api"

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      const token = getAuthToken()
      try {
        const data = await fetchApi("/admin/posts", "GET", null, token)
        setPosts(data || [])
      } catch (error) {
        console.error("Failed to load posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    const token = getAuthToken()
    try {
      await fetchApi(`/admin/posts/${id}`, "DELETE", null, token)
      setPosts(posts.filter((p) => p._id !== id))
      alert("Post deleted successfully!")
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">All Posts</h2>
        <Link
          href="/admin/posts/new"
          className="bg-blog-purple-dark hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
        >
          + Add New Post
        </Link>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3 text-left">TITLE</th>
                <th className="py-3 text-left">AUTHOR</th>
                <th className="py-3 text-left">CATEGORY</th>
                <th className="py-3 text-left">STATUS</th>
                <th className="py-3 text-left">DATE</th>
                <th className="py-3 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post._id}>
                    <td className="py-3 pr-2 text-sm font-medium text-gray-900">{post.title}</td>
                    <td className="py-3 pr-2 text-sm text-gray-700">{post.author?.name || "N/A"}</td>
                    <td className="py-3 pr-2 text-sm text-gray-700">{post.category?.name || "Uncategorized"}</td>
                    <td className="py-3 pr-2">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : post.status === "draft"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 text-center whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/posts/${post._id}/edit`}
                        className="text-gray-400 hover:text-indigo-600 transition mx-1 inline-block"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
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
                    No posts found.
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
