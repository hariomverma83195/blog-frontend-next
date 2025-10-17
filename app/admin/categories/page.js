"use client"

import { useEffect, useState } from "react"
import { fetchApi, getAuthToken } from "@/lib/api"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [categoryName, setCategoryName] = useState("")

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const token = getAuthToken()
    try {
      const data = await fetchApi("/admin/categories", "GET", null, token)
      setCategories(data || [])
    } catch (error) {
      console.error("Failed to load categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openModal = (id = null, name = "") => {
    setEditingId(id)
    setCategoryName(name)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setCategoryName("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryName.trim()) {
      alert("Category name is required.")
      return
    }

    const token = getAuthToken()
    const isEdit = !!editingId
    const endpoint = isEdit ? `/admin/categories/${editingId}` : "/admin/categories"
    const method = isEdit ? "PUT" : "POST"

    try {
      await fetchApi(endpoint, method, { name: categoryName }, token)
      alert(isEdit ? "Category updated successfully!" : "Category created successfully!")
      closeModal()
      loadCategories()
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    const token = getAuthToken()
    try {
      await fetchApi(`/admin/categories/${id}`, "DELETE", null, token)
      alert("Category deleted successfully!")
      loadCategories()
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
        <h2 className="text-3xl font-extrabold text-gray-900">Categories</h2>
        <button
          onClick={() => openModal()}
          className="bg-blog-purple-dark hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
        >
          + Add New Category
        </button>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3 text-left">CATEGORY NAME</th>
                <th className="py-3 text-left">POST COUNT</th>
                <th className="py-3 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat._id}>
                    <td className="py-3 pr-2 text-sm font-medium text-gray-900">{cat.name}</td>
                    <td className="py-3 pr-2 text-sm text-gray-700">{cat.postCount || 0} Posts</td>
                    <td className="py-3 text-center whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal(cat._id, cat.name)}
                        className="text-gray-400 hover:text-indigo-600 transition mx-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
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
                  <td colSpan="3" className="py-6 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? "Edit Category" : "Add New Category"}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-gray-800 focus:ring-blog-purple-dark focus:border-blog-purple-dark sm:text-base transition"
                    placeholder="e.g., Technology, Recipes, Travel"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center bg-blog-purple-dark hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingId ? "Update" : "Save"} Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
