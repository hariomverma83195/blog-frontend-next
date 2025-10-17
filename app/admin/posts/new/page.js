"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchApi, getAuthToken } from "@/lib/api"
import dynamic from "next/dynamic"

const TinyMCEEditor = dynamic(() => import("@/components/tinymce-editor"), { ssr: false })

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [status, setStatus] = useState("draft")
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState("")
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      const token = getAuthToken()
      try {
        const data = await fetchApi("/admin/categories", "GET", null, token)
        setCategories(data || [])
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }

    loadCategories()
  }, [])

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setThumbnailPreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!title || !content || !categoryId) {
      alert("Please fill out all required fields.")
      setIsLoading(false)
      return
    }

    const token = getAuthToken()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("contentMarkdown", content)
    formData.append("category", categoryId)
    formData.append("status", status)
    if (thumbnail) {
      formData.append("thumbnail", thumbnail)
    }

    try {
      await fetchApi("/admin/posts", "POST", formData, token)
      alert("Post created successfully!")
      router.push("/admin/posts")
    } catch (error) {
      alert(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b pb-4 border-gray-200">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-0">Create New Post</h1>
        <a
          href="/admin/posts"
          className="flex items-center text-blog-purple-dark hover:text-purple-700 transition font-medium py-2 px-4 rounded-lg hover:bg-purple-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Posts
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 form-section col-span-1 lg:col-span-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Post Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-gray-800 focus:ring-blog-purple-dark focus:border-blog-purple-dark sm:text-base transition"
              placeholder="Enter a descriptive and compelling title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 col-span-1 lg:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 form-section">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-gray-800 focus:ring-blog-purple-dark focus:border-blog-purple-dark sm:text-sm transition"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 form-section">
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-gray-800 focus:ring-blog-purple-dark focus:border-blog-purple-dark sm:text-sm transition"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 form-section">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Thumbnail Image (Optional)</label>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <label
                htmlFor="thumbnail"
                className="file-upload-label flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 h-full"
              >
                <svg
                  className="w-8 h-8 mb-2 text-blog-purple-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <p className="font-medium">Drag 'n' drop or click to select file</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, or JPEG (Max 5MB)</p>
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/png, image/jpeg"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            </div>

            {thumbnailPreview && (
              <div className="w-full md:w-1/2 h-40 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative">
                <img
                  src={thumbnailPreview || "/placeholder.svg"}
                  alt="Thumbnail Preview"
                  className="object-cover w-full h-full"
                />
                <span className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  Preview
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 form-section">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
            Post Content <span className="text-red-500">*</span>
          </label>
          <TinyMCEEditor value={content} onChange={setContent} />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center bg-blog-purple-dark hover:bg-purple-700 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blog-purple-light focus:ring-opacity-75 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {isLoading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  )
}
