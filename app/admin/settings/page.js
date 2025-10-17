"use client"

import { useState } from "react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    searchEngineIndexing: true,
    darkMode: false,
  })

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Settings</h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Allow Search Engine Indexing</h3>
              <p className="text-sm text-gray-600 mt-1">
                Enable or disable search engine crawlers from indexing your blog content
              </p>
            </div>
            <button
              onClick={() => handleToggle("searchEngineIndexing")}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                settings.searchEngineIndexing ? "bg-blog-purple-dark" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.searchEngineIndexing ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Current Status:</span>{" "}
              {settings.searchEngineIndexing ? "Enabled" : "Disabled"}
            </p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 opacity-60">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Dark Mode</h3>
              <p className="text-sm text-gray-600 mt-1">Enable dark mode for the admin dashboard interface</p>
            </div>
            <button
              disabled
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-300 cursor-not-allowed"
            >
              <span className="inline-block h-6 w-6 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Coming Soon:</span> This feature will be available in a future update
            </p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">General Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Blog Title</p>
                <p className="text-sm text-gray-600">MyBlog</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-blog-purple-dark hover:bg-purple-50 rounded-lg transition">
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Blog Description</p>
                <p className="text-sm text-gray-600">Your Corner of the Web.</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-blog-purple-dark hover:bg-purple-50 rounded-lg transition">
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Posts Per Page</p>
                <p className="text-sm text-gray-600">10 posts per page</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-blog-purple-dark hover:bg-purple-50 rounded-lg transition">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
